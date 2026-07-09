import mongoose, { Schema, model } from 'mongoose'

const prestamoSchema = new Schema({
    herramienta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Herramienta',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 1
    },
    estadoPago: {
        type: String,
        enum: ['Pagado', 'Pendiente'],
        default: 'Pendiente'
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

export default model('Prestamo', prestamoSchema)
