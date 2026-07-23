import { Router } from "express"
import { 
    registrarReserva, 
    listarReservas, 
    listarMisReservas, 
    aprobarReserva, 
    rechazarReserva,
    marcarEnUso,
    marcarDevuelto 
} from "../controllers/reserva_controller.js"
import { verificarTokenJWT, verificarRolAdmin } from "../middlewares/JWT.js"

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reservas
 *     description: Registro, consulta y gestión de reservas de herramientas del taller
 */

/**
 * @swagger
 * /registrarReserva:
 *   post:
 *     summary: Registrar una nueva solicitud de reserva académica
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto, materia, docente, proposito, horasSolicitadas, cantidadSolicitada]
 *             properties:
 *               producto:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *               materia:
 *                 type: string
 *                 example: "Sistemas Embebidos"
 *               docente:
 *                 type: string
 *                 example: "Ing. Carlos Pérez"
 *               proposito:
 *                 type: string
 *                 example: "Práctica de laboratorio #2 de Microcontroladores"
 *               horasSolicitadas:
 *                 type: integer
 *                 example: 3
 *               cantidadSolicitada:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Reserva registrada exitosamente
 *       400:
 *         description: Datos inválidos, stock insuficiente o producto no prestable
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.post("/registrarReserva", verificarTokenJWT, registrarReserva)

/**
 * @swagger
 * /reserva/mis-reservas:
 *   get:
 *     summary: Listar las reservas del usuario autenticado
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get("/reserva/mis-reservas", verificarTokenJWT, listarMisReservas)

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar todas las reservas (solo administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista general de todas las reservas registradas
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.get("/reservas", verificarTokenJWT, verificarRolAdmin, listarReservas)

/**
 * @swagger
 * /reservas/aprobar/{id}:
 *   put:
 *     summary: Aprobar una reserva y descontar stock (solo administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a aprobar
 *     responses:
 *       200:
 *         description: Reserva aprobada correctamente
 *       400:
 *         description: Estado no válido o stock insuficiente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Reserva no encontrada
 */
router.put("/reservas/aprobar/:id", verificarTokenJWT, verificarRolAdmin, aprobarReserva)

/**
 * @swagger
 * /reservas/rechazar/{id}:
 *   put:
 *     summary: Rechazar una reserva (solo administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a rechazar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivoRechazo:
 *                 type: string
 *                 example: "Falta de disponibilidad del docente encargado"
 *     responses:
 *       200:
 *         description: Reserva rechazada correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Reserva no encontrada
 */
router.put("/reservas/rechazar/:id", verificarTokenJWT, verificarRolAdmin, rechazarReserva)

/**
 * @swagger
 * /reservas/en-uso/{id}:
 *   put:
 *     summary: Marcar reserva como "EnUso" cuando el estudiante retira el equipo (solo administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva aprobada a entregar
 *     responses:
 *       200:
 *         description: Equipo entregado exitosamente al usuario
 *       400:
 *         description: La reserva debe estar en estado 'Aprobada'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.put("/reservas/en-uso/:id", verificarTokenJWT, verificarRolAdmin, marcarEnUso)

/**
 * @swagger
 * /reservas/devolver/{id}:
 *   put:
 *     summary: Marcar equipo como "Devuelto" y reabastecer el stock en el taller (solo administrador)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva en uso a devolver
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observacionesAdmin:
 *                 type: string
 *                 example: "Devuelto a tiempo y en buen estado."
 *     responses:
 *       200:
 *         description: Herramienta devuelta e inventario actualizado
 *       400:
 *         description: La reserva debe estar en estado 'EnUso'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.put("/reservas/devolver/:id", verificarTokenJWT, verificarRolAdmin, marcarDevuelto)

export default router;