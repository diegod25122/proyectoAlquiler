import mongoose, { Schema, model } from 'mongoose';

const ProductoSchema = new Schema({
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
    categoria: {
        type: String,
        required: true,
        enum: ['Manuales', 'Tecnológicas', 'Ópticas', 'Consumibles'],
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Prestable', 'Consumible'] // Define si va al flujo de reserva o carrito
    },
    precio: {
        type: Number,
        required: function() { return this.tipo === 'Consumible'; }, //Permite manejar las ventas
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'El stock no puede ser menor a cero'],
        default: 1
    },
    imagen: {
        type: String, // URL pública que devuelve Cloudinary
        trim: true,
        default: null
    },
    imagenID: {
        type: String, // ID de Cloudinary pública para poder hacer el borrado físico
        trim: true,
        default: null
    },
    isGeneratedByIA: {
        type: Boolean,
        default: false 
    },
    estado: {
        type: Boolean,
        default: true // true = Activo/Disponible para mostrar, false = Fuera de servicio
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Relación con el ID del Administrador que lo creó, excelente para auditorias
        required: true 
    },
    reservas: [
    {
        type: Schema.Types.ObjectId,
        ref: "Reserva"
    }
]
}, {
    timestamps: true
});

export default model('Producto', ProductoSchema);