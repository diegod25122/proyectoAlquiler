// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import os from 'os'
import routerUsuario from './routers/usuario_routers.js';
import swaggerDocs from './config/swagger.js'
import fileUpload from "express-fileupload"
import cloudinary from 'cloudinary'
import routerProducto from './routers/producto_routers.js';
import routerReserva from './routers/reserva_routers.js';
import { iniciarCronExpiracion } from './controllers/ordenCompra_controller.js';
import ordenCompraRouter from './routers/OrdenCompra_routers.js';
import routerCedula from './routers/cedula_routes.js';
// Reemplazamos/actualizamos el router 3D con sintaxis import
import router from './routers/3D_routers.js';

// Inicializaciones
const app = express()
dotenv.config()

// Configuracion cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
        'http://localhost:5173',
        'https://proyectoalquiler.onrender.com',
        'https://proyecto-alquiler-five.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

// Middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    createParentPath: true,
}))

swaggerDocs(app)

// Variables globales
app.set('port', process.env.PORT || 3000)

// Rutas

// Ruta principal
app.get('/', (req, res) => res.send("Server on"))

// Health check endpoint (para Render/Vercel)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() })
})

// Rutas de la API
app.use('/api', routerUsuario)
app.use('/api', routerProducto)
app.use('/api', routerReserva)
app.use('/api', ordenCompraRouter)
app.use('/api', routerCedula)

// Ruta para generación 3D (Tripo3D)
app.use('/api', router)

// Manejo de ruta no encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express
export default app