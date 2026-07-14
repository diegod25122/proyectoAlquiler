import { Router } from 'express'
import multer from 'multer'
import { 
    registrarProducto, 
    listarProductos,
    listarProductosAdmin, 
    actualizarProducto, 
    eliminarProducto,
    detalleProducto
} from '../controllers/producto_controller.js'

import { verificarTokenJWT, verificarRolAdmin } from '../middlewares/JWT.js'

// 2. Configuración básica de Multer para almacenar temporalmente en el disco de Render
const upload = multer({ storage: multer.memoryStorage() })

const router = Router()

// RUTAS PÚBLICAS
router.get("/productos", listarProductos) 

// RUTAS PRIVADAS / ADMINISTRATIVAS
router.get("/producto/:id", verificarTokenJWT, detalleProducto)
router.get("/productos/admin", verificarTokenJWT, verificarRolAdmin, listarProductosAdmin)


router.post("/producto/registro", verificarTokenJWT,upload.single('imagen'), verificarRolAdmin, registrarProducto)

router.put("/producto/actualizar/:id", verificarTokenJWT, verificarRolAdmin,  actualizarProducto)
router.delete("/producto/eliminar/:id", verificarTokenJWT, verificarRolAdmin, eliminarProducto)

export default router