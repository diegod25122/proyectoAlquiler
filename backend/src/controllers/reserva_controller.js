import Reserva from '../models/Reserva.js';
import mongoose from 'mongoose';

// 1. Registrar una nueva reserva
const registrarReserva = async (req, res) => {
    try {
        const { usuario, producto, fechaInicio, fechaFin } = req.body;

        // Validar la existencia de campos obligatorios
        if (!usuario || !producto || !fechaInicio || !fechaFin) {
            return res.status(400).json({ msg: "Debes llenar todos los campos obligatorios (usuario, producto, fechaInicio, fechaFin)" });
        }

        // Validar sintaxis del ID del usuario
        if (!mongoose.Types.ObjectId.isValid(usuario))
            return res.status(400).json({ msg: `El ID del Usuario no es válido: ${usuario}` });

        // Validar sintaxis del ID del producto
        if (!mongoose.Types.ObjectId.isValid(producto))
            return res.status(400).json({ msg: `El ID del producto no es válido: ${producto}` });

        // Registrar la reserva
        const reserva = await Reserva.create(req.body);
        return res.status(201).json({ msg: "Reserva registrada correctamente", reserva });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` });
    }
};

// 2. Listar todas las reservas
const listarReservas = async (req, res) => {
    try {
        // Trae las reservas y cruza los datos de usuario y producto
        const reservas = await Reserva.find().populate('usuario').populate('producto');
        return res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` });
    }
};

// 3. Eliminar una reserva por ID
const eliminarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID de la reserva sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "El ID de la reserva no es válido" });
        }

        // Buscar y eliminar
        const reservaEliminada = await Reserva.findByIdAndDelete(id);

        if (!reservaEliminada) {
            return res.status(404).json({ msg: "No se encontró la reserva que deseas eliminar" });
        }

        return res.status(200).json({ msg: "Reserva eliminada correctamente", reservaEliminada });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` });
    }
};

export {
    registrarReserva,
    listarReservas,
    eliminarReserva
};