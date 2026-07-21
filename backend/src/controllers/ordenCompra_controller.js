import OrdenCompra from "../models/OrdenCompra.js"
import Producto from "../models/Producto.js"
import mongoose from "mongoose"
import Stripe from "stripe"
import cron from "node-cron"

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

/* ============================================================
   HELPER: Manejo centralizado de errores
   ============================================================ */
const manejarError = (error, res) => {
    if (error instanceof mongoose.Error.ValidationError) {
        const detalles = Object.values(error.errors).map(e => e.message)
        return res.status(400).json({ msg: "Error de validación", detalles })
    }
    console.error("Error en ordenCompra.controller:", error)
    return res.status(500).json({ msg: "❌ Error en el servidor" })
}

/* ============================================================
   1. CREAR ORDEN (Usuario)
   - Valida que todos los productos sean Consumibles
   - Verifica stock disponible
   - Descuenta stock atómicamente con transacción Mongo
   - Crea PaymentIntent en Stripe
   - Guarda la orden con stripeClientSecret para el frontend
   ============================================================ */
const crearOrden = async (req, res) => {
    // items esperado: [{ productoId, cantidad }]
    const { items } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: "La orden debe contener al menos un artículo" })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        let total = 0
        const itemsOrden = []

        // Validar cada producto dentro de la transacción
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
                nombre: producto.nombre,       // snapshot
                cantidad: item.cantidad,
                precioUnitario: producto.precio // snapshot
            })
        }

        // Redondear total para evitar problemas de float (ej: 0.1 + 0.2 ≠ 0.3 en JS)
        total = Math.round(total * 100) / 100

        // Crear PaymentIntent en Stripe
        // amount en centavos (Stripe siempre trabaja en la unidad mínima de la moneda)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // USD → centavos
            currency: "usd",
            description: `Orden de compra - EPN ToolRental`,
            metadata: { usuarioId: req.usuarioHeader._id.toString() },
            automatic_payment_methods: { enabled: true, allow_redirects: "never" }
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

        // Devolvemos el clientSecret al frontend para que Stripe.js confirme el pago
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
   El frontend llama a este endpoint DESPUÉS de que Stripe.js
   confirme el pago con el clientSecret. Aquí solo verificamos
   el estado del PaymentIntent y actualizamos la orden.
   ============================================================ */
const confirmarPago = async (req, res) => {
    try {
        const { ordenId } = req.body

        if (!mongoose.Types.ObjectId.isValid(ordenId)) {
            return res.status(400).json({ msg: "ID de orden inválido" })
        }

        const orden = await OrdenCompra.findById(ordenId)
        if (!orden) return res.status(404).json({ msg: "Orden no encontrada" })

        if (orden.estado === "Pagado") {
            return res.status(400).json({ msg: "Esta orden ya fue pagada" })
        }

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
            .select("-stripeClientSecret -__v") // nunca exponer el clientSecret en listados
            .sort({ createdAt: -1 })

        return res.status(200).json(ordenes)
    } catch (error) {
        return manejarError(error, res)
    }
}

/* ============================================================
   4. LISTAR TODAS LAS ÓRDENES (Admin)
   Filtra por estado: ?estado=Pendiente
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
   Confirma que el estudiante retiró físicamente los consumibles
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
   6. CANCELAR ORDEN (Admin o Usuario dueño)
   Solo se pueden cancelar órdenes Pendientes (no pagadas aún)
   Restaura el stock de todos los ítems
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

        // Restaurar stock de cada ítem
        for (const item of orden.items) {
            await Producto.findByIdAndUpdate(
                item.producto,
                { $inc: { stock: item.cantidad } },
                { session }
            )
        }

        // Cancelar el PaymentIntent en Stripe para liberar los fondos retenidos
        if (orden.stripePaymentIntentId) {
            await stripe.paymentIntents.cancel(orden.stripePaymentIntentId)
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
   CRON: Expirar órdenes automáticamente cada 10 minutos
   Busca órdenes Pendientes cuya expiraEn ya pasó,
   las marca Expiradas y restaura el stock
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
                if (orden.stripePaymentIntentId) {
                    try {
                        await stripe.paymentIntents.cancel(orden.stripePaymentIntentId)
                    } catch {
                        // Si ya fue cancelado en Stripe, ignoramos el error
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