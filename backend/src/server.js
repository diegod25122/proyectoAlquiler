// Requerir módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerUsuario from './routers/usuario_routers.js';
import swaggerDocs from './config/swagger.js'

// Inicializaciones
const app = express()
dotenv.config()


// Configuraciones 
// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
        'http://localhost:5173',
        'https://proyecto-alquiler-five.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

// Middlewares 
app.use(cors(corsOptions))
app.use(express.json())

swaggerDocs(app) 

// Variables globales
app.set('port',process.env.PORT || 3000)



// Rutas 

// Ruta principal
app.get('/',(req,res)=>res.send("Server on"))

// Health check endpoint (para Render/Vercel)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() })
})

// Rutas para usuarios
app.use('/api',routerUsuario)

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default  app