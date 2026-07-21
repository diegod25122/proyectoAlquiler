import mongoose, { Schema, model } from "mongoose"

// Sub-schema por ítem: guarda snapshot del precio al momento de la compra.
// NUNCA recalcules el total leyendo el precio actual del producto —
// si el Admin sube el precio después, tu historial quedaría corrupto.
const ItemOrdenSchema = new Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
    },
    nombre: { type: String, required: true },        // snapshot del nombre
    cantidad: { type: Number, required: true, min: [1, "Mínimo 1 unidad"] },
    precioUnitario: { type: Number, required: true } // snapshot del precio
}, { _id: false })

const OrdenCompraSchema = new Schema({

    // ─── Relaciones ───────────────────────────────────────────────
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    // ─── Ítems y total ────────────────────────────────────────────
    items: {
        type: [ItemOrdenSchema],
        validate: {
            validator: (arr) => arr.length > 0,
            message: "La orden debe contener al menos un artículo"
        }
    },
    total: { type: Number, required: true, min: 0 },

    // ─── Ciclo de vida ────────────────────────────────────────────
    estado: {
        type: String,
        enum: ["Pendiente", "Pagado", "Entregado", "Expirada", "Cancelada"],
        default: "Pendiente"
    },

    // ─── Datos de Stripe ──────────────────────────────────────────
    stripePaymentIntentId: { type: String, default: null },
    stripeClientSecret: { type: String, default: null },

    // ─── Trazabilidad de entrega ──────────────────────────────────
    verificadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default: null
    },
    fechaVerificacion: { type: Date, default: null },

    // ─── Expiración automática (24h) ──────────────────────────────
    expiraEn: { type: Date, required: true }

}, { timestamps: true })

// Calcula la expiración automáticamente al crear la orden
OrdenCompraSchema.pre("validate", function (next) {
    if (this.isNew && !this.expiraEn) {
        this.expiraEn = new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
    next()
})

export default model("OrdenCompra", OrdenCompraSchema)
