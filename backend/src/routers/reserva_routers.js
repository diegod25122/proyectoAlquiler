import {Router} from "express"; 
import {registrarReserva} from "../controllers/reserva_controller.js";
import {verificarToken} from "../middlewares/JWT.js";
const router = Router();

router.post("/registrarReserva",verificarToken,registrarReserva);

export default router;