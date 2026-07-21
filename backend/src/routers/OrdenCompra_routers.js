import { Router } from "express"
import {
    crearOrden,
    confirmarPago,
    listarMisOrdenes,
    listarOrdenes,
    marcarEntregado,
    cancelarOrden
} from "../controllers/ordenCompra_controller.js"
import { verificarTokenJWT, verificarRolAdmin } from "../middlewares/JWT.js"

const router = Router()

// ─── Rutas del Usuario ────────────────────────────────────────
router.post("/ordenes", verificarTokenJWT, crearOrden)
router.post("/ordenes/confirmar-pago", verificarTokenJWT, confirmarPago)
router.get("/ordenes/mis-ordenes", verificarTokenJWT, listarMisOrdenes)
router.put("/ordenes/cancelar/:id", verificarTokenJWT, cancelarOrden)

// ─── Rutas del Admin ──────────────────────────────────────────
router.get("/ordenes", verificarTokenJWT, verificarRolAdmin, listarOrdenes)
router.put("/ordenes/entregar/:id", verificarTokenJWT, verificarRolAdmin, marcarEntregado)

export default router