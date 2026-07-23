import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = () => {
    const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
    const token = sesion?.state?.token || sesion?.token || sesion
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const useStoreReserva = create((set) => ({
    misReservas: [],
    cargando: false,

    // Obtener las reservas del estudiante autenticado
    listarMisReservas: async () => {
        set({ cargando: true })
        try {
            const { data } = await axios.get(`${BASE_URL}/reserva/mis-reservas`, getAuthHeaders())
            set({ misReservas: data, cargando: false })
        } catch (error) {
            console.error("Error al obtener mis reservas:", error)
            toast.error(error.response?.data?.msg || "Error al cargar tus reservas")
            set({ cargando: false })
        }
    },

    // Registrar una nueva reserva académica
    registrarReserva: async (datosReserva) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/registrarReserva`,
                datosReserva,
                getAuthHeaders()
            )
            toast.success(data.msg || "Reserva solicitada con éxito")
            return data
        } catch (error) {
            console.error("Error al registrar reserva:", error)
            toast.error(error.response?.data?.msg || "Error al registrar la reserva")
            throw error
        }
    }
}))