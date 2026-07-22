import OrdenCompra from "../models/OrdenCompra.js"
import Producto from "../models/Producto.js"
import mongoose from "mongoose"
import Stripe from "stripe"
import cron from "node-cron"

const getStripeClient = () => {
    const apiKey = process.env.STRIPE_PRIVATE_KEY

    if (!apiKey) {
        throw new Error("Falta la clave privada de Stripe (STRIPE_PRIVATE_KEY) en el archivo .env")
    }

    return new Stripe(apiKey)
}

/* ============================================================
   HELPER: Manejo centralizado de errores
   ============================================================ */
const manejarError = (error, res) => {
    if (error instanceof mongoose.Error.ValidationError) {
        const detalles = Object.values(error.errors).map(e => e.message)
        return res.status(400).json({ msg: "Error de validación", detalles })
    }

    if (error?.message?.includes("STRIPE_PRIVATE_KEY")) {
        return res.status(500).json({ msg: error.message })
    }

    if (error?.type === "StripeInvalidRequestError") {
        return res.status(400).json({ msg: `Error de Stripe: ${error.message}` })
    }

    if (error?.type === "StripeAuthenticationError") {
        return res.status(401).json({ msg: "La clave de Stripe es inválida o no tiene permisos." })
    }

    console.error("Error en ordenCompra.controller:", error)
    return res.status(500).json({ msg: `❌ Error en el servidor: ${error?.message || "Error inesperado"}` })
}

/* ============================================================
   1. CREAR ORDEN (Usuario)
   ============================================================ */
const crearOrden = async (req, res) => {
    const { items } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: "La orden debe contener al menos un artículo" })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let total = 0
        const itemsOrden = []

        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.productoId)) {
                await session.abortTransaction()
                return res.status(400).json({ msg: `ID de producto inválido: ${item.productoId}` })
            }

            const producto = await Producto.findById(item.productoId).session(session)

            if (!producto) {
                await session.abortTransaction()
                return res.status(404).json({ msg: `Producto no encontrado: ${item.productoId}` })
            }
            if (producto.tipo !== "Consumible") {
                await session.abortTransaction()
                return res.status(400).json({ msg: `"${producto.nombre}" es Prestable, no se puede comprar. Usa el flujo de Reserva.` })
            }
            if (producto.stock < item.cantidad) {
                await session.abortTransaction()
                return res.status(400).json({ msg: `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}` })
            }

            // Descontar stock atómicamente
            await Producto.findByIdAndUpdate(
                item.productoId,
                { $inc: { stock: -item.cantidad } },
                { session }
            )

            const subtotal = producto.precio * item.cantidad
            total += subtotal

            itemsOrden.push({
                producto: producto._id,
                nombre: producto.nombre,        // snapshot
                cantidad: item.cantidad,
                precioUnitario: producto.precio // snapshot
            })
        }

        // Redondear total para evitar decimales infinitos
        total = Math.round(total * 100) / 100

        const stripe = getStripeClient()

        // Crear PaymentIntent y devolver `client_secret` para que el Frontend confirme
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // USD → centavos
            currency: "usd",
            description: `Orden de compra - POLI RENT`,
            // No establecer `payment_method` ni `confirm` aquí: el cliente debe
            // confirmar la intención con el `client_secret` y los datos de tarjeta.
            automatic_payment_methods: { enabled: true },
            metadata: { usuarioId: req.usuarioHeader._id.toString() }
        })
        // Guardar la orden con los datos de Stripe
        const nuevaOrden = new OrdenCompra({
            usuario: req.usuarioHeader._id,
            items: itemsOrden,
            total,
            stripePaymentIntentId: paymentIntent.id,
            stripeClientSecret: paymentIntent.client_secret
        })

        await nuevaOrden.save({ session })
        await session.commitTransaction()

        return res.status(201).json({
            msg: "Orden creada. Procede con el pago.",
            ordenId: nuevaOrden._id,
            total,
            clientSecret: paymentIntent.client_secret
        })

    } catch (error) {
        await session.abortTransaction()
        return manejarError(error, res)
    } finally {
        session.endSession()
    }
}

/* ============================================================
   2. CONFIRMAR PAGO (Usuario)
   ============================================================ */
const confirmarPago = async (req, res) => {
    try {
        const { ordenId, simularPagoExitoso } = req.body

        if (!mongoose.Types.ObjectId.isValid(ordenId)) {
            return res.status(400).json({ msg: "ID de orden inválido" })
        }

        const orden = await OrdenCompra.findById(ordenId)
        if (!orden) return res.status(404).json({ msg: "Orden no encontrada" })

        if (orden.estado === "Pagado") {
            return res.status(400).json({ msg: "Esta orden ya fue pagada" })
        }

        // Modo pruebas: omitir verificación Stripe solo en entorno de desarrollo
        const esModoDesarrollo = process.env.NODE_ENV !== "production"
        if (simularPagoExitoso && esModoDesarrollo) {
            orden.estado = "Pagado"
            await orden.save()
            return res.status(200).json({ msg: "✅ Pago simulado confirmado (modo pruebas)", orden })
        }

        const stripe = getStripeClient()

        // Verificar en Stripe que el pago realmente se procesó
        const paymentIntent = await stripe.paymentIntents.retrieve(orden.stripePaymentIntentId)

        if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({
                msg: `El pago no fue completado. Estado Stripe: ${paymentIntent.status}`
            })
        }

        orden.estado = "Pagado"
        await orden.save()

        return res.status(200).json({ msg: "✅ Pago confirmado exitosamente", orden })

    } catch (error) {
        return manejarError(error, res)
    }
}

/* ============================================================
   3. LISTAR MIS ÓRDENES (Usuario)
   ============================================================ */
const listarMisOrdenes = async (req, res) => {
    try {
        const ordenes = await OrdenCompra.find({ usuario: req.usuarioHeader._id })
            .select("-stripeClientSecret -__v")
            .sort({ createdAt: -1 })

        return res.status(200).json(ordenes)
    } catch (error) {
        return manejarError(error, res)
    }
}

/* ============================================================
   4. LISTAR TODAS LAS ÓRDENES (Admin)
   ============================================================ */
const listarOrdenes = async (req, res) => {
    try {
        const filtro = {}
        if (req.query.estado) filtro.estado = req.query.estado

        const ordenes = await OrdenCompra.find(filtro)
            .populate("usuario", "nombre apellido email cedula")
            .populate("verificadoPor", "nombre apellido")
            .select("-stripeClientSecret -__v")
            .sort({ createdAt: -1 })

        return res.status(200).json(ordenes)
    } catch (error) {
        return manejarError(error, res)
    }
}

/* ============================================================
   5. MARCAR COMO ENTREGADO (Admin)
   ============================================================ */
const marcarEntregado = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "Orden no encontrada" })
        }

        const orden = await OrdenCompra.findById(id)
        if (!orden) return res.status(404).json({ msg: "Orden no encontrada" })

        if (orden.estado !== "Pagado") {
            return res.status(400).json({ msg: "Solo se pueden entregar órdenes que ya fueron pagadas" })
        }

        orden.estado = "Entregado"
        orden.verificadoPor = req.usuarioHeader._id
        orden.fechaVerificacion = new Date()
        await orden.save()

        return res.status(200).json({ msg: "✅ Orden marcada como entregada", orden })
    } catch (error) {
        return manejarError(error, res)
    }
}

/* ============================================================
   6. CANCELAR ORDEN (Admin o Usuario)
   ============================================================ */
const cancelarOrden = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "Orden no encontrada" })
        }

        const orden = await OrdenCompra.findById(id).session(session)
        if (!orden) return res.status(404).json({ msg: "Orden no encontrada" })

        if (orden.estado !== "Pendiente") {
            await session.abortTransaction()
            return res.status(400).json({ msg: "Solo se pueden cancelar órdenes Pendientes" })
        }

        for (const item of orden.items) {
            await Producto.findByIdAndUpdate(
                item.producto,
                { $inc: { stock: item.cantidad } },
                { session }
            )
        }

        const stripe = getStripeClient()

        if (orden.stripePaymentIntentId) {
            try {
                await stripe.paymentIntents.cancel(orden.stripePaymentIntentId)
            } catch {
                // Ignorar error si ya estaba cancelado en Stripe
            }
        }

        orden.estado = "Cancelada"
        await orden.save({ session })
        await session.commitTransaction()

        return res.status(200).json({ msg: "✅ Orden cancelada y stock restaurado" })
    } catch (error) {
        await session.abortTransaction()
        return manejarError(error, res)
    } finally {
        session.endSession()
    }
}

/* ============================================================
   CRON: Expirar órdenes automáticamente
   ============================================================ */
export const iniciarCronExpiracion = () => {
    cron.schedule("*/10 * * * *", async () => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const expiradas = await OrdenCompra.find({
                estado: "Pendiente",
                expiraEn: { $lte: new Date() }
            }).session(session)

            for (const orden of expiradas) {
                for (const item of orden.items) {
                    await Producto.findByIdAndUpdate(
                        item.producto,
                        { $inc: { stock: item.cantidad } },
                        { session }
                    )
                }
                const stripe = getStripeClient()

                if (orden.stripePaymentIntentId) {
                    try {
                        await stripe.paymentIntents.cancel(orden.stripePaymentIntentId)
                    } catch {
                        // Ignorar si ya fue cancelado
                    }
                }
                orden.estado = "Expirada"
                await orden.save({ session })
            }

            await session.commitTransaction()
            if (expiradas.length > 0) {
                console.log(`⏰ Cron: ${expiradas.length} órdenes expiradas procesadas`)
            }
        } catch (error) {
            await session.abortTransaction()
            console.error("Error en cron de expiración:", error)
        } finally {
            session.endSession()
        }
    })
    console.log("✅ Cron de expiración de órdenes iniciado")
}

export {
    crearOrden,
    confirmarPago,
    listarMisOrdenes,
    listarOrdenes,
    marcarEntregado,
    cancelarOrden
}