import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = () => {
    const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
    return {
        headers: {
            Authorization: `Bearer ${sesion?.state?.token}`
        }
    }
}

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