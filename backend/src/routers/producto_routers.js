import { Router } from 'express'
import { 
    registrarProducto, 
    listarProductos,
    listarProductosAdmin, 
    actualizarProducto, 
    eliminarProducto,
    detalleProducto
} from '../controllers/producto_controller.js'

import { verificarTokenJWT, verificarRolAdmin } from '../middlewares/JWT.js'

const router = Router()

// RUTAS PÚBLICAS
router.get("/productos", listarProductos) 

// RUTAS PRIVADAS / ADMINISTRATIVAS
router.get("/producto/:id", verificarTokenJWT, detalleProducto)
router.get("/productos/admin", verificarTokenJWT, verificarRolAdmin, listarProductosAdmin)


router.post("/producto/registro", verificarTokenJWT, verificarRolAdmin, registrarProducto)

router.put("/producto/actualizar/:id", verificarTokenJWT, verificarRolAdmin,  actualizarProducto)
router.delete("/producto/eliminar/:id", verificarTokenJWT, verificarRolAdmin, eliminarProducto)

export default router