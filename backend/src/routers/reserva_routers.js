import { Router } from "express"
import { registrarReserva, listarReservas, aprobarReserva, rechazarReserva } from "../controllers/reserva_controller.js"
import { verificarTokenJWT, verificarRolAdmin } from "../middlewares/JWT.js"

const router = Router();

router.post("/registrarReserva", verificarTokenJWT, registrarReserva)
router.get("/reservas", verificarTokenJWT, verificarRolAdmin, listarReservas)
router.put("/reservas/aprobar/:id", verificarTokenJWT, verificarRolAdmin, aprobarReserva)
router.put("/reservas/rechazar/:id", verificarTokenJWT, verificarRolAdmin, rechazarReserva)

export default router;
