// controllers/reserva_controller.js
import Reserva from "../models/Reserva.js"
import Producto from "../models/Producto.js"
import mongoose from "mongoose"

// 1. Registrar nueva solicitud de reserva (Estudiante / Docente)
export const registrarReserva = async (req, res) => {
    const { producto, materia, docente, proposito, horasSolicitadas, cantidadSolicitada } = req.body

    // Validar campos requeridos
    if (!producto || !materia || !docente || !proposito || !horasSolicitadas || !cantidadSolicitada) {
        return res.status(400).json({ msg: "Todos los campos académicos son obligatorios." })
    }

    try {
        // Verificar que el producto exista y sea PRESTABLE
        const productoBD = await Producto.findById(producto)
        if (!productoBD || !productoBD.estado) {
            return res.status(404).json({ msg: "El producto solicitado no está disponible o no existe." })
        }

        if (productoBD.tipo !== "Prestable") {
            return res.status(400).json({ msg: "Solo los productos de tipo 'Prestable' pueden ser reservados." })
        }

        if (productoBD.stock < cantidadSolicitada) {
            return res.status(400).json({ msg: `Stock insuficiente. Disponible: ${productoBD.stock}` })
        }

        // Crear la reserva vinculada al usuario autenticado via JWT
        const nuevaReserva = new Reserva({
            producto,
            solicitadoPor: req.usuarioHeader._id, // Tomado del middleware de autenticación
            materia,
            docente,
            proposito,
            horasSolicitadas: Number(horasSolicitadas),
            cantidadSolicitada: Number(cantidadSolicitada),
            estado: "Pendiente"
        })

        await nuevaReserva.save()
        res.status(201).json({ msg: "Solicitud de reserva enviada con éxito. Espera la aprobación del taller.", reserva: nuevaReserva })

    } catch (error) {
        console.error("Error al registrar reserva:", error)
        res.status(500).json({ msg: "Error interno al procesar la reserva", error: error.message })
    }
}

// 2. Aprobar Reserva (Admin) - Descuenta stock y calcula fecha esperada de devolución
export const aprobarReserva = async (req, res) => {
    const { id } = req.params
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const reserva = await Reserva.findById(id).session(session)
        if (!reserva || reserva.estado !== "Pendiente") {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({ msg: "La reserva no existe o ya no se encuentra en estado Pendiente." })
        }

        const producto = await Producto.findById(reserva.producto).session(session)
        if (!producto || producto.stock < reserva.cantidadSolicitada) {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({ msg: "Stock insuficiente en taller para aprobar la reserva." })
        }

        // Descontar stock atómicamente
        producto.stock -= reserva.cantidadSolicitada
        await producto.save({ session })

        // Calcular fecha estimada de devolución según las horas permitidas
        const fechaAprobacion = new Date()
        const fechaDevolucionEsperada = new Date(fechaAprobacion.getTime() + reserva.horasSolicitadas * 60 * 60 * 1000)

        reserva.estado = "Aprobada"
        reserva.aprobadoPor = req.usuarioHeader._id
        reserva.fechaAprobacion = fechaAprobacion
        reserva.fechaDevolucionEsperada = fechaDevolucionEsperada
        await reserva.save({ session })

        await session.commitTransaction()
        session.endSession()

        res.status(200).json({ msg: "Reserva aprobada exitosamente.", reserva })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ msg: "Error al aprobar la reserva", error: error.message })
    }
}

// 3. Rechazar Reserva (Admin)
export const rechazarReserva = async (req, res) => {
    const { id } = req.params
    const { motivoRechazo } = req.body

    try {
        const reserva = await Reserva.findById(id)
        if (!reserva || reserva.estado !== "Pendiente") {
            return res.status(400).json({ msg: "La reserva no está disponible para rechazo." })
        }

        reserva.estado = "Rechazada"
        reserva.motivoRechazo = motivoRechazo || "No especificado"
        reserva.aprobadoPor = req.usuarioHeader._id
        await reserva.save()

        res.status(200).json({ msg: "Reserva rechazada.", reserva })
    } catch (error) {
        res.status(500).json({ msg: "Error al rechazar reserva", error: error.message })
    }
}

// 4. Marcar en uso (Admin - Entregado en el taller)
export const marcarEnUso = async (req, res) => {
    const { id } = req.params
    try {
        const reserva = await Reserva.findById(id)
        if (!reserva || reserva.estado !== "Aprobada") {
            return res.status(400).json({ msg: "La reserva debe estar en estado 'Aprobada' para entregarse." })
        }

        reserva.estado = "EnUso"
        await reserva.save()

        res.status(200).json({ msg: "Herramienta entregada. Reserva marcada en uso.", reserva })
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar estado a EnUso", error: error.message })
    }
}

// 5. Marcar devuelto (Admin - Recibido en el taller y restaura el stock)
export const marcarDevuelto = async (req, res) => {
    const { id } = req.params
    const { observacionesAdmin } = req.body
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const reserva = await Reserva.findById(id).session(session)
        if (!reserva || reserva.estado !== "EnUso") {
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({ msg: "Solo se pueden devolver herramientas que estén actualmente 'EnUso'." })
        }

        // Devolver stock al inventario atómicamente
        const producto = await Producto.findById(reserva.producto).session(session)
        if (producto) {
            producto.stock += reserva.cantidadSolicitada
            await producto.save({ session })
        }

        reserva.estado = "Devuelto"
        reserva.fechaDevolucionReal = new Date()
        if (observacionesAdmin) reserva.observacionesAdmin = observacionesAdmin
        await reserva.save({ session })

        await session.commitTransaction()
        session.endSession()

        res.status(200).json({ msg: "Herramienta devuelta e inventario reabastecido correctamente.", reserva })
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ msg: "Error al registrar la devolución", error: error.message })
    }
}

// 6. Listar mis reservas (Usuario)
export const listarMisReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find({ solicitadoPor: req.usuarioHeader._id })
            .populate("producto", "nombre codigoInventario imagen categoria")
            .sort({ createdAt: -1 })
        res.status(200).json(reservas)
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener tus reservas", error: error.message })
    }
}

// 7. Listar todas las reservas (Admin)
export const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate("producto", "nombre codigoInventario imagen")
            .populate("solicitadoPor", "nombre apellido cedula email facultad")
            .sort({ createdAt: -1 })
        res.status(200).json(reservas)
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el listado general de reservas", error: error.message })
    }
}