import Producto from "../models/Producto.js"
import mongoose from "mongoose"
import fs from "fs-extra"


/* ============================================================
   HELPER 2: Subir un Buffer a Cloudinary (sin pasar por disco)
   ============================================================ */
const subirBufferACloudinary = (buffer, carpeta = "poli-rent/productos") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: carpeta, resource_type: "image" },
            (error, resultado) => (error ? reject(error) : resolve(resultado))
        )
        stream.end(buffer)
    })
}

/* ============================================================
   HELPER 3: Subir un archivo físico (tempFilePath) a Cloudinary
   ============================================================ */
const subirArchivoACloudinary = async (tempFilePath, carpeta = "poli-rent/productos") => {
    const resultado = await cloudinary.uploader.upload(tempFilePath, { folder: carpeta })
    await fs.unlink(tempFilePath)
    return resultado
}

/* ============================================================
   HELPER 4: Manejo centralizado de errores (evita repetir
   el mismo bloque catch en los 5 controladores)
   ============================================================ */
const manejarErrorProducto = (error, res) => {
    if (error.code === 11000) {
        return res.status(400).json({ msg: "El código de inventario ya está registrado" })
    }
    if (error instanceof mongoose.Error.ValidationError) {
        const detalles = Object.values(error.errors).map(e => e.message)
        return res.status(400).json({ msg: "Error de validación", detalles })
    }
    if (error?.tipo === "HF_MODEL_LOADING") return res.status(503).json({ msg: error.msg })
    if (error?.tipo === "HF_API_ERROR") return res.status(502).json({ msg: error.msg })

    console.error("Error inesperado en producto.controller:", error)
    return res.status(500).json({ msg: "❌ Error en el servidor" })
}

/* ============================================================
   1. REGISTRAR PRODUCTO (Admin)
   ============================================================ */
const registrarProducto = async (req, res) => {
    const { nombre, codigoInventario, descripcion, categoria, tipo, precio, stock, promptImagenIA } = req.body

    // 1. Validar campos requeridos de texto
    const camposRequeridos = { nombre, codigoInventario, descripcion, categoria, tipo, stock }
    const camposFaltantes = Object.entries(camposRequeridos)
        .filter(([_, valor]) => valor === undefined || valor === null || valor === "")
        .map(([clave]) => clave)

    if (camposFaltantes.length > 0) {
        return res.status(400).json({ msg: `Faltan campos obligatorios: ${camposFaltantes.join(", ")}` })
    }

    if (tipo === "Consumible" && (precio === undefined || precio === "" || Number(precio) <= 0)) {
        return res.status(400).json({ msg: "Los productos consumibles requieren un precio mayor a 0" })
    }

    // Identificar si viene un archivo físico (compatible con Multer: req.file)
    const archivoImagen = req.file; 

    if (archivoImagen && promptImagenIA) {
        return res.status(400).json({ msg: "Elige una sola fuente de imagen: archivo o IA, no ambas" })
    }

    try {
        const nuevoProducto = new Producto({
            nombre: nombre.trim(),
            codigoInventario: codigoInventario.trim().toUpperCase(),
            descripcion: descripcion.trim(),
            categoria,
            tipo,
            precio: tipo === "Consumible" ? Number(precio) : 0,
            stock: Number(stock),
            registradoPor: req.usuarioHeader._id
        })

        // 2. Procesar flujo de imagen según la fuente elegida
        if (promptImagenIA && promptImagenIA.trim() !== "") {
            const buffer = await generarImagenIA(promptImagenIA)
            const { secure_url, public_id } = await subirBufferACloudinary(buffer)
            nuevoProducto.imagen = secure_url
            nuevoProducto.imagenID = public_id
            nuevoProducto.isGeneratedByIA = true
            
        } else if (archivoImagen) {
            // Si usas Multer con almacenamiento en disco local (ej: carpeta uploads/)
            // pasas archivoImagen.path. Si usas memoria buffer, archivoImagen.buffer
            const { secure_url, public_id } = await subirArchivoACloudinary(archivoImagen.path)
            nuevoProducto.imagen = secure_url
            nuevoProducto.imagenID = public_id
        } else {
            // Imagen por defecto institucional por si no suben nada
            nuevoProducto.imagen = "https://cdn-icons-png.flaticon.com/512/2618/2618671.png"
        }

        await nuevoProducto.save()
        return res.status(201).json({ msg: "✅ Producto registrado exitosamente", producto: nuevoProducto })

    } catch (error) {
        console.error("❌ Error real en el controlador:", error); // Esto te ahorrará revisar Render a cada rato
        return manejarErrorProducto(error, res)
    }
}
/* ============================================================
   2. LISTAR PRODUCTOS (Público / Catálogo)
   ============================================================ */
const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.find({ estado: true })
            .select("-createdAt -updatedAt -__v")
            .populate("registradoPor", "_id nombre apellido")

        return res.status(200).json(productos)
    } catch (error) {
        return manejarErrorProducto(error, res)
    }
}

/* ============================================================
   2.5. LISTAR PRODUCTOS PARA EL ADMIN (Dashboard completo)
   ============================================================ */
const listarProductosAdmin = async (req, res) => {
    try {
        const productos = await Producto.find()
            .select("-createdAt -updatedAt -__v")
            .populate("registradoPor", "_id nombre apellido")

        return res.status(200).json(productos)
    } catch (error) {
        return manejarErrorProducto(error, res)
    }
}

/* ============================================================
   3. DETALLE DE PRODUCTO (Público)
   ============================================================ */
const detalleProducto = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "No existe el producto" })
        }

        const producto = await Producto.findById(id)
            .select("-createdAt -updatedAt -__v")
            .populate("registradoPor", "_id nombre apellido")

        if (!producto) return res.status(404).json({ msg: "No existe el producto" })

        return res.status(200).json(producto)
    } catch (error) {
        return manejarErrorProducto(error, res)
    }
}

/* ============================================================
   4. ACTUALIZAR PRODUCTO (Admin)
   ============================================================ */
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "No existe el producto" })
        }

        // 🔒 El código de inventario y quién lo registró NO deben ser editables
        // desde este endpoint. Si llegan en el body, los descartamos explícitamente
        // para que nadie reescriba el historial de auditoría por accidente o a propósito.
        delete req.body.codigoInventario
        delete req.body.registradoPor

        const productoExistente = await Producto.findById(id)
        if (!productoExistente) return res.status(404).json({ msg: "No existe el producto" })

        if (req.files?.imagen && req.body.promptImagenIA) {
            return res.status(400).json({ msg: "Elige una sola fuente de imagen: archivo o IA, no ambas" })
        }

        // Reemplazo de imagen: primero subimos la nueva, luego borramos la vieja de Cloudinary.
        // (Si lo hiciéramos al revés y la subida nueva fallara, te quedarías sin imagen)
        if (req.body.promptImagenIA) {
            const buffer = await generarImagenIA(req.body.promptImagenIA)
            const { secure_url, public_id } = await subirBufferACloudinary(buffer)
            if (productoExistente.imagenID) await cloudinary.uploader.destroy(productoExistente.imagenID)
            req.body.imagen = secure_url
            req.body.imagenID = public_id
            req.body.isGeneratedByIA = true
        } else if (req.files?.imagen) {
            const { secure_url, public_id } = await subirArchivoACloudinary(req.files.imagen.tempFilePath)
            if (productoExistente.imagenID) await cloudinary.uploader.destroy(productoExistente.imagenID)
            req.body.imagen = secure_url
            req.body.imagenID = public_id
            req.body.isGeneratedByIA = false
        }

        const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true // sin esto, las validaciones del schema (enum, min, required) se ignoran en updates
        })

        return res.status(200).json({ msg: "✅ Producto actualizado exitosamente", producto: productoActualizado })

    } catch (error) {
        return manejarErrorProducto(error, res)
    }
}

/* ============================================================
   5. ELIMINAR PRODUCTO (Admin) — Baja lógica, nunca física
   ============================================================ */
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ msg: "No existe el producto" })
        }

        const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
        if (!producto) return res.status(404).json({ msg: "No existe el producto" })

        return res.status(200).json({ msg: "✅ Producto dado de baja exitosamente" })
    } catch (error) {
        return manejarErrorProducto(error, res)
    }
}

export {
    registrarProducto,
    listarProductos,
    listarProductosAdmin,
    detalleProducto,
    actualizarProducto,
    eliminarProducto
}