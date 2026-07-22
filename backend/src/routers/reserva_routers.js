import { Router } from "express"
import { registrarReserva, listarReservas, listarMisReservas, aprobarReserva, rechazarReserva } from "../controllers/reserva_controller.js"
import { verificarTokenJWT, verificarRolAdmin } from "../middlewares/JWT.js"

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reservas
 *     description: Registro, consulta y gestión de reservas
 */

/**
 * @swagger
 * /registrarReserva:
 *   post:
 *     summary: Registrar una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto, fecha, cantidad]
 *             properties:
 *               producto:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *               fecha:
 *                 type: string
 *                 example: "2026-08-01"
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Reserva registrada exitosamente
 *       400:
 *         description: Datos inválidos o campo vacío
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
 *         description: Lista de todas las reservas
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
 *     summary: Aprobar una reserva (solo administrador)
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

export default router;