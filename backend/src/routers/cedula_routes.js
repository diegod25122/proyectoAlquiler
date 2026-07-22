import { Router } from 'express'
import { consultarCedula } from '../controllers/cedula_controller.js'

const routerCedula = Router()

/**
 * @swagger
 * tags:
 *   - name: Cedula
 *     description: Consulta de datos por número de cédula
 */

/**
 * @swagger
 * /cedula/{numero}:
 *   get:
 *     summary: Consultar datos asociados a un número de cédula
 *     tags: [Cedula]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de cédula a consultar
 *         example: "1234567890"
 *     responses:
 *       200:
 *         description: Datos encontrados para la cédula consultada
 *       400:
 *         description: Número de cédula inválido
 *       404:
 *         description: No se encontraron datos para la cédula indicada
 */
routerCedula.get('/cedula/:numero', consultarCedula)

export default routerCedula