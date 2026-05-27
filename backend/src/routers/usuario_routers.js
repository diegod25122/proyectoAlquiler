import {Router} from 'express'
import { actualizarPassword, actualizarPerfil, comprobarTokenPasword,confirmarMail, crearNuevoPassword, login, perfil, recuperarPassword, registro } 
from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import { validacionRegistro } from '../middlewares/validaciones.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Registro, confirmación y login
 *   - name: Perfil
 *     description: Ver y actualizar datos del usuario
 *   - name: Password
 *     description: Recuperación de contraseña
 */

/**
 * @swagger
 * /registro:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, facultad, telefono, cedula, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               facultad:
 *                 type: string
 *                 example: ESFOT
 *               telefono:
 *                 type: string
 *                 example: "0912345678"
 *               cedula:
 *                 type: string
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 example: juan.perez@epn.edu.ec
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Usuario registrado, revisa tu correo
 *       400:
 *         description: Campo vacío o email ya registrado
 */
router.post('/registro', validacionRegistro, registro)

/**
 * @swagger
 * /usuario/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan.perez@epn.edu.ec
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 rol:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 _id:
 *                   type: string
 *       401:
 *         description: Password incorrecto
 *       403:
 *         description: Cuenta no verificada
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/usuario/login', login)

/**
 * @swagger
 * /usuario/perfil:
 *   get:
 *     summary: Ver perfil del usuario autenticado
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: Token no proporcionado o inválido
 */
router.get('/usuario/perfil', verificarTokenJWT, perfil)

/**
 * @swagger
 * /confirm/{token}:
 *   get:
 *     summary: Confirmar cuenta por email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token recibido en el correo de registro
 *     responses:
 *       200:
 *         description: Cuenta confirmada exitosamente
 *       404:
 *         description: Token inválido o cuenta ya confirmada
 */
router.get('/confirm/:token', confirmarMail)

/**
 * @swagger
 * /recuperarpassword:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan.perez@epn.edu.ec
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado
 *       400:
 *         description: Email no ingresado
 *       404:
 *         description: Usuario no registrado
 */
router.post('/recuperarpassword', recuperarPassword)

/**
 * @swagger
 * /recuperarpassword/{token}:
 *   get:
 *     summary: Comprobar token de recuperación
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token recibido en el correo de recuperación
 *     responses:
 *       200:
 *         description: Token válido
 *       404:
 *         description: Token inválido o expirado
 */
router.get('/recuperarpassword/:token', comprobarTokenPasword)

/**
 * @swagger
 * /nuevopassword/{token}:
 *   post:
 *     summary: Crear nuevo password con token de recuperación
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password, confirmpassword]
 *             properties:
 *               password:
 *                 type: string
 *                 example: nuevoPassword123
 *               confirmpassword:
 *                 type: string
 *                 example: nuevoPassword123
 *     responses:
 *       200:
 *         description: Password actualizado correctamente
 *       404:
 *         description: Passwords no coinciden o token inválido
 */
router.post('/nuevopassword/:token', crearNuevoPassword)

/**
 * @swagger
 * /actualizarperfil:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, facultad, telefono, cedula, email]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Carlos
 *               apellido:
 *                 type: string
 *                 example: Pérez
 *               facultad:
 *                 type: string
 *                 example: ESFOT
 *               telefono:
 *                 type: string
 *                 example: "0998765432"
 *               cedula:
 *                 type: string
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 example: juan.perez@epn.edu.ec
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       400:
 *         description: Campo vacío o email ya registrado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/actualizarperfil/', verificarTokenJWT, actualizarPerfil)

/**
 * @swagger
 * /actualizarpassword/{id}:
 *   put:
 *     summary: Actualizar contraseña del usuario
 *     tags: [Perfil]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario obtenido en el login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [passwordactual, passwordnuevo]
 *             properties:
 *               passwordactual:
 *                 type: string
 *                 example: "123456"
 *               passwordnuevo:
 *                 type: string
 *                 example: nuevoPassword999
 *     responses:
 *       200:
 *         description: Password actualizado correctamente
 *       404:
 *         description: Password actual incorrecto
 */
router.put('/actualizarpassword/:id', verificarTokenJWT, actualizarPassword)

export default router