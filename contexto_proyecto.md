# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
📄 ARCHIVO: backend\.env
================================================

PORT=3000
MONGODB_URI=mongodb+srv://admin_user:admin2512%40@cluster0.vlms6ew.mongodb.net/alquilerusers

HOST_MAILTRAP = smtp.gmail.com
PORT_MAILTRAP = 465
USER_MAILTRAP = jairomaigua81@gmail.com
PASS_MAILTRAP = blhhddogasxfrcvs

URL_BACKEND= http://localhost:3000/api
URL_FRONTEND=http://localhost:5173

================================================
📄 ARCHIVO: backend\.env.example
================================================

import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

export default  connection

================================================
📄 ARCHIVO: backend\.gitignore
================================================

node_modules/
.env

================================================
📄 ARCHIVO: backend\package.json
================================================

{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.10.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-fileupload": "^1.5.2",
    "express-validator": "^7.3.2",
    "fs-extra": "^11.3.5",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.6.2",
    "nodemailer": "^8.0.7",
    "socket.io": "^4.8.3",
    "stripe": "^22.1.1"
  }
}


================================================
📄 ARCHIVO: backend\src\config\nodemailer.js
================================================

import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()



const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
    },
})
/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */

const sendMail = async (to, subject, html) => {

    try {
        const info = await transporter.sendMail({
            from: '"POLI - RENT" <admin@polirent.com>',
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)

    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
    }
}

export default sendMail

================================================
📄 ARCHIVO: backend\src\controllers\usuario_controller.js
================================================

import Usuario from "../models/Usuario.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js";
import { crearTokenJWT } from "../middlewares/JWT.js"

import mongoose from "mongoose"


const registro = async (req,res)=>{

    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Usuario.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        const nuevoUsuario = new Usuario(req.body)
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
        const token = nuevoUsuario.createToken()
        await sendMailToRegister(email,token)
        await nuevoUsuario.save()
        res.status(200).json({msg:"Usuario registrado correctamente, por favor revisa tu correo para activar tu cuenta"})

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}
const confirmarMail = async (req, res) => {
    try {
        // Paso 1 
        const { token } = req.params
        // Paso 2
        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        // Paso 3
        usuarioBDD.token = null
        usuarioBDD.confirmEmail = true
        await usuarioBDD.save()
        // Paso 4
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}
const recuperarPassword = async (req, res) => {

    try {
        // Paso 1
        const { email } = req.body
        // Paso 2
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const usuarioBDD = await Usuario.findOne({ email })
        if (!usuarioBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        // Paso 3
        const token = usuarioBDD.createToken()
        usuarioBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await usuarioBDD.save()
        // Paso 4
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



const comprobarTokenPasword = async (req,res)=>{
    try {
        const {token} = req.params
        const usuarioBDD = await Usuario.findOne({token})
        
        
        if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta o el token expiró"})
        
        res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



const crearNuevoPassword = async (req,res)=>{

    try {
        // Paso 1
        const{password,confirmpassword} = req.body
        const { token } = req.params
        // Paso 2
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const usuarioBDD = await Usuario.findOne({token})
        if(!usuarioBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
        // Paso 3
        usuarioBDD.token = null
        usuarioBDD.password = await usuarioBDD.encryptPassword(password)
        await usuarioBDD.save()
        // Paso 4
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}


const login = async(req,res)=>{
    try {
        // Paso 1: Captura de datos
        const {email,password} = req.body
        
        // Paso 2: Validaciones críticas
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({msg:"Debes llenar todos los campos"}) // Cambiado a 400 (Bad Request)
        }
        
        
        const usuarioBDD = await Usuario.findOne({email})
        
        if(!usuarioBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        
        // Validar si el correo institucional ya fue confirmado
        if(!usuarioBDD.confirmEmail) {
            return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        }
        
        // Verificar que la contraseña encriptada coincida
        const verificarPassword = await usuarioBDD.matchPassword(password)
        if(!verificarPassword) return res.status(401).json({msg:"El password no es correcto"})
        
        // Paso 3: Desestructuración segura una vez autenticado
        const {nombre, apellido, facultad, telefono, cedula, rol, _id} = usuarioBDD
        const token = crearTokenJWT(usuarioBDD._id, usuarioBDD.rol)
        
        // Paso 4: Enviamos la respuesta limpia al Frontend incluyendo el Token
        res.status(200).json({
            token,
            rol,
            nombre,
            apellido,
            facultad,
            telefono,
            cedula,
            _id,
            email: usuarioBDD.email
        })

    } catch (error) {
        
        console.error("Error exacto en la función login:", error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error.message || error}` })
    }
}

const perfil =(req,res)=>{
	const {token,confirmEmail,createdAt,updatedAt,__v,...datosPerfil} = req.usuarioHeader
    res.status(200).json(datosPerfil)
}



const actualizarPerfil = async (req,res)=>{
    try {
    
        const id = req.usuarioHeader._id; 
        const {nombre,apellido,facultad,telefono,cedula, email} = req.body;
        
        const usuarioBDD = await Usuario.findById(id)
        if(!usuarioBDD) return res.status(404).json({ msg: "No existe el usuario" })
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        
        if (usuarioBDD.email !== email) {
            const emailExistente  = await Usuario.findOne({email})
            if (emailExistente ) {
                return res.status(400).json({msg:"El email ya se encuentra registrado"})  // Cambié a 400 (Bad Request)
            }
        }
        
        usuarioBDD.nombre = nombre ?? usuarioBDD.nombre
        usuarioBDD.apellido = apellido ?? usuarioBDD.apellido
        usuarioBDD.facultad = facultad ?? usuarioBDD.facultad
        usuarioBDD.telefono = telefono ?? usuarioBDD.telefono
        usuarioBDD.cedula = cedula ?? usuarioBDD.cedula
        usuarioBDD.email = email ?? usuarioBDD.email
        await usuarioBDD.save()
        
        res.status(200).json(usuarioBDD)
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPassword = async (req,res)=>{
    try {
        const usuarioBDD = await Usuario.findById(req.usuarioHeader._id)
        if(!usuarioBDD) return res.status(404).json({msg: `Lo sentimos, no existe el usuario ${req.usuarioHeader._id}`})
        const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual)
        if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
        usuarioBDD.password = await usuarioBDD.encryptPassword(req.body.passwordnuevo)
        await usuarioBDD.save()

    res.status(200).json({msg:"Password actualizado correctamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}



export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword
}

================================================
📄 ARCHIVO: backend\src\database.js
================================================

import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

export default  connection

================================================
📄 ARCHIVO: backend\src\helpers\sendMail.js
================================================

import sendMail from "../config/nodemailer.js"


const sendMailToRegister = (userMail, token) => {

    return sendMail(
        userMail,
        "Bienvenido a POLI - RENT 🛠️👨‍🎓",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.URL_FRONTEND}/confirmar/${token}">
            Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de POLI - RENT te da la más cordial bienvenida.</footer>
        `
    )
}

const sendMailToRecoveryPassword = (userMail, token) => {

    return sendMail(
        userMail,
        "Recupera tu contraseña",
        `
            <h1>POLI - RENT 🛠️👨‍🎓</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <a href="${process.env.URL_FRONTEND}/recuperarpassword/${token}">
            Clic para restablecer tu contraseña
            </a>
            <hr>
            <footer>El equipo de POLI - RENT te da la más cordial bienvenida.</footer>
        `
        )
}



export {
    sendMailToRegister,
    sendMailToRecoveryPassword
}


================================================
📄 ARCHIVO: backend\src\index.js
================================================

import app from './server.js'

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})

import connection from './database.js';

connection()


================================================
📄 ARCHIVO: backend\src\middlewares\JWT.js
================================================

import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"


/**
 * Crear token JWT
 * @param {string} id - ID del usuario
 * @param {string} rol - Rol del usuario
 * @returns {string} token - JWT
 */
const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}




const verificarTokenJWT = async (req, res, next) => {

	const { authorization } = req.headers
    if (!authorization) return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    try {
        const token = authorization.split(" ")[1]
        const { id, rol } = jwt.verify(token,process.env.JWT_SECRET)
        if (rol === "Usuario") {
            const usuarioBDD = await Usuario.findById(id).lean().select("-password")
            if (!usuarioBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.usuarioHeader = usuarioBDD
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error}` })
    }
}


export { 
    crearTokenJWT,
    verificarTokenJWT 
}



================================================
📄 ARCHIVO: backend\src\middlewares\validaciones.js
================================================

import { check, validationResult } from 'express-validator';

const validacionRegistro = [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('facultad', 'La facultad es obligatoria').notEmpty(),
    check('telefono', 'El teléfono es obligatorio').notEmpty(),
    check('cedula', 'La cédula debe tener exactamente 10 dígitos numéricos').isLength({ min: 10, max: 10 }).isNumeric(),
    check('email', 'Debe ser un email válido').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }
        next();
    }
];

export { validacionRegistro };

================================================
📄 ARCHIVO: backend\src\models\Usuario.js
================================================

import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs'

const UsuarioSchema= new Schema({
    nombre:{
        type:String,
        required:true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },
    facultad:{
        type: String,
        required: true,
        trim: true
    },
    telefono:{
        type: String,
        required: true,
        trim: true
    },
    cedula:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
        token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    rol:{
        type:String,
        default:"Usuario"
    }

},{
    timestamps:true
})
//Método para cifrar el password
UsuarioSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


// Método para verificar si el password es el mismo de la BDD
UsuarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para crear un token 
UsuarioSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}


export default model('Usuario', UsuarioSchema)

================================================
📄 ARCHIVO: backend\src\routers\usuario_routers.js
================================================

import {Router} from 'express'

import { actualizarPassword, actualizarPerfil, comprobarTokenPasword,confirmarMail, crearNuevoPassword, login, perfil, recuperarPassword, registro } 
from '../controllers/usuario_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
import { validacionRegistro } from '../middlewares/validaciones.js'
const router = Router()


router.post('/registro', validacionRegistro, registro)
router.post('/usuario/login',login)
router.get('/usuario/perfil', verificarTokenJWT, perfil)
router.get('/confirmar/:token', confirmarMail)

router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/nuevopassword/:token',crearNuevoPassword)
router.put('/actualizarperfil/',verificarTokenJWT,actualizarPerfil)
router.put('/actualizarpassword/:id',verificarTokenJWT,actualizarPassword)

export default router

================================================
📄 ARCHIVO: backend\src\server.js
================================================

// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerUsuario from './routers/usuario_routers.js';


// Inicializaciones
const app = express()
dotenv.config()


// Configuraciones 



// Middlewares 
app.use(express.json())
app.use(cors())



// Variables globales
app.set('port',process.env.PORT || 3000)



// Rutas 

// Ruta principal
app.get('/',(req,res)=>res.send("Server on"))

// Rutas para usuarios
app.use('/api',routerUsuario)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default  app

================================================
📄 ARCHIVO: export_context (1).js
================================================

const fs = require('fs');
const path = require('path');

// Nombre del archivo final que contendrá todo tu código
const OUTPUT_FILE = 'contexto_proyecto.md';
const ROOT_DIR = __dirname;

// Carpetas que ignoramos porque son pesadas o no contienen código fuente útil
const IGNORE_DIRS = ['node_modules', '.expo', '.vscode', '.opencode', '.git', 'assets', '__tests__', '.tamagui'];

// Archivos específicos que no queremos incluir
const IGNORE_FILES = ['package-lock.json', 'yarn.lock', OUTPUT_FILE, 'export_context.js'];

// Extensiones permitidas
const ALLOWED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md'];

function buildContext(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(item)) {
                buildContext(itemPath);
            }
        } else {
            const ext = path.extname(item);
            const isAllowedExtension = ALLOWED_EXTENSIONS.includes(ext);
            
            // Permitimos archivos de configuración que empiezan con punto (ej. .gitignore, eslint.config.js)
            const isConfigFile = item.startsWith('.') || item.includes('config'); 

            if (!IGNORE_FILES.includes(item) && (isAllowedExtension || isConfigFile)) {
                try {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    const relativePath = path.relative(ROOT_DIR, itemPath);
                    
                    // Separador visual claro para que la IA distinga entre archivos
                    const separator = `\n\n================================================\n`;
                    const fileHeader = `📄 ARCHIVO: ${relativePath}\n================================================\n\n`;
                    
                    fs.appendFileSync(path.join(ROOT_DIR, OUTPUT_FILE), separator + fileHeader + content);
                } catch (error) {
                    console.error(`Error leyendo ${itemPath}:`, error.message);
                }
            }
        }
    }
}

// 1. Inicializar/Limpiar el archivo de salida
fs.writeFileSync(path.join(ROOT_DIR, OUTPUT_FILE), '# Contexto Completo del Proyecto CV-CREATOR-APP\n');
console.log('⏳ Recopilando código...');

// 2. Ejecutar la lectura
buildContext(ROOT_DIR);

console.log(`✅ ¡Listo! Todo tu código se ha consolidado en el archivo: ${OUTPUT_FILE}`);

================================================
📄 ARCHIVO: frontend\.env
================================================

VITE_BACKEND_URL=http://localhost:3000/api

================================================
📄 ARCHIVO: frontend\.gitignore
================================================

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?


================================================
📄 ARCHIVO: frontend\eslint.config.js
================================================

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]


================================================
📄 ARCHIVO: frontend\package.json
================================================

{
  "name": "vet-front-2025",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@stripe/react-stripe-js": "^6.3.0",
    "@stripe/stripe-js": "^9.5.0",
    "@tailwindcss/vite": "^4.0.1",
    "axios": "^1.16.0",
    "i": "^0.3.7",
    "npm": "^11.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.75.0",
    "react-icons": "^5.4.0",
    "react-router": "^7.1.4",
    "react-router-dom": "^7.15.1",
    "react-toastify": "^11.1.0",
    "socket.io-client": "^4.8.3",
    "stripe": "^22.1.1",
    "tailwindcss": "^4.0.1",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "vite": "^6.0.5"
  }
}


================================================
📄 ARCHIVO: frontend\README.md
================================================

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


================================================
📄 ARCHIVO: frontend\src\App.jsx
================================================


import { BrowserRouter, Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { Forgot } from './pages/Forgot'
import { Confirm } from './pages/Confirm'
import { NotFound } from './pages/NotFound'
import Dashboard from './layout/Dashboard'
import Profile from './pages/Profile'
import List from './pages/List'
import Details from './pages/Details'
import Create from './pages/Create'
import Update from './pages/Update'
import Chat from './pages/Chat'
import Reset from './pages/Reset'
import Panel from './pages/Panel'
import PublicRoute from './routers/PublicRoute'
import ProtectedRoute from './routers/ProtectedRoute'
import { useEffect } from 'react'
import storeProfile from './context/storeProfile'
import storeAuth from './context/storeAuth'

function App() {
  const { profile   } = storeProfile()
  const { token } = storeAuth()

  useEffect(() => {
    if (token) {
      profile()
    }
  }, [token])
  return (
    <>
      <BrowserRouter>
        <Routes>


          <Route element={<PublicRoute />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot/:id' element={<Forgot />} />
            <Route path='confirm/:token' element={<Confirm />} />
            <Route path='reset/:token' element={<Reset />} />
            <Route path='*' element={<NotFound />} />
          </Route>


          <Route path='dashboard/*' element={
            <ProtectedRoute>
              <Routes>
                <Route element={<Dashboard />}>
                  <Route index element={<Panel />} />
                  <Route path='profile' element={<Profile />} />
                  <Route path='list' element={<List />} />
                  <Route path='details/:id' element={<Details />} />
                  <Route path='create' element={<Create />} />
                  <Route path='update/:id' element={<Update />} />
                  <Route path='chat' element={<Chat />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


================================================
📄 ARCHIVO: frontend\src\components\catalog\Searchbar.jsx
================================================



================================================
📄 ARCHIVO: frontend\src\components\catalog\Sidebar.jsx
================================================

// components/catalog/Sidebar.jsx
export const Sidebar = ({ onFilter }) => {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 
                          h-fit sticky top-4">

            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Filtros
            </h2>

            {/* Categorías */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 
                               flex justify-between items-center">
                    Categorías <span>▲</span>
                </h3>
                {['Manuales', 'Tecnológicas', 'Ópticas'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm 
                                                text-gray-600 dark:text-gray-400 mb-1">
                        <input type="checkbox" className="accent-blue-900"/>
                        {cat}
                    </label>
                ))}
            </div>

            {/* Disponibilidad */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Disponibilidad
                </h3>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input type="checkbox" className="accent-blue-900" defaultChecked/>
                    Disponible
                </label>
            </div>

            {/* Marca */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Marca
                </h3>
                {['Bosch', 'DeWalt', 'Makita'].map(marca => (
                    <label key={marca} className="flex items-center gap-2 text-sm 
                                                   text-gray-600 dark:text-gray-400 mb-1">
                        <input type="checkbox" className="accent-blue-900"/>
                        {marca}
                    </label>
                ))}
            </div>

        </aside>
    )
}

================================================
📄 ARCHIVO: frontend\src\components\catalog\ToolCard.jsx
================================================

// components/catalog/ToolCard.jsx
export const ToolCard = ({ tool }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md 
                        hover:shadow-xl transition-shadow duration-300 p-4">
            
            {/* Imagen + favorito */}
            <div className="relative">
                <img
                    src={tool.imagen}
                    alt={tool.nombre}
                    className="w-full h-40 object-contain mb-3"
                />
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    ♡
                </button>
            </div>

            {/* Info */}
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">{tool.nombre}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{tool.categoria}</p>

            {/* Disponibilidad */}
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold
                ${tool.disponible 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'}`}>
                {tool.disponible ? 'DISPONIBLE' : `RESERVADO HASTA ${tool.hasta}`}
            </span>

            {/* Botón */}
            <button className="mt-3 w-full py-2 bg-blue-900 dark:bg-purple-700 
                               text-white rounded-lg text-sm font-medium
                               hover:bg-blue-800 transition-colors">
                Añadir a Reserva
            </button>

        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\components\create\Form.jsx
================================================

import { useState } from "react"


export const Form = () => {

    const [stateAvatar, setStateAvatar] = useState({
        generatedImage: "https://cdn-icons-png.flaticon.com/512/2138/2138440.png",
        prompt: "",
        loading: false
    })

    const [selectedOption , setSelectedOption ] = useState("ia")



    return (

        <form>
            

            {/* Información del propietario */}
            <fieldset className="border-2 border-gray-500 p-6 rounded-lg shadow-lg">

                <legend className="text-xl font-bold text-gray-700 bg-gray-200 px-4 py-1 rounded-md">
                    Información del propietario
                </legend>

                {/* Cédula */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Cédula</label>
                    <div className="flex items-center gap-10 mb-5">
                        <input
                            type="number"
                            inputMode="numeric"
                            placeholder="Ingresa la cédula"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                        />
                        <button className="py-1 px-8 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 
                        duration-300 hover:bg-gray-900 hover:text-white sm:w-80">
                            Consultar
                        </button>
                    </div>
                </div>



                {/* Campo nombres completos */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Nombres completos</label>
                    <input
                        type="text"
                        placeholder="Ingresa nombre y apellido"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    />
                </div>


                {/* Campo correo electrónico */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Ingresa el correo electrónico"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    />
                </div>


                {/* Campo celular */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Celular</label>
                    <input
                        type="text"
                        inputMode="tel"
                        placeholder="Ingresa el celular"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    />
                </div>

            </fieldset>



            {/* Información del paciente */}

            <fieldset className="border-2 border-gray-500 p-6 rounded-lg shadow-lg mt-10">

                <legend className="text-xl font-bold text-gray-700 bg-gray-200 px-4 py-1 rounded-md">
                    Información de la mascota
                </legend>


                {/* Campo nombre de la mascota */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Nombre</label>
                    <input
                        type="text"
                        placeholder="Ingresar nombre"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    />
                </div>


                {/* Campo imagen de la mascota*/}
                <label className="mb-2 block text-sm font-semibold">Imagen de la mascota</label>
                
                <div className="flex gap-4 mb-2">
                    {/* Opción: Imagen con IA */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="ia"
                        />
                        Generar con IA
                    </label>

                    {/* Opción: Subir Imagen */}
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            value="upload"
                        />
                        Subir Imagen
                    </label>
                </div>


                {/* Campo imagen con IA */}
                {selectedOption === "ia" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Imagen con IA</label>
                        <div className="flex items-center gap-10 mb-5">
                            <input
                                type="text"
                                placeholder="Ingresa el prompt"
                                className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500"
                                value={stateAvatar.prompt}
                                onChange={(e) => setStateAvatar(prev => ({ ...prev, prompt: e.target.value }))}
                            />
                            <button
                                type="button"
                                className="py-1 px-8 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white sm:w-80"
                                disabled={stateAvatar.loading}
                            >
                                {stateAvatar.loading ? "Generando..." : "Generar con IA"}
                            </button>
                        </div>
                        {stateAvatar.generatedImage && (
                            <img src={stateAvatar.generatedImage} alt="Avatar IA" width={100} height={100} />
                        )}
                    </div>
                )}


                {/* Campo subir imagen */}
                {selectedOption === "upload" && (
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Subir Imagen</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                        />
                    </div>
                )}


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Campo tipo de mascota */}
                    <div>
                        <label htmlFor="tipo" className="mb-2 block text-sm font-semibold">Tipo</label>
                        <select
                            id="tipo"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                            defaultValue=""
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="gato">Gato</option>
                            <option value="perro">Perro</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>


                    {/* Campo fecha de nacimiento */}
                    <div>
                        <label htmlFor="fechaNacimiento" className="mb-2 block text-sm font-semibold">Fecha de nacimiento</label>
                        <input
                            id="fechaNacimiento"
                            type="date"
                            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700"
                        />
                    </div>
                </div>
				

                {/* Campo observación*/}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Observación</label>
                    <textarea
                        placeholder="Ingresa el síntoma u observación de forma general"
                        className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    />
                </div>

            </fieldset>


            {/* Botón de registro */}
            <input
                type="submit"
                className="bg-gray-800 w-full p-2 mt-5 text-slate-300 uppercase font-bold rounded-lg 
                hover:bg-gray-600 cursor-pointer transition-all"
                value="Registrar"
            />

        </form>

    )
}

================================================
📄 ARCHIVO: frontend\src\components\Footer.jsx
================================================

// components/Footer.jsx
import { Link } from 'react-router-dom'
import logo from '../assets/selloEPN.png'

export const Footer = () => {
    return (
        <footer className="bg-blue-900 dark:bg-gray-900 text-white mt-12">

            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Logo y descripción */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src={logo} alt="EPN" className="w-10 h-10"/>
                            <h2 className="text-xl font-bold">Poli Rent</h2>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Sistema de gestión de herramientas para estudiantes 
                            de la Escuela Politécnica Nacional.
                        </p>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contacto</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>📍 Ladrón de Guevara E11-253, Quito</li>
                            <li>📧 esfot@epn.edu.ec</li>
                            <li>📞 (02) 297-6300</li>
                        </ul>
                    </div>

                </div>

                {/* Línea divisora y copyright */}
                <div className="border-t border-blue-800 dark:border-gray-700 mt-8 pt-6 
                                text-center text-gray-400 text-sm">
                    <p>© 2025 Poli Rent - Escuela Politécnica Nacional. Todos los derechos reservados.</p>
                </div>
            </div>

        </footer>
    )
}

================================================
📄 ARCHIVO: frontend\src\components\list\Table.jsx
================================================

import { MdDeleteForever, MdInfo,MdPublishedWithChanges } from "react-icons/md"

const Table = () => {

    return (
    
        <table className="w-full mt-5 table-auto shadow-lg bg-white">

            {/* Encabezado */}
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre mascota", "Nombre propietario", "Email", "Celular", "Estado", "Acciones"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            

            {/* Cuerpo de la tabla */}
            <tbody>

                <tr className="hover:bg-gray-300 text-center">
                
                    <td>1</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    <td>--</td>
                    
                    
                    
                    {/* Columna de acciones */}
                    <td className="py-2 text-center">
                
                        <MdInfo 
                            title="Más información" 
                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-green-600"
                        />

                        
                        <MdPublishedWithChanges 
                            title="Actualizar" 
                            className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-blue-600"
                        />
                        
                        
                        <MdDeleteForever 
                            title="Eliminar" 
                            className="h-7 w-7 text-red-900 cursor-pointer inline-block hover:text-red-600"
                        />
                
                    </td>
                
                </tr>
            
            </tbody>
        
        </table>
    )
}

export default Table


================================================
📄 ARCHIVO: frontend\src\components\Navbar.jsx
================================================


import sello from '../assets/selloEPN.png'
import useDarkMode from '../hooks/useDarkMode'
import {Link} from 'react-router-dom'

export const Navbar = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode()

    return (
        <nav className="flex justify-between items-center px-3 py-1 
                        bg-white dark:bg-gray-900 transition-colors duration-300">

            {/* Logo */}
            <div className="flex items-center gap-3">
                <img src={sello} alt="Sello EPN" className="w-20 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Poli Rent</h1>
            </div>

            {/* Navigation Links */}
            <ul className=" hidden md:flex gap-6">
                <li><Link to="/" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Home</Link></li>
                <li><Link to="/login" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Login</Link></li>
                <li><Link to="/register" className="font-medium text-gray-800 dark:text-white hover:text-blue-600">Register</Link></li>
            </ul>

            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 
                           rounded-md hover:bg-gray-300 transition-colors"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </nav>

    )
}

================================================
📄 ARCHIVO: frontend\src\components\profile\CardPassword.jsx
================================================

import { useForm } from "react-hook-form"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"


const CardPassword = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const {user,updatePasswordProfile} = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`
        const response = await updatePasswordProfile(url,dataForm)
        if(response){
            clearToken()
        }
    }

    return (
        <>
            <div className='mt-5'>
                <h1 className='font-black text-2xl text-gray-500 mt-16'>Actualizar contraseña</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(updatePassword)}>

                {/* Campo contraseña actual */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Contraseña actual</label>
                    <input type="text" placeholder="Ingresa tu contraseña actual" 
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("passwordactual", { required: "La contraseña actual es obligatoria" })}
                    />
                    {errors.passwordactual && <p className="text-red-800">{errors.passwordactual.message}</p>}
                </div>


                {/* Campo contraseña nueva */}
                <div>
                    <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                    <input type="text" placeholder="Ingresa la nueva contraseña" 
                    className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                    {...register("passwordnuevo", { required: "La nueva contraseña es obligatoria" })}
                    />
                    {errors.passwordnuevo && <p className="text-red-800">{errors.passwordnuevo.message}</p>}
                </div>


                {/* Botón para actualizar la contraseña */}
                <input
                    type="submit"
                    className='bg-gray-800 w-full p-2 text-slate-300 uppercase 
                    font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all'
                    value='Cambiar'
                />

            </form>
        </>
    )
}

export default CardPassword

================================================
📄 ARCHIVO: frontend\src\components\profile\CardProfile.jsx
================================================


export const CardProfile = () => {

    return (

        <div className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div className="relative">

                <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="img-client" className="m-auto rounded-full border-2 border-gray-300" width={120} height={120} />
                
                <label className="absolute bottom-0 right-0 bg-blue-400  text-white rounded-full p-2 cursor-pointer hover:bg-emerald-400">📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>

            </div>


            {/* Campo Nombre */}
            <div className="self-start">
                <b>Nombre:</b><p className="inline-block ml-3"></p>
            </div>


            {/* Campo Apellido */}
            <div className="self-start">
                <b>Apellido:</b><p className="inline-block ml-3"></p>
            </div >


            {/* Campo Dirección */}
            <div className="self-start">
                <b>Dirección:</b><p className="inline-block ml-3"></p>
            </div>


            {/* Campo Celular */}
            <div className="self-start">
                <b>Celular:</b><p className="inline-block ml-3"></p>
            </div>

            
            {/* Campo Correo Electrónico */}
            <div className="self-start">
                <b>Correo:</b><p className="inline-block ml-3"></p>
            </div>
        
        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\components\profile\CardProfileOwner.jsx
================================================

export const CardProfileOwner = () => {

    return (
        <div className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div>
                <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="img-client" className="m-auto " width={120} height={120} />
            </div>
            <div className="self-start">
                <b>Nombre:</b><p className="inline-block ml-3"></p>
            </div >
            <div className="self-start">
                <b>Cédula:</b><p className="inline-block ml-3"></p>
            </div >
            <div className="self-start">
                <b>Email:</b><p className="inline-block ml-3"></p>
            </div>
            <div className="self-start">
                <b>Celular:</b><p className="inline-block ml-3"></p>
            </div>
            <div className="self-start">
                <b>Nombre de la mascota:</b><p className="inline-block ml-3"></p>
            </div>
        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\components\profile\FormProfile.jsx
================================================

import { useEffect } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'

const FormularioPerfil = () => {

    const { user,updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarperfil/${user._id}`
        updateProfile(url,dataForm)
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre,
                apellido: user?.apellido,
                direccion: user?.direccion,
                celular: user?.celular,
                email: user?.email,
            })
        }
    }, [user])

    return (

        <form onSubmit={handleSubmit(updateUser)}>

            <ToastContainer/>

            {/* Campo Nombre */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Nombre</label>
                <input type="text" placeholder="Ingresa tu nombre" className="block w-full 
                rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
            </div>
        
        
            {/* Campo Apellido */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Apellido</label>
                <input type="text" placeholder="Ingresa tu apellido" className="block w-full 
                rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                {...register("apellido", { required: "El apellido es obligatorio" })}
                />
                {errors.apellido && <p className="text-red-800">{errors.apellido.message}</p>}
            </div>
        
        
            {/* Campo Dirección */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Dirección</label>
                <input type="text" placeholder="Ingresa tu dirección" className="block w-full 
                rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                {...register("direccion", { required: "La dirección es obligatoria" })}
                />
                {errors.direccion && <p className="text-red-800">{errors.direccion.message}</p>}
            </div>
        
        
            {/* Campo Celular */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Celular</label>
                <input type="text" inputMode="tel" placeholder="Ingresa tu teléfono" className="block w-full 
                rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                {...register("celular", { required: "El celular es obligatorio" })}
                />
                {errors.celular && <p className="text-red-800">{errors.celular.message}</p>}
            </div>
        
        
            {/* Campo Correo Electrónico */}
            <div>
                <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                <input type="email" placeholder="Ingresa tu correo" className="block w-full 
                rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5"
                {...register("email", { required: "El correo es obligatorio" })}
                />
                {errors.email && <p className="text-red-800">{errors.email.message}</p>}
            </div>


            {/* Botón para actualizar el perfil */}
            <input
                type="submit"
                className='bg-gray-800 w-full p-2 mt-5 text-slate-300 uppercase 
                font-bold rounded-lg hover:bg-gray-600 cursor-pointer transition-all'
                value='Actualizar'
            />

        </form>
    )
}

export default FormularioPerfil

================================================
📄 ARCHIVO: frontend\src\components\treatments\Modal.jsx
================================================


const ModalTreatments = () => {

    return (
        <div className="fixed inset-0 flex items-center justify-center">

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-y-auto  max-w-lg w-full border
            border-gray-700 relative">

                <p className="text-white font-bold text-lg text-center mt-4">Tratamiento</p>

                {/* Formulario */}
                <form className="p-10">
                    
                    {/* Campo nombre */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ingresa el nombre"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                        />
                    </div>

                    {/* Campo detalle */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Detalle</label>
                        <textarea
                            type="text"
                            placeholder="Ingresa el detalle"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                        />
                    </div>

                    {/* Campo prioridad */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Prioridad</label>
                        <select
                            id="prioridad"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>

                    {/* Campo precio */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Precio</label>
                        <input
                            type="text" 
                            inputMode="tel"
                            step="any" 
                            placeholder="Ingresa el precio"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                            />
                    </div> 


                    <div className="flex justify-center gap-5">
                        {/* Botón precio */}
                        <input
                            type="submit"
                            className="bg-green-700 px-6 text-slate-300 rounded-lg
                            hover:bg-green-900 cursor-pointer"
                            value="Registrar"
                            />

                        {/* Botón cancelar */}
                        <button className="sm:w-auto leading-3 text-center text-white px-6 py-4 
                        rounded-lg bg-red-700 hover:bg-red-900">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalTreatments


================================================
📄 ARCHIVO: frontend\src\components\treatments\ModalPayment.jsx
================================================

import { useState } from "react";

function ModalPayment() {

  const [loading, setLoading] = useState(false)
  
  return (
      <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-y-auto p-6 max-w-lg w-full border border-gray-700 relative">

              <p className="text-white font-bold text-xl mb-4">Pagar Tratamiento</p>

              <form className="space-y-6 p-6 rounded-lg shadow-md">
                  <div>
                      <label className="block text-sm font-semibold text-gray-200 text-left">Detalle</label>
                      <ul className="text-gray-400 bg-gray-700 p-2 rounded-md text-left">
                          <li>
                              Nombre:
                          </li>
                          <li>
                              Descripción:
                          </li>
                          <li>
                              Prioridad:
                          </li>
                      </ul>
                  </div>
                  <div>
                      <label className="block text-sm font-semibold text-gray-200 text-left">Precio</label>
                      <p className="text-green-400 bg-gray-700 p-2 rounded-md font-bold text-left">$ </p>
                  </div>

                  <label className="block text-sm font-semibold text-gray-200 text-left m-0">Tarjeta de crédito</label>
                  <div className="p-3 border border-gray-600 rounded-lg bg-gray-700">
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                      <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-800 text-white transition duration-300" 
                      >
                      {loading ? "Procesando...":"Pagar"}
                      </button>

                      <button type="button" className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-800 text-white transition duration-300">
                          Cancelar
                      </button>
                  </div>
              </form>

          </div>
      </div>
  );
}

export default ModalPayment;


================================================
📄 ARCHIVO: frontend\src\components\treatments\Table.jsx
================================================

import { MdDeleteForever, MdOutlinePayments } from "react-icons/md";
import ModalPayment from "./ModalPayment";


const TableTreatments = ({ treatments }) => {

    return (
        <>
            <table className='w-full mt-5 table-auto shadow-lg  bg-white'>
                <thead className='bg-gray-800 text-slate-400'>
                    <tr>
                        <th className="p-2">N°</th>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Descripción</th>
                        <th className="p-2">Prioridad</th>
                        <th className="p-2">Precio</th>
                        <th className="p-2">Estado pago</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        treatments.map((treatment, index) => (
                            <tr className="hover:bg-gray-300 text-center" key={treatment._id || index}>
                                <td>{index + 1}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"></span>
                                </td>

                                <td className='py-2 text-center'>

                                    <MdOutlinePayments
                                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-green-600"
                                        title="Pagar"
                                    />

                                    <MdDeleteForever
                                        className="h-8 w-8 text-red-900 cursor-pointer inline-block hover:text-red-600"
                                        title="Eliminar"
                                    />
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>

            {false && (

                <ModalPayment/>

            )}

        </>


    )
}

export default TableTreatments

================================================
📄 ARCHIVO: frontend\src\context\storeAuth.jsx
================================================

import { create } from "zustand"
import { persist } from "zustand/middleware"


const storeAuth = create(
    persist(
        
        set => ({
            token: null,
            rol:null,
            setToken: (token) => set({ token }),
            setRol: (rol) => set({ rol }),
            clearToken: () => set({ token: null})
        }),

        { name: "auth-token" }
    
    )
)


export default storeAuth

================================================
📄 ARCHIVO: frontend\src\context\storeProfile.jsx
================================================

import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedUser?.state?.token}`,
        },
    }
}


const storeProfile = create((set) => ({
        
    user: null,
    clearUser: () => set({ user: null }),
    profile: async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ user: respuesta.data })
        } catch (error) {
            console.error(error)
        }
    },

    updateProfile:async(url, data)=>{
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            set({ user: respuesta.data })
            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg)
        }
    },
    
    updatePasswordProfile:async(url,data)=>{
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders())
            return respuesta
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg)
        }
    }

    })
    
)

export default storeProfile


================================================
📄 ARCHIVO: frontend\src\hooks\useDarkMode.js
================================================

import React from 'react';
import { useEffect, useState } from 'react';

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    )

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode])
   
    return { isDarkMode, setIsDarkMode }
}
export default useDarkMode

================================================
📄 ARCHIVO: frontend\src\hooks\useFetch.js
================================================

import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"

export function useFetch() {

    const [loading, setLoading] = useState(false)

    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}) => {

        const loadingToast = toast.loading("Procesando solicitud...")
        setLoading(true)
        try {
            const response = await axios({
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                data,
            })

            toast.dismiss(loadingToast)
            toast.success(response?.data?.msg)
            return response?.data

        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error(error.response?.data?.msg || "Ocurrió un error inesperado")
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    return {fetchDataBackend,loading }
}

================================================
📄 ARCHIVO: frontend\src\hooks\useTools.jsx
================================================



================================================
📄 ARCHIVO: frontend\src\layout\Dashboard.jsx
================================================

import { Link, Outlet, useLocation } from 'react-router'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'


const Dashboard = () => {
    const location = useLocation()
    const urlActual = location.pathname
    const { clearToken } = storeAuth()
    const{user} = storeProfile()

    return (
    
        <div className='md:flex md:min-h-screen'>


            {/* Menú de navegación lateral */}
            <div className='md:w-1/5 bg-gray-800 px-5 py-4'>

                <h2 className='text-4xl font-black text-center text-slate-200'>POLI RENT</h2>

                <img src="https://cdn-icons-png.flaticon.com/512/2138/2138508.png" alt="img-client" className="m-auto mt-8 
                    p-1 border-2 border-slate-500 rounded-full" width={120} height={120} />


                {/* Nombre de usuario */}
                <p className='text-slate-400 text-center my-4 text-sm'> <span className='bg-green-600 w-3 h-3 
                    inline-block rounded-full'></span> Bienvenido - {user?.nombre} </p>
                

                {/* Rol de usuario */}
                <p className='text-slate-400 text-center my-4 text-sm'> Rol - {user?.rol} </p>
                
                
                <hr className="mt-5 border-slate-500" />


                {/* Enlaces de navegación*/}
                <ul className="mt-5">

                    {/* Enlaces a Dashboard*/}
                    <li className="text-center">
                        <Link to='/dashboard' 
                        className={`${urlActual === '/dashboard' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Dashboard</Link>
                    </li>


                    {/* Enlaces a Perfil*/}
                    <li className="text-center">
                        <Link to='/dashboard/profile' 
                        className={`${urlActual === '/dashboard/profile' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Perfil</Link>
                    </li>


                    {/* Enlaces a Listar */}
                    <li className="text-center">
                        <Link to='/dashboard/list' 
                        className={`${urlActual === '/dashboard/list' ? 'text-slate-200 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Listar</Link>
                    </li>


                    {/* Enlaces a Crear */}
                    <li className="text-center">
                        <Link to='/dashboard/create' 
                        className={`${urlActual === '/dashboard/create' ? 'text-slate-100 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Crear</Link>
                    </li>


                    {/* Enlaces a Chat */}
                    <li className="text-center">
                        <Link to='/dashboard/chat' 
                        className={`${urlActual === '/dashboard/chat' ? 'text-slate-100 bg-gray-900 px-3 py-2 rounded-md text-center' : 'text-slate-600'} text-xl block mt-2 hover:text-slate-600`}>Chat</Link>
                    </li>
                </ul>

            </div>



            <div className='flex-1 flex flex-col justify-between h-screen bg-gray-100'>

                {/* Menú de navegación superior */}
                <div className='bg-gray-800 py-2 flex md:justify-end items-center gap-5 justify-center'>
                
                    {/* Nombre de usuario */}
                    <div className='text-md font-semibold text-slate-100'>
                        Usuario - {user?.nombre}
                    </div>
                
                
                    <div>
                        <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="img-client" className="border-2 border-green-600 rounded-full" width={50} height={50} />
                    </div>
                

                    {/* Botón salir */}
                    <div>
                        <Link to='/' className=" text-white mr-3 text-md block hover:bg-red-900 text-center
                        bg-red-800 px-4 py-1 rounded-lg" onClick={() => clearToken()}>Salir</Link>
                    </div>
                
                </div>
                
                
                {/* Contenido para mostra el contenido de las páginas internas */}
                <div className='overflow-y-scroll p-8'>
                    <Outlet />
                </div>
                
                
                <div className='bg-gray-800 h-12'>
                    <p className='text-center  text-slate-100 leading-[2.9rem] 
                    underline'>Todos los derechos reservados</p>
                </div>

            </div>



        </div>
    )
}

export default Dashboard

================================================
📄 ARCHIVO: frontend\src\main.jsx
================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


================================================
📄 ARCHIVO: frontend\src\pages\Chat.jsx
================================================

import { useState } from "react"



const Chat = () => {

    const [chat, setChat] = useState(true)


    return (
        <>
            {
                chat
                    ? (
                        <div>
                            <form className="flex justify-center gap-5">
                                <input
                                    type="text"
                                    placeholder="Ingresa tu nombre de usuario"
                                    className="block w-1/2 rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                                />
                                <button className="py-2 w-1/2 block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Ingresar al chat</button>
                            </form>
                        </div>
                    )
                    : (
                        <div className="flex flex-col justify-center h-full ">
                            <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">


                            </div>

                            <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                                <form>
                                    <div className="relative flex">
                                        <input type="text" placeholder="Escribe tu mensaje!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3"
                                        />

                                        <button className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-green-800 hover:bg-green-600 focus:outline-none"

                                        >
                                            <span className="font-bold">Enviar</span>
                                        </button>

                                    </div>
                                </form>
                            </div>
                        </div>

                    )
            }
        </>
    )
}

export default Chat

================================================
📄 ARCHIVO: frontend\src\pages\Confirm.jsx
================================================


import {Link} from 'react-router'
import {useParams} from 'react-router'
import { useEffect } from 'react'
import { ToastContainer} from 'react-toastify'
import { useFetch } from '../hooks/useFetch'

export const Confirm = () => {

    const {fetchDataBackend} = useFetch()
    const { token } = useParams()
    
    const verifyToken = async()=>{
        const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`
        await fetchDataBackend(url)
    }

    useEffect(() => {
        verifyToken()
    },[])


    return (
        
        <div className="flex flex-col items-center justify-center h-screen">
            
            <ToastContainer/>
            
            <img className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600" src="/images/gatoConfirm.jpg" alt="image description"/>

            <div className="flex flex-col items-center justify-center">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12">Muchas Gracias</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">Ya puedes iniciar sesión</p>
                <Link to="/login" className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Login</Link>
            </div>

        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\pages\Create.jsx
================================================

import { Form } from '../components/create/Form'

const Create = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Agregar</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite gestionar registros</p>
            <Form />
        </div>
    )
}

export default Create

================================================
📄 ARCHIVO: frontend\src\pages\Details.jsx
================================================

/* eslint-disable no-unused-vars */
import { useState } from "react"
import TableTreatments from "../components/treatments/Table"
import ModalTreatments from "../components/treatments/Modal"



const Details = () => {
    

    const [treatments, setTreatments] = useState(["demo"])



    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Visualizar</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
                <p className='mb-8'>Este módulo te permite visualizar todos los datos</p>
            </div>


            <div>
                <div className='m-5 flex justify-between'>

                    <div>


                        <ul className="list-disc pl-5">

                            <li className="text-md text-gray-00 mt-4 font-bold text-xl">Datos del propietrio</li>


                            {/* Datos del propietario */}
                            <ul className="pl-5">

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Cédula: </span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Nombres completos: </span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Correo electrónico: </span>
                                </li>

                                <li className="text-md mt-2">
                                <span className="text-gray-600 font-bold">Celular: </span>
                                </li>

                            </ul>



                            <li className="text-md text-gray-00 mt-4 font-bold text-xl">Datos de la mascota</li>


                            {/* Datos del paciente */}
                            <ul className="pl-5">

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Nombre: </span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Tipo: </span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Fecha de nacimiento: </span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Estado: </span>
                                    <span className="bg-blue-100 text-green-500 text-xs font-medium 
                                        mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    </span>
                                </li>

                                <li className="text-md text-gray-00 mt-4">
                                    <span className="text-gray-600 font-bold">Observación: </span>
                                </li>
                            </ul>

                        </ul>

                    </div>
                    
                    
                    {/* Imagen lateral */}
                    <div>
                        <img src="https://cdn-icons-png.flaticon.com/512/2138/2138440.png" 
                            alt="dogandcat" className='h-80 w-80' />
                    </div>
                </div>


                <hr className='my-4 border-t-2 border-gray-300' />


                {/* Sección de tratamientos */}
                <div className='flex justify-between items-center'>


                    {/* Apertura del modal tratamientos */}
                    <p>Este módulo te permite gestionar tratamientos</p>
                    {
                        true &&
                        (
                            <button className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700">
                                Registrar
                            </button>
                        )
                    }

                    {false  && (<ModalTreatments/>)}

                </div>
                

                {/* Mostrar los tratamientos */}
                {
                    treatments.length == 0
                        ?
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                            <span className="font-medium">No existen registros</span>
                        </div>
                        :
                        <TableTreatments treatments={treatments} />
                }
                
            </div>
        </>

    )
}

export default Details

================================================
📄 ARCHIVO: frontend\src\pages\Forbidden.jsx
================================================

import logoDog from '../assets/doglost.jpg'

export const Forbidden = () => {
    
    return (

        <div className="flex flex-col items-center justify-center">

            <img className="object-cover h-80 w-80 rounded-full border-4 border-solid
            border-slate-600" src={logoDog} alt="image description" />

            <div className="flex flex-col items-center justify-center">

                <p className="text-3xl md:text-4xl lg:text-5xl 
                text-gray-800 mt-12">Page Not Allowed</p>

                <p className="md:text-lg lg:text-xl
                text-gray-600 mt-8">Sorry, you are not allowed to access this page.</p>


            </div>
        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\pages\Forgot.jsx
================================================

import {Link} from 'react-router'
import { useForm } from 'react-hook-form';
import { ToastContainer} from 'react-toastify'
import { useFetch } from '../hooks/useFetch'

export const Forgot = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const {fetchDataBackend,loading} = useFetch()

    const sendMail = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`
        await fetchDataBackend(url, dataForm,'POST')
    }

    return (

        <div className="flex flex-col sm:flex-row h-screen">

            <ToastContainer/>

            <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">

                <div className="md:w-4/5 sm:w-full">

                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500">!Olvidaste tu contraseña¡</h1>
                    <small className="text-gray-400 block my-4 text-sm">No te preocupes</small>


                    {/* Formulario */}
                    <form onSubmit={handleSubmit(sendMail)}>

                        {/* Campo correo electrónico */}
                        <div className="mb-1">
                            <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
                            <input type="email" placeholder="Ingresa un correo electrónico válido" className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                            {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-800">{errors.email.message}</p>}
                        </div>


                        {/* Botón Forgot password */}
                        <div className="mb-3">
                            <button className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 
                            duration-300 hover:bg-gray-900 hover:text-white" disabled={loading}>
                              {loading ? 'Enviando...' : 'Enviar correo'} 
                            </button>
                        </div>

                    </form>


                    <div className="mt-5 text-xs border-b-2 py-4 "/>


                    {/* Enlace para iniciar sesión si ya posee una cuenta */}
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Ya posees una cuenta?</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Iniciar sesión</Link>
                    </div>

                </div>

            </div>

            {/* Imagen */}
            <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/public/images/catforgot.jpg')] 
                bg-no-repeat bg-cover bg-center sm:block hidden">
            </div>

        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\pages\Home.jsx
================================================

// pages/Home.jsx
import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/catalog/Sidebar'
import { ToolCard } from '../components/catalog/ToolCard'
import { Footer } from '../components/Footer'
import useDarkMode from '../hooks/useDarkMode'
// Data de prueba mientras conectas la API
const toolsMock = [
    { id: 1, nombre: 'Oscilloscope 100MHz', categoria: 'Tecnológicas', disponible: true, imagen: '/images/osciloscopie.webp' },
    { id: 2, nombre: 'Cordless Drill 20V', categoria: 'Manuales', disponible: true, imagen: '/images/drill.jpeg' },
    { id: 3, nombre: 'Arduino Uno Kit', categoria: 'Tecnológicas', disponible: false, hasta: '25 MAY', imagen: '/images/arduino.jpeg' },
    { id: 4, nombre: 'Brocha', categoria: 'Manuales', disponible: true, imagen: '/images/brocha.jpeg' },
]

export const Home = () => {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')

    const filteredTools = toolsMock.filter(tool =>
        tool.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-4 py-6">

                {/* Barra búsqueda + ordenar */}
                <div className="flex gap-3 mb-6 items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       rounded-lg px-4 py-2 pl-10 focus:outline-none 
                                       focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   rounded-lg px-4 py-2 focus:outline-none"
                    >
                        <option value="default">Sort: os</option>
                        <option value="nombre">Nombre</option>
                        <option value="disponible">Disponibilidad</option>
                    </select>
                </div>

                {/* Layout principal */}
                <div className="flex gap-6">
                    <Sidebar />

                    {/* Grid herramientas */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTools.map(tool => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    )
}

================================================
📄 ARCHIVO: frontend\src\pages\List.jsx
================================================

import Table from "../components/list/Table"

const List = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Listar</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite gestionar registros existentes</p>
            <Table/>
        </div>
    )
}

export default List

================================================
📄 ARCHIVO: frontend\src\pages\Login.jsx
================================================

import React from 'react'
import { Navbar } from '../components/Navbar'
import useDarkMode from '../hooks/useDarkMode'
import { useState } from 'react'
import logo from '../assets/selloEPN.png'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useForm } from 'react-hook-form'
import storeAuth from '../context/storeAuth'
import { useFetch } from '../hooks/useFetch'

export function Login() {
  const { isDarkMode } = useDarkMode()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const { fetchDataBackend, loading } = useFetch()
  const [showPassword, setShowPassword] = useState(false)
  const { setToken, setRol } = storeAuth()



    const loginUser = async(dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/login`
        const response = await fetchDataBackend(url, dataForm,'POST')
        if(response){
            navigate('/dashboard')
        }
    }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <main
        className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[url('/images/sistemaLogin.jpg')] bg-cover bg-center relative transition-colors duration-300"
      >
        {/* Filtro para oscurecer la imagen de fondo */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

        {/* Tarjeta de login */}

        {/* Tarjeta */}
        <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 
          w-full max-w-sm mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 
          transition-colors duration-300 my-8">

          {/* Formulario de login */}

          {/* Sello, título y descripción */}
          <img src={logo} className="w-20 mx-auto mb-4" alt="Sello EPN" />
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white transition-colors">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 mb-6 block">
            Accede con tus credenciales institucionales
          </p>

          <form onSubmit={handleSubmit(loginUser)}>
            {/* Correo electrónico */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="nombre.apellido@epn.edu.ec"
                {...register("email", { required: "El correo es obligatorio" })}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-600 dark:focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-500 py-2 px-3 text-sm transition-all"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********************"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-600 dark:focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-500 py-2 px-3 text-sm pr-10 transition-all"
                />
                {errors.password &&
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                }
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botón de iniciar sesión */}
            <div className="mt-4">
              <button className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl 
                            hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
          {/* Separador con opción de "O" */}
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">O</p>
            <hr className="border-gray-400" />
          </div>

          {/* Botón de inicio de sesión con Google */}
          <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-black hover:text-white">
            <img className="w-5 mr-2" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google icon" />
            Sign in with Google
          </button>

          {/* Olvidaste tu contraseña */}
          <div className="mt-5 text-xs border-b-2 py-4">
            <Link to="/forgot/id" className="underline text-sm text-gray-400 hover:text-gray-900">¿Olvidaste tu contraseña?</Link>
          </div>

          {/* Enlaces para volver o registrarse */}
          <div className="mt-3 text-sm flex justify-between items-center">
            <Link to="/" className="underline text-sm text-gray-400 hover:text-gray-900">Regresar</Link>
            <Link to="/register" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</Link>
          </div>

        </div>
      </main>
    </>
  )
}

export default Login

================================================
📄 ARCHIVO: frontend\src\pages\NotFound.jsx
================================================


import { Link } from 'react-router';

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src="/images/logoNotFound.jpeg"
                alt="image description"
            />

            <div className="flex flex-col items-center justify-center text-center mt-12">
                <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800">Página no encontrada</p>
                <p className="md:text-lg lg:text-xl text-gray-600 mt-8">lo sentimos mucho</p>
                <Link to="/" className="p-3 m-5 w-full text-center bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">
                    Regresar
                </Link>
            </div>
        </div>
    );
};


================================================
📄 ARCHIVO: frontend\src\pages\Panel.jsx
================================================

export default function Panel() {

  const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400";

  return (


    <div className="min-h-screen bg-gray-100">


      <h1 className='font-black text-2xl text-gray-500'>Métricas generales</h1>
      <hr className='my-4 border-t-2 border-gray-300' />



      {/* Resultados generales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Clientes</p>
          <p className="text-3xl font-semibold text-gray-800">120</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Mascotas</p>
          <p className="text-3xl font-semibold text-gray-800">185</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Citas hoy</p>
          <p className="text-3xl font-semibold text-gray-800">5</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Tratamientos</p>
          <p className="text-3xl font-semibold text-gray-800">5</p>
        </div>

      </section>



      <h1 className='font-black text-2xl text-gray-500'>Automatizaciones con IA</h1>
      <hr className='my-4 border-t-2 border-gray-300' />


      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-lg shadow p-4">

          <h2 className="text-xl font-semibold text-gray-700 mb-3">Agendar cita</h2>
          <hr className="mb-4" />

          {/* Formulario */}
          <form className="space-y-3">

            <div>
              <label htmlFor="cliente" className="text-sm text-gray-600">Cliente</label>
              <input id="cliente" className={inputCls} placeholder="Ingresa el nombre del cliente" />
            </div>

            <div>
              <label htmlFor="mascota" className="text-sm text-gray-600">Mascota</label>
              <input id="mascota" className={inputCls} placeholder="Nombre de la mascota" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="fecha" className="text-sm text-gray-600">Fecha</label>
                <input id="fecha" type="date" className={inputCls} />
              </div>
              <div>
                <label htmlFor="hora" className="text-sm text-gray-600">Hora</label>
                <input id="hora" type="time" className={inputCls} />
              </div>
            </div>

            <div>
              <label htmlFor="motivo" className="text-sm text-gray-600">Motivo (opcional)</label>
              <input id="motivo" className={inputCls} placeholder="Vacuna, control, etc." />
            </div>

            <button type="button" className="w-full bg-gray-800 text-white rounded-md py-2 hover:bg-gray-700">
              Guardar cita
            </button>

          </form>

        </div>



        {/* Listar citas */}
        <div className="bg-white rounded-lg shadow p-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h2 className="text-xl font-semibold text-gray-700">
              Citas para el día de hoy:{" "}
              <span className="font-normal">
                {new Date().toLocaleDateString("es-EC")}
              </span>
            </h2>

            <button type="button" className="bg-gray-800 text-white rounded-md py-2 
              px-4 hover:bg-gray-700 w-full sm:w-auto">Consultar
            </button>
          </div>

          <hr className="mb-4" />

          <ul className="divide-y">
            <li className="py-3 flex justify-between">
              <div>
                <p className="font-medium text-gray-800">Hora: 09:30</p>
                <p className="text-sm text-gray-600">Propietario: Luna</p>
                <p className="text-sm text-gray-600">Mascota: Luna</p>
                <p className="text-sm text-gray-600">Motivo: Vacuna</p>
              </div>
              <span className="text-xs bg-gray-300 font-bold px-2 py-1 rounded self-center">
                2025-08-28
              </span>
            </li>
          </ul>

        </div>
        
      </section>

    </div>
  )
}


================================================
📄 ARCHIVO: frontend\src\pages\Profile.jsx
================================================


import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'


const Profile = () => {
    return (
        <>       
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Perfil</h1>
                <hr className='x'/>
                <p className='mb-8'>Este módulo te permite gestionar el perfil del usuario</p>
            </div>


            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>

                {/* Fomrulario perfil */}
                <div className='w-full md:w-1/2'>
                    <FormProfile/>
                </div>


                {/* Card para mostrar el perfil y formulario para cambiar la contraseña */}
                <div className='w-full md:w-1/2'>
                    <CardProfile/>
                    
                    <CardPassword/>
                </div>


            </div>
        </>

    )
}

export default Profile

================================================
📄 ARCHIVO: frontend\src\pages\Register.jsx
================================================

import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'
import useDarkMode from "../hooks/useDarkMode"
import { Navbar } from "../components/Navbar"
import { useFetch } from "../hooks/useFetch.js"
import logo from '../assets/selloEPN.png'

export function Register() {

    const { isDarkMode } = useDarkMode()
    const [showPassword, setShowPassword] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        await fetchDataBackend(url, dataForm, "POST")
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full flex items-center justify-center bg-[url('/images/prepoRegister.webp')]
        bg-cover bg-center relative transition-colors duration-300">

                {/* Filtro oscuro */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

                {/* Tarjeta */}
                <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 
          w-full max-w-sm mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 
          transition-colors duration-300 my-8">

                    <ToastContainer />

                    {/* Logo y título */}
                    <img src={logo} className="w-20 mx-auto mb-4" alt="Sello EPN" />
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white transition-colors">
                        Crear Cuenta
                    </h1>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 mb-6 block">
                        Regístrate con tus credenciales institucionales
                    </p>

                    <form onSubmit={handleSubmit(registerUser)}>

                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Nombre
                            </label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500 
                  focus:border-purple-600 dark:focus:border-purple-500 
                  focus:outline-none focus:ring-1 focus:ring-purple-600 
                  py-2 px-3 text-sm transition-all"
                                {...register("nombre", { required: "El nombre es obligatorio" })}
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                        </div>

                        {/* Apellido */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Apellido
                            </label>
                            <input
                                type="text"
                                placeholder="Ingresa tu apellido"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500 
                  focus:border-purple-600 dark:focus:border-purple-500 
                  focus:outline-none focus:ring-1 focus:ring-purple-600 
                  py-2 px-3 text-sm transition-all"
                                {...register("apellido", { required: "El apellido es obligatorio" })}
                            />
                            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                        </div>

                        {/* Facultad */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Facultad
                            </label>
                            <input
                                type="text"
                                placeholder="Ingresa tu facultad"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500 
                  focus:border-purple-600 dark:focus:border-purple-500 
                  focus:outline-none focus:ring-1 focus:ring-purple-600 
                  py-2 px-3 text-sm transition-all"
                                {...register("facultad", { required: "La facultad es obligatoria" })}
                            />
                            {errors.facultad && <p className="text-red-500 text-xs mt-1">{errors.facultad.message}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                inputMode="tel"
                                placeholder="09XXXXXXXX"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500 
                  focus:border-purple-600 dark:focus:border-purple-500 
                  focus:outline-none focus:ring-1 focus:ring-purple-600 
                  py-2 px-3 text-sm transition-all"
                                {...register("telefono", {
                                    required: "El teléfono es obligatorio",
                                    pattern: {
                                        value: /^(09)\d{8}$/,
                                        message: "Debe ser un número válido ej: 09XXXXXXXX"
                                    },
                                    minLength: { value: 10, message: "El teléfono debe tener 10 dígitos" },
                                    maxLength: { value: 10, message: "El teléfono debe tener 10 dígitos" }
                                })}
                            />
                            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                        </div>

                        {/* Cédula */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Cédula
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Ingrese su número de cédula"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500 
                  focus:border-purple-600 dark:focus:border-purple-500 
                  focus:outline-none focus:ring-1 focus:ring-purple-600 
                  py-2 px-3 text-sm transition-all"
                                {...register("cedula", {
                                    required: "La cédula es obligatoria",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Debe ser un número de cédula válido"
                                    },
                                    minLength: { value: 10, message: "La cédula debe tener 10 dígitos" },
                                    maxLength: { value: 10, message: "La cédula debe tener 10 dígitos" }
                                })}
                            />
                            {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula.message}</p>}
                        </div>

                        {/* Correo */}
                        <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="nombre.apellido@epn.edu.ec"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500 
                  focus:border-purple-600 dark:focus:border-purple-500 
                  focus:outline-none focus:ring-1 focus:ring-purple-600 
                  py-2 px-3 text-sm transition-all"
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@epn\.edu\.ec$/,
                                        message: "Debe ser un correo institucional @epn.edu.ec"
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Contraseña */}
                        <div className="mb-6">
                            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********************"
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                    placeholder-gray-400 dark:placeholder-gray-500 
                    focus:border-purple-600 dark:focus:border-purple-500 
                    focus:outline-none focus:ring-1 focus:ring-purple-600 
                    py-2 px-3 text-sm pr-10 transition-all"
                                    {...register("password", {
                                        required: "La contraseña es obligatoria",
                                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                    })}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 
                    hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="py-2.5 w-full block text-center font-medium rounded-xl transition-all 
                duration-300 transform active:scale-[0.98] bg-purple-700 hover:bg-purple-800 
                dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>

                    </form>

                    {/* Link login */}
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400">¿Ya posees una cuenta?</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-gray-600 dark:bg-gray-700 text-slate-300 border 
                dark:border-gray-600 rounded-xl hover:scale-110 duration-300 
                hover:bg-gray-900 hover:text-white"
                        >
                            Iniciar sesión
                        </Link>
                    </div>

                </div>
            </main>
        </>
    )
}

================================================
📄 ARCHIVO: frontend\src\pages\Reset.jsx
================================================

import logoDog from '../assets/dog-hand.webp'
import { useState } from 'react'
import { useEffect } from 'react'
import {useFetch} from '../hooks/useFetch';
import { ToastContainer } from 'react-toastify'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'

const Reset = () => {

    const navigate = useNavigate()
    const { token } = useParams()
    const  {fetchDataBackend,loading}  = useFetch()
    const [tokenback, setTokenBack] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()

    const changePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`
        await fetchDataBackend(url, dataForm,'POST')
        setTimeout(() => {
            if (dataForm.password === dataForm.confirmpassword) {
                navigate('/login')
            }
        }, 2000)
    }


    useEffect(() => {
        const verifyToken = async()=>{
            const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`
            await fetchDataBackend(url,'GET')
            setTokenBack(true)
        }
        verifyToken()
    }, [])
    

    return (
        <div className="flex flex-col items-center justify-center h-screen">

            <ToastContainer />
            
            <h1 className="text-3xl font-semibold mb-2 text-center text-gray-500">
                Bienvenido nuevamente
            </h1>
            <small className="text-gray-400 block my-4 text-sm">
                Pro favor, ingrese los siguientes datos
            </small>
            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={logoDog}
                alt="image description"
            />

            {tokenback && (

                <form className="w-80" onSubmit={handleSubmit(changePassword )}>

                    <div className="mb-1">

                        {/* Campo nueva contraseña */}
                        <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                        <input type="password" placeholder="Ingresa tu nueva contraseña"
                            className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                            {errors.password && <p className="text-red-800">{errors.password.message}</p>}
                        
                        
                        {/* Campo repetir contraseña */}
                        <label className="mb-2 block text-sm font-semibold">Confirmar contraseña</label>
                        <input type="password" placeholder="Repite tu contraseña"
                            className="block w-full rounded-md border border-gray-300 py-1 px-1.5 text-gray-500"
                            {...register("confirmpassword", { required: "La contraseña es obligatoria" })}
                        />
                            {errors.confirmpassword && <p className="text-red-800">{errors.confirmpassword.message}</p>}

                    </div>

                    <div className="mb-3">
                        <button className="bg-gray-600 text-slate-300 border py-2 
                        w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 
                        hover:text-white" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>

                    </div>

                </form>
            )}
        </div>
    )
}

export default Reset


================================================
📄 ARCHIVO: frontend\src\pages\Update.jsx
================================================

const Update = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar</h1>
            <hr className='my-4 border-t-2 border-gray-300' />
            <p className='mb-8'>Este módulo te permite actualizar un registro</p>
        </div>
    )
}

export default Update

================================================
📄 ARCHIVO: frontend\src\routers\ProtectedRoute.jsx
================================================

import { Navigate } from "react-router"
import storeAuth from "../context/storeAuth"

const ProtectedRoute = ({ children }) => {

    const token = storeAuth(state => state.token)
    
    return token ?  children  : <Navigate to="usuario/login" replace />
}

export default ProtectedRoute

================================================
📄 ARCHIVO: frontend\src\routers\PublicRoute.jsx
================================================

import { Navigate, Outlet } from "react-router"
import storeAuth from "../context/storeAuth"


const PublicRoute = () => {

    const token = storeAuth((state) => state.token)
    
    return token ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute

================================================
📄 ARCHIVO: frontend\tailwind.config.cjs
================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

================================================
📄 ARCHIVO: frontend\vite.config.js
================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
