import app from './server.js'
import connection from './database.js'
import { iniciarCronExpiracion } from './controllers/ordenCompra_controller.js'

const PORT = app.get('port')

// Conectar a la base de datos
connection()
iniciarCronExpiracion()

// Iniciar el servidor
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`)
    console.log(`📄 API Documentation: http://localhost:${PORT}/api-docs`)
})

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err)
    server.close(() => process.exit(1))
})

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err)
    server.close(() => process.exit(1))
})

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('📌 SIGTERM received, shutting down gracefully')
    server.close(() => {
        console.log('✅ Server closed')
        process.exit(0)
    })
})
