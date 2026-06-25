// src/context/storeHerramienta.js
import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

const getAuthHeaders = (data) => {
    const storedUser = JSON.parse(localStorage.getItem("auth-token"))
    const headers = {
        Authorization: `Bearer ${storedUser?.state?.token}`,
    }
    if (!(data instanceof FormData)) {
        headers["Content-Type"] = "application/json"
    }
    return { headers }
}

const storeHerramienta = create((set) => ({
    herramientas: [],

    listarHerramientas: async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/herramientas`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ herramientas: respuesta.data })
        } catch (error) {
            console.error("Error al listar herramientas:", error)
            toast.error("No se pudieron cargar las herramientas")
        }
    },

    registrarHerramienta: async (formData) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/herramienta/registro`
            await axios.post(url, formData, getAuthHeaders(formData))
            toast.success("Herramienta registrada correctamente")
            return true
        } catch (error) {
            console.error("Error al registrar herramienta:", error)
            toast.error(error.response?.data?.msg || "Error al registrar la herramienta")
            return false
        }
    },

    actualizarHerramienta: async (id, formData) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/herramienta/actualizar/${id}`
            await axios.put(url, formData, getAuthHeaders(formData))
            toast.success("Herramienta actualizada correctamente")
            return true
        } catch (error) {
            console.error("Error al actualizar herramienta:", error)
            toast.error(error.response?.data?.msg || "Error al actualizar la herramienta")
            return false
        }
    },
}))

export default storeHerramienta