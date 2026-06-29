import { Router } from 'express'
import { registrarProducto, listarProductos,
        actualizarProducto, eliminarProducto,
        detalleProducto
  }
from '../controllers/producto_controller.js'

import { verificarTokenJWT, verificarRolAdmin } from '../middlewares/JWT.js'

const router = Router()

// Rutas Públicas (Cualquier estudiante logueado puede ver el catálogo)
router.get("/productos", verificarTokenJWT, listarProductos)
router.get("/producto/:id", verificarTokenJWT, detalleProducto)

// Rutas Administrativas (Requieren estar logueados Y ser administradores)
router.post("/producto/registro", verificarTokenJWT, verificarRolAdmin, registrarProducto)
router.put("/producto/actualizar/:id", verificarTokenJWT, verificarRolAdmin, actualizarProducto)
router.delete("/producto/eliminar/:id", verificarTokenJWT, verificarRolAdmin, eliminarProducto)

export default router