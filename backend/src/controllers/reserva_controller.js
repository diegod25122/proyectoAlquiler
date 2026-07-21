import Reserva from '../models/Reserva.js';
import mongoose from 'mongoose';
import { sendMailRechazoReserva } from '../helpers/sendMail.js'

const registrarReserva = async (req, res) => {
    try {
    const { producto, materia, docente, proposito, horasSolicitadas, cantidadSolicitada } = req.body

    if (!producto || !materia || !docente || !proposito || !horasSolicitadas)
        return res.status(400).json({ msg: "Debes llenar todos los campos" })


        if (!mongoose.Types.ObjectId.isValid(usuario))
            return res.status(400).json({ msg: `El ID del Usuario no es válido: ${usuario}` });

        if (!mongoose.Types.ObjectId.isValid(producto))
            return res.status(400).json({ msg: `El ID del producto no es válido: ${producto}` });

        const reserva = await Reserva.create({
            ...req.body,
            solicitadoPor: req.usuarioHeader._id
        });
        return res.status(201).json({ msg: "Reserva registrada correctamente", reserva });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` });
    }
};

const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate('usuario', 'nombre apellido email cedula')
            .populate('producto', 'nombre codigoInventario imagen')
            .populate('aprobadoPor', 'nombre apellido')
            .sort({ createdAt: -1 })
        res.status(200).json(reservas)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const aprobarReserva = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ msg: 'ID de reserva inválido' })

        const reserva = await Reserva.findById(id)
        if (!reserva) return res.status(404).json({ msg: 'Reserva no encontrada' })

        reserva.estado = 'Aprobada'
        reserva.aprobadoPor = req.usuarioHeader._id
        await reserva.save()

        res.status(200).json({ msg: 'Reserva aprobada correctamente' })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const rechazarReserva = async (req, res) => {
    try {
        const { id } = req.params
        const { motivo } = req.body

        if (!motivo?.trim())
            return res.status(400).json({ msg: 'Debes ingresar el motivo del rechazo' })

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ msg: 'ID de reserva inválido' })

        const reserva = await Reserva.findById(id)
            .populate('usuario', 'nombre apellido email')
            .populate('producto', 'nombre')

        if (!reserva) return res.status(404).json({ msg: 'Reserva no encontrada' })

        reserva.estado = 'Rechazada'
        reserva.observaciones = motivo.trim()
        reserva.aprobadoPor = req.usuarioHeader._id
        await reserva.save()

        try {
            const nombreUsuario = `${reserva.usuario.nombre} ${reserva.usuario.apellido}`
            await sendMailRechazoReserva(
                reserva.usuario.email,
                nombreUsuario,
                reserva.producto.nombre,
                motivo.trim()
            )
        } catch (emailErr) {
            console.error('Error enviando email de rechazo:', emailErr.message)
        }

        res.status(200).json({ msg: 'Reserva rechazada y notificación enviada al usuario' })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarMisReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.usuarioHeader._id })
            .populate('producto', 'nombre codigoInventario imagen categoria tipo precio')
            .populate('aprobadoPor', 'nombre apellido')
            .sort({ createdAt: -1 })
        res.status(200).json(reservas)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export { registrarReserva, listarReservas, listarMisReservas, aprobarReserva, rechazarReserva };
