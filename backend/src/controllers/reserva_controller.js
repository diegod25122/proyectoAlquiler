import Reserva from "../models/Reserva.js"
import Producto from "../models/Producto.js"
import mongoose from "mongoose"

// ─── 1. Registrar nueva reserva (Usuario logueado) ────────────────
export const registrarReserva = async (req, res) => {
    const { producto, materia, docente, proposito, horasSolicitadas, cantidad } = req.body

    if (!producto || !materia || !docente || !proposito || !horasSolicitadas) {
        return res.status(400).json({ msg: "Todos los campos académicos son obligatorios." })
    }

    try {
        const productoBD = await Producto.findById(producto)
        if (!productoBD || !productoBD.estado) {
            return res.status(404).json({ msg: "El producto no está disponible o no existe." })
        }
        if (productoBD.tipo !== "Prestable") {
            return res.status(400).json({ msg: "Solo los productos Prestables pueden reservarse." })
        }

        const cantidadFinal = Number(cantidad) || 1
        if (productoBD.stock < cantidadFinal) {
            return res.status(400).json({ msg: `Stock insuficiente. Disponible: ${productoBD.stock}` })
        }

        const nuevaReserva = new Reserva({
            usuario: req.usuarioHeader._id,   // ✅ campo real del modelo
            producto,
            materia,
            docente,
            proposito,
            horasSolicitadas: Number(horasSolicitadas),
            cantidad: cantidadFinal,           // ✅ campo real del modelo
            estado: "Pendiente"
        })

        await nuevaReserva.save()
        return res.status(201).json({
            msg: "Solicitud de reserva enviada. Espera la aprobación del taller.",
            reserva: nuevaReserva
        })

    } catch (error) {
        console.error("Error al registrar reserva:", error)
        return res.status(500).json({ msg: "Error interno al procesar la reserva", error: error.message })
    }
}

// ─── 2. Aprobar Reserva (Admin) ───────────────────────────────────
export const aprobarReserva = async (req, res) => {
    const { id } = req.params
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const reserva = await Reserva.findById(id).session(session)
        if (!reserva || reserva.estado !== "Pendiente") {
            await session.abortTransaction()
            return res.status(400).json({ msg: "La reserva no existe o ya no está en estado Pendiente." })
        }

        const producto = await Producto.findById(reserva.producto).session(session)
        if (!producto || producto.stock < reserva.cantidad) {
            await session.abortTransaction()
            return res.status(400).json({ msg: "Stock insuficiente para aprobar la reserva." })
        }

        // Descontar stock atómicamente
        producto.stock -= reserva.cantidad
        await producto.save({ session })

        // Calcular fecha estimada de devolución
        const fechaAprobacion = new Date()
        const fechaFin = new Date(fechaAprobacion.getTime() + reserva.horasSolicitadas * 60 * 60 * 1000)

        reserva.estado = "Aprobada"
        reserva.aprobadoPor = req.usuarioHeader._id
        reserva.fechaInicio = fechaAprobacion   // ✅ campo real del modelo
        reserva.fechaFin = fechaFin             // ✅ campo real del modelo
        await reserva.save({ session })

        await session.commitTransaction()
        return res.status(200).json({ msg: "Reserva aprobada exitosamente.", reserva })

    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({ msg: "Error al aprobar la reserva", error: error.message })
    } finally {
        session.endSession()
    }
}

// ─── 3. Rechazar Reserva (Admin) ──────────────────────────────────
export const rechazarReserva = async (req, res) => {
    const { id } = req.params
    const { motivoRechazo } = req.body

    try {
        const reserva = await Reserva.findById(id)
        if (!reserva || reserva.estado !== "Pendiente") {
            return res.status(400).json({ msg: "La reserva no está disponible para rechazo." })
        }

        reserva.estado = "Rechazada"
        reserva.observaciones = motivoRechazo || "No especificado"  // ✅ campo real del modelo
        reserva.aprobadoPor = req.usuarioHeader._id
        await reserva.save()

        return res.status(200).json({ msg: "Reserva rechazada.", reserva })
    } catch (error) {
        return res.status(500).json({ msg: "Error al rechazar reserva", error: error.message })
    }
}

// ─── 4. Marcar como entregada (Admin) ────────────────────────────
// Estado: Aprobada → Alquilada (el estudiante ya retiró la herramienta)
export const marcarEnUso = async (req, res) => {
    const { id } = req.params
    try {
        const reserva = await Reserva.findById(id)
        if (!reserva || reserva.estado !== "Aprobada") {
            return res.status(400).json({ msg: "La reserva debe estar en estado 'Aprobada' para entregarse." })
        }

        reserva.estado = "Alquilada"            // ✅ estado real del modelo
        reserva.fechaEntrega = new Date()       // ✅ campo real del modelo
        await reserva.save()

        return res.status(200).json({ msg: "Herramienta entregada. Reserva marcada como Alquilada.", reserva })
    } catch (error) {
        return res.status(500).json({ msg: "Error al actualizar estado", error: error.message })
    }
}

// ─── 5. Marcar como devuelta (Admin) ──────────────────────────────
// Estado: Alquilada → Devuelta + restaura stock
export const marcarDevuelto = async (req, res) => {
    const { id } = req.params
    const { observacionesAdmin } = req.body
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const reserva = await Reserva.findById(id).session(session)
        if (!reserva || reserva.estado !== "Alquilada") {  // ✅ estado real del modelo
            await session.abortTransaction()
            return res.status(400).json({ msg: "Solo se pueden devolver herramientas en estado 'Alquilada'." })
        }

        const producto = await Producto.findById(reserva.producto).session(session)
        if (producto) {
            producto.stock += reserva.cantidad   // ✅ restaurar con campo real
            await producto.save({ session })
        }

        reserva.estado = "Devuelta"              // ✅ estado real del modelo
        reserva.observaciones = observacionesAdmin || reserva.observaciones  // ✅ campo real
        await reserva.save({ session })

        await session.commitTransaction()
        return res.status(200).json({ msg: "Herramienta devuelta e inventario reabastecido.", reserva })

    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({ msg: "Error al registrar la devolución", error: error.message })
    } finally {
        session.endSession()
    }
}

// ─── 6. Listar mis reservas (Usuario) ────────────────────────────
export const listarMisReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.usuarioHeader._id })  // ✅
            .populate("producto", "nombre codigoInventario imagen categoria")
            .sort({ createdAt: -1 })
        return res.status(200).json(reservas)
    } catch (error) {
        return res.status(500).json({ msg: "Error al obtener tus reservas", error: error.message })
    }
}

// ─── 7. Listar todas las reservas (Admin) ────────────────────────
export const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate("usuario", "nombre apellido cedula email facultad")  // ✅
            .populate("producto", "nombre codigoInventario imagen")
            .populate("aprobadoPor", "nombre apellido")
            .sort({ createdAt: -1 })
        return res.status(200).json(reservas)
    } catch (error) {
        return res.status(500).json({ msg: "Error al obtener reservas", error: error.message })
    }
}