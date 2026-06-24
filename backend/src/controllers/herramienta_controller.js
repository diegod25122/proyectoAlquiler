import Herramienta from "../models/Herramienta.js"
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"
import mongoose from "mongoose"

// 1. REGISTRAR (Creación de endpoint para registrar)
const registrarHerramienta = async (req, res) => {
    try {
        const { codigoInventario } = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" })

        const codigoExistente = await Herramienta.findOne({ codigoInventario })
        if (codigoExistente) return res.status(400).json({ msg: "El código de inventario ya está registrado" })

        // Creamos la herramienta y le asignamos el ID del administrador que la está creando
        const nuevaHerramienta = new Herramienta({
            ...req.body,
            registradoPor: req.usuarioHeader._id 
        })

        // Si se envió una imagen, la subimos a Cloudinary
        if (req.files?.imagen) {
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            nuevaHerramienta.imagen = secure_url
            nuevaHerramienta.imagenID = public_id
        }

        await nuevaHerramienta.save()
        res.status(201).json({ msg: "✅ Herramienta registrada exitosamente en el inventario" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// 2. LISTAR (Creación de endpoint para listar)
const listarHerramientas = async (req, res) => {
    try {
        // Solo listamos las que tienen estado: true (que no han sido dadas de baja)
        const herramientas = await Herramienta.find({ estado: true })
            .select("-createdAt -updatedAt -__v")
            .populate('registradoPor', '_id nombre apellido') // Traemos datos del admin que la registró
            
        res.status(200).json(herramientas)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// 3. DETALLE (Creación de endpoint para visualizar el detalle)
const detalleHerramienta = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `No existe la herramienta` })
        
        const herramienta = await Herramienta.findById(id)
            .select("-createdAt -updatedAt -__v")
            .populate('registradoPor', '_id nombre apellido')
            
        res.status(200).json(herramienta)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// 4. ACTUALIZAR (Creación de endpoint para actualizar)
const actualizarHerramienta = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `No existe la herramienta` })

        // Si viene una imagen nueva en la petición
        if (req.files?.imagen) {
            const herramienta = await Herramienta.findById(id)
            // Borramos la imagen vieja de Cloudinary
            if (herramienta.imagenID) {
                await cloudinary.uploader.destroy(herramienta.imagenID)
            }
            // Subimos la nueva
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            req.body.imagen = secure_url
            req.body.imagenID = public_id
        }

        await Herramienta.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json({ msg: "Actualización exitosa de la herramienta" })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// 5. ELIMINAR (Creación de endpoint para eliminar - Eliminación lógica)
const eliminarHerramienta = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `No existe la herramienta` })
        
        // No la borramos de la BDD, solo cambiamos su estado a false
        await Herramienta.findByIdAndUpdate(id, { estado: false })
        res.status(200).json({ msg: "Herramienta dada de baja exitosamente" })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export  {
    registrarHerramienta, 
    listarHerramientas, 
    detalleHerramienta, 
    actualizarHerramienta, 
    eliminarHerramienta 
}