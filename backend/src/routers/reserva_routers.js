import {Router} from "express" 
import {registrarReserva} from "../controllers/reserva_controller.js"
import {verificarTokenJWT} from "../middlewares/JWT.js"
const router = Router();

router.post("/registrarReserva",verificarTokenJWT,registrarReserva);

export default router;