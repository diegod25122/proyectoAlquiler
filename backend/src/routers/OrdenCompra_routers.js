import { Router } from "express"
import {
    crearOrden,
    confirmarPago,
    listarMisOrdenes,
    listarOrdenes,
    marcarEntregado,
    cancelarOrden
} from "../controllers/ordenCompra_controller.js"
import { verificarTokenJWT, verificarRolAdmin } from "../middlewares/JWT.js"

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Ordenes
 *     description: Gestión de órdenes de compra (usuario y administrador)
 */

// ─── Rutas del Usuario ────────────────────────────────────────

/**
 * @swagger
 * /ordenes:
 *   post:
 *     summary: Crear una nueva orden de compra
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productos]
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       200:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Datos inválidos o campo vacío
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.post("/ordenes", verificarTokenJWT, crearOrden)

/**
 * @swagger
 * /ordenes/confirmar-pago:
 *   post:
 *     summary: Confirmar el pago de una orden
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ordenId]
 *             properties:
 *               ordenId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *               comprobante:
 *                 type: string
 *                 example: "referencia_pago_123"
 *     responses:
 *       200:
 *         description: Pago confirmado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Orden no encontrada
 */
router.post("/ordenes/confirmar-pago", verificarTokenJWT, confirmarPago)

/**
 * @swagger
 * /ordenes/mis-ordenes:
 *   get:
 *     summary: Listar las órdenes del usuario autenticado
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get("/ordenes/mis-ordenes", verificarTokenJWT, listarMisOrdenes)

/**
 * @swagger
 * /ordenes/cancelar/{id}:
 *   put:
 *     summary: Cancelar una orden de compra
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a cancelar
 *     responses:
 *       200:
 *         description: Orden cancelada correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: Orden no encontrada
 */
router.put("/ordenes/cancelar/:id", verificarTokenJWT, cancelarOrden)

// ─── Rutas del Admin ──────────────────────────────────────────

/**
 * @swagger
 * /ordenes:
 *   get:
 *     summary: Listar todas las órdenes de compra (solo administrador)
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las órdenes
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.get("/ordenes", verificarTokenJWT, verificarRolAdmin, listarOrdenes)

/**
 * @swagger
 * /ordenes/entregar/{id}:
 *   put:
 *     summary: Marcar una orden como entregada (solo administrador)
 *     tags: [Ordenes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden a marcar como entregada
 *     responses:
 *       200:
 *         description: Orden marcada como entregada
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Orden no encontrada
 */
router.put("/ordenes/entregar/:id", verificarTokenJWT, verificarRolAdmin, marcarEntregado)

export default router