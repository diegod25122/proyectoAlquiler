import { Router } from "express";
import { 
    registrarReserva, 
    listarReservas, 
    eliminarReserva 
} from "../controllers/reserva_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

// Ruta para crear una reserva
router.post("/registrarReserva", verificarTokenJWT, registrarReserva);

// Ruta para listar todas las reservas
router.get("/listarReservas", verificarTokenJWT, listarReservas);

// Ruta para eliminar una reserva (se pasa el ID por la URL)
router.delete("/eliminarReserva/:id", verificarTokenJWT, eliminarReserva);

export default router;