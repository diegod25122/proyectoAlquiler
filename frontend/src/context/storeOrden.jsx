import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = () => {
    let token = null;

    // 1. Buscar en las claves más comunes de localStorage
    const authToken = localStorage.getItem("auth-token");
    const tokenDirecto = localStorage.getItem("token");
    const authStorage = localStorage.getItem("auth-storage");

    const raw = authToken || tokenDirecto || authStorage;

    if (!raw) {
        console.warn("⚠️ No se encontró ningún token en localStorage.");
        return { headers: {} };
    }

    try {
        // 2. Intentar parsear por si viene de Zustand Persist u objeto JSON
        const parsed = JSON.parse(raw);
        token = parsed?.state?.token || parsed?.token || parsed;
    } catch {
        // 3. Si no es JSON, es una cadena de texto simple (JWT)
        token = raw;
    }

    // Validar que realmente sea un string válido y no "undefined" / "null"
    if (!token || token === "undefined" || token === "null") {
        console.error("❌ El token recuperado no es válido:", token);
        return { headers: {} };
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`

const storeOrden = create((set) => ({
    misOrdenes: [],
    clientSecret: null,
    ordenActualId: null,

    // Crea la orden en el backend y recibe el clientSecret de Stripe
    crearOrden: async (items) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/ordenes`,
                { items },
                getAuthHeaders()
            )
            set({ clientSecret: data.clientSecret, ordenActualId: data.ordenId })
            return data
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al crear la orden")
            throw error
        }
    },

    // Llama al backend para confirmar que Stripe procesó el pago
    confirmarPago: async (ordenId, opciones = {}) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/ordenes/confirmar-pago`,
                {
                    ordenId,
                    simularPagoExitoso: opciones.simularPagoExitoso === true
                },
                getAuthHeaders()
            )
            toast.success(data.msg)
            set({ clientSecret: null, ordenActualId: null })
            return data
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al confirmar el pago")
            throw error
        }
    },

    listarMisOrdenes: async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/ordenes/mis-ordenes`, getAuthHeaders())
            set({ misOrdenes: data })
        } catch (error) {
            toast.error("Error al cargar tus órdenes")
        }
    },

    cancelarOrden: async (id) => {
        try {
            const { data } = await axios.put(
                `${BASE_URL}/ordenes/cancelar/${id}`,
                {},
                getAuthHeaders()
            )
            toast.success(data.msg)
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al cancelar la orden")
            throw error
        }
    },

    limpiarCheckout: () => set({ clientSecret: null, ordenActualId: null })
}))

export default storeOrden