import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"

const subirImagenCloudinary = async (filePath, folder = "Herramientas") => {
    // Subimos la imagen a la carpeta "Herramientas" en Cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, { folder })
    
    // Eliminamos el archivo temporal que se guardó en nuestro servidor local
    await fs.unlink(filePath) 
    
    return { secure_url, public_id }
}

export { subirImagenCloudinary }