import { Router } from 'express'
import { registrarPrestamo, listarPrestamosPorHerramienta, eliminarPrestamo, pagarPrestamo } from '../controllers/prestamo_controller.js'
import { verificarTokenJWT, verificarRolAdmin } from '../middlewares/JWT.js'

const router = Router()

router.get('/prestamo/herramienta/:id', verificarTokenJWT, listarPrestamosPorHerramienta)
router.post('/prestamo/registro', verificarTokenJWT, registrarPrestamo)
router.delete('/prestamo/eliminar/:id', verificarTokenJWT, verificarRolAdmin, eliminarPrestamo)
router.post('/prestamo/pago', verificarTokenJWT, pagarPrestamo)

export default router
