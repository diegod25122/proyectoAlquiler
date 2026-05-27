import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'POLI - RENT API',
            version: '1.0.0',
            description: 'API REST para el sistema de gestión de herramientas EPN'
        },
        servers: [
            { url: 'http://localhost:3000/api' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routers/*.js'] // lee tus rutas automáticamente
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    console.log('📄 Documentación disponible en http://localhost:3000/api-docs')
}

export default swaggerDocs
