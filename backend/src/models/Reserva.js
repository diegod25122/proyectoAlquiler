import mongoose, { Schema, model } from 'mongoose';

const reservaSchema = new Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        default: 1,
        min: [1, 'La cantidad debe ser al menos 1']
    },
    materia: { type: String, trim: true, default: "" },
    docente: { type: String, trim: true, default: "" },
    proposito: { type: String, trim: true, default: "" },
    horasSolicitadas: { type: Number, default: 1 },
    fechaReserva: {
        type: Date,
        default: Date.now
    },
    fechaInicio: {
        type: Date,
        default: null
    },
    fechaFin: {
        type: Date,
        default: null
    },
    fechaEntrega: {
        type: Date,
        default: null
    },
    estado: {
        type: String,
        enum: [
            "Pendiente",
            "Aprobada",
            "Alquilada",
            "Devuelta",
            "Cancelada",
            "Rechazada"
        ],
        default: "Pendiente"
    },
    observaciones: {
        type: String,
        trim: true,
        default: ""
    },
    estadoDevolucion: {
        type: String,
        enum: ["Buena", "Dañada", "Incompleto","No devuelto"],
        default: null
    },
    aprobadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    }
}, {
    timestamps: true
});

export default model("Reserva", reservaSchema);