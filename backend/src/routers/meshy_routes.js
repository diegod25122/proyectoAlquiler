import { Router } from 'express'
import { generarModelo3D } from '../controllers/meshy_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const routerMeshy = Router()

routerMeshy.post('/meshy/generar', verificarTokenJWT, generarModelo3D)

export default routerMeshy
