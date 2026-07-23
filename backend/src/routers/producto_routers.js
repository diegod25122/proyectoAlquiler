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

/**
 * @swagger
 * tags:
 *   - name: Productos
 *     description: Gestión de productos (públicos y administrativos)
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Listar todos los productos (público)
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos disponibles
 */
router.get("/productos", listarProductos) 

/**
 * @swagger
 * /producto/{id}:
 *   get:
 *     summary: Ver el detalle de un producto (público)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 */
// ✅ CORREGIDO: Se elimina 'verificarTokenJWT' para permitir acceso público al detalle
router.get("/producto/:id", detalleProducto)

/**
 * @swagger
 * /productos/admin:
 *   get:
 *     summary: Listar todos los productos, incluidos inactivos (solo administrador)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de productos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.get("/productos/admin", verificarTokenJWT, verificarRolAdmin, listarProductosAdmin)

/**
 * @swagger
 * /producto/registro:
 *   post:
 *     summary: Registrar un nuevo producto (solo administrador)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Producto registrado con éxito
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.post("/producto/registro", verificarTokenJWT, verificarRolAdmin, registrarProducto)

/**
 * @swagger
 * /producto/actualizar/{id}:
 *   put:
 *     summary: Actualizar un producto existente (solo administrador)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Camiseta institucional"
 *               descripcion:
 *                 type: string
 *                 example: "Camiseta con logo de la ESFOT"
 *               precio:
 *                 type: number
 *                 example: 16.0
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.put("/producto/actualizar/:id", verificarTokenJWT, verificarRolAdmin, actualizarProducto)

/**
 * @swagger
 * /producto/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un producto (solo administrador)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.delete("/producto/eliminar/:id", verificarTokenJWT, verificarRolAdmin, eliminarProducto)

export default router