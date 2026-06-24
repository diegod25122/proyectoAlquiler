import { Router } from 'express'
import { registrarHerramienta, listarHerramientas, detalleHerramienta, actualizarHerramienta, eliminarHerramienta } from '../controllers/herramienta_controller.js'
import { verificarTokenJWT, verificarRolAdmin } from '../middlewares/JWT.js'

const router = Router()

// Rutas Públicas (Cualquier estudiante logueado puede ver el catálogo)
router.get("/herramientas", verificarTokenJWT, listarHerramientas)
router.get("/herramienta/:id", verificarTokenJWT, detalleHerramienta)

// Rutas Administrativas (Requieren estar logueados Y ser administradores)
router.post("/herramienta/registro", verificarTokenJWT, verificarRolAdmin, registrarHerramienta)
router.put("/herramienta/actualizar/:id", verificarTokenJWT, verificarRolAdmin, actualizarHerramienta)
router.delete("/herramienta/eliminar/:id", verificarTokenJWT, verificarRolAdmin, eliminarHerramienta)

export default router