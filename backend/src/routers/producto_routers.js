import { Router } from 'express'
import { 
    registrarProducto, 
    listarProductos,
    listarProductosAdmin, // <-- NUEVO: Para la tabla completa del Admin
    actualizarProducto, 
    eliminarProducto,
    detalleProducto
} from '../controllers/producto_controller.js'

import { verificarTokenJWT, verificarRolAdmin } from '../middlewares/JWT.js'

const router = Router()

// RUTAS PÚBLICAS (Catálogo Estudiantes)
// Cualquiera puede ver el catálogo sin loguearse
router.get("/productos", listarProductos) 

// RUTAS PRIVADAS / ADMINISTRATIVAS
// Requieren estar logueados Y tener rol de Administrador

// Obtener detalles específic
router.get("/producto/:id", verificarTokenJWT, detalleProducto)

// Listar el inventario completo con auditoría en el Dashboard del Admin
router.get("/productos/admin", verificarTokenJWT, verificarRolAdmin, listarProductosAdmin)

// Acciones de escritura, edición y borrado
router.post("/producto/registro", verificarTokenJWT, verificarRolAdmin, registrarProducto)
router.put("/producto/actualizar/:id", verificarTokenJWT, verificarRolAdmin, actualizarProducto)
router.delete("/producto/eliminar/:id", verificarTokenJWT, verificarRolAdmin, eliminarProducto)

export default router