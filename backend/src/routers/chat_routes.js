import { Router } from 'express'
import { chatIA } from '../controllers/chat_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const routerChat = Router()

routerChat.post('/chat', verificarTokenJWT, chatIA)

export default routerChat
