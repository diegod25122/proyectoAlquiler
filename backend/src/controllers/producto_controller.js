import Producto from "../models/Producto.js"
import mongoose from "mongoose"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Subir Buffer a Cloudinary (Sin tocar disco)
const subirBufferACloudinary = (buffer, carpeta = "poli-rent/productos") => {
  if (!buffer) return Promise.reject(new Error("No hay contenido para subir"))

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: carpeta, resource_type: "image" },
      (error, resultado) => (error ? reject(error) : resolve(resultado))
    )
    stream.end(buffer)
  })
}

const manejarErrorProducto = (error, res) => {
  if (error.code === 11000) {
    return res.status(400).json({ msg: "El código de inventario ya está registrado" })
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const detalles = Object.values(error.errors).map(e => e.message)
    return res.status(400).json({ msg: "Error de validación", detalles })
  }
  console.error("Error inesperado en producto.controller:", error)
  return res.status(500).json({ msg: "❌ Error en el servidor" })
}

/* ============================================================
   1. REGISTRAR PRODUCTO
   ============================================================ */
const registrarProducto = async (req, res) => {
  console.log("BODY:", req.body)
  console.log("FILE:", req.file || req.files)
  const { nombre, codigoInventario, descripcion, categoria, tipo, precio, stock } = req.body

  const camposRequeridos = { nombre, codigoInventario, descripcion, categoria, tipo, stock }
  const camposFaltantes = Object.entries(camposRequeridos)
    .filter(([_, valor]) => valor === undefined || valor === null || valor === "")
    .map(([clave]) => clave)

  if (camposFaltantes.length > 0) {
    return res.status(400).json({ msg: `Faltan campos obligatorios: ${camposFaltantes.join(", ")}` })
  }

  if (tipo === "Consumible" && (!precio || Number(precio) <= 0)) {
    return res.status(400).json({ msg: "Los productos consumibles requieren un precio mayor a 0" })
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

    const archivoImagen = req.files?.imagen || req.file

    if (archivoImagen?.buffer) {
      const { secure_url, public_id } = await subirBufferACloudinary(archivoImagen.buffer)
      nuevoProducto.imagen = secure_url
      nuevoProducto.imagenID = public_id
    }

    await nuevoProducto.save()
    return res.status(201).json({ msg: "✅ Producto registrado exitosamente", producto: nuevoProducto })

  } catch (error) {
    return manejarErrorProducto(error, res)
  }
}

/* ============================================================
   2. GENERACIÓN 3D (ASÍNCRONA SIN BLOQUEAR EL SERVIDOR)
   ============================================================ */
// Paso 1: Iniciar la tarea en Meshy
const iniciarGeneracion3D = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ msg: 'El nombre de la herramienta es requerido' })
    if (!process.env.MESHY_API_KEY) return res.status(503).json({ msg: 'API de Meshy no configurada.' })

    const prompt = `${nombre}${descripcion ? ', ' + descripcion : ''}, herramienta industrial, objeto realista, fondo blanco`

    const crearRes = await fetch('https://api.meshy.ai/v2/text-to-3d', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'preview',
        prompt,
        art_style: 'realistic',
        negative_prompt: 'cartoon, low quality, anime, blurry',
      }),
    })

    if (!crearRes.ok) {
      const err = await crearRes.json()
      return res.status(400).json({ msg: err.message || 'Error al iniciar tarea en Meshy' })
    }

    const { result: taskId } = await crearRes.json()
    // Devolvemos el taskId INMEDIATAMENTE para liberar el servidor Node.js
    return res.status(200).json({ taskId })

  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'Error al solicitar el modelo 3D' })
  }
}

// Paso 2: Endpoint para que el Frontend pregunte por el estado (Polling)
const verificarEstado3D = async (req, res) => {
  try {
    const { taskId } = req.params
    const estadoRes = await fetch(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, {
      headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY}` },
    })
    
    const estado = await estadoRes.json()
    return res.status(200).json(estado)
  } catch (error) {
    return res.status(500).json({ msg: "Error al consultar estado en Meshy" })
  }
}

/* ============================================================
   OTRAS RUTAS (listarProductos, actualizarProducto, etc.)
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

const detalleProducto = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "No existe el producto" })

    const producto = await Producto.findById(id)
      .select("-createdAt -updatedAt -__v")
      .populate("registradoPor", "_id nombre apellido")

    if (!producto) return res.status(404).json({ msg: "No existe el producto" })
    return res.status(200).json(producto)
  } catch (error) {
    return manejarErrorProducto(error, res)
  }
}

const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "No existe el producto" })

    delete req.body.codigoInventario
    delete req.body.registradoPor

    const productoExistente = await Producto.findById(id)
    if (!productoExistente) return res.status(404).json({ msg: "No existe el producto" })

    const archivoImagen = req.files?.imagen || req.file

    if (archivoImagen?.buffer) {
      const { secure_url, public_id } = await subirBufferACloudinary(archivoImagen.buffer)
      if (productoExistente.imagenID) await cloudinary.uploader.destroy(productoExistente.imagenID)
      req.body.imagen = secure_url
      req.body.imagenID = public_id
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    return res.status(200).json({ msg: "✅ Producto actualizado exitosamente", producto: productoActualizado })

  } catch (error) {
    return manejarErrorProducto(error, res)
  }
}

const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "No existe el producto" })

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
    if (!producto) return res.status(404).json({ msg: "No existe el producto" })

    return res.status(200).json({ msg: "✅ Producto dado de baja exitosamente" })
  } catch (error) {
    return manejarErrorProducto(error, res)
  }
}

// ÚNICO EXPORT AL FINAL
export {
  registrarProducto,
  listarProductos,
  listarProductosAdmin,
  detalleProducto,
  actualizarProducto,
  eliminarProducto,
  iniciarGeneracion3D,
  verificarEstado3D
}