import mongoose, { Schema, model } from 'mongoose'

const herramientaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    codigoInventario: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: String, // Aquí guardaremos la URL de Cloudinary
        trim: true,
        default: null
    },
    imagenID: {
        type: String, // ID de Cloudinary para poder borrarla después
        trim: true,
        default: null
    },
    estado: {
        type: Boolean,
        default: true // true = Disponible, false = Fuera de servicio / Eliminada
    },
    enPrestamo: {
        type: Boolean,
        default: false // Para saber si alguien la tiene actualmente
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario' // Relación con el Administrador que la registró
    }
}, {
    timestamps: true
})

export default model('Herramienta', herramientaSchema)