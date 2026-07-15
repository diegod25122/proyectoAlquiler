import { Router } from 'express'
import { consultarCedula } from '../controllers/cedula_controller.js'

const routerCedula = Router()

routerCedula.get('/cedula/:numero', consultarCedula)

export default routerCedula
