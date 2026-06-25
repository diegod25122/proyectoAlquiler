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

const storeProfile = create((set) => ({
    user: null,
    clearUser: () => set({ user: null }),
    profile: async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuario/perfil`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ user: respuesta.data })
        } catch (error) {
            console.error(error)
        }
    },

    updateProfile: async (url, data) => {
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders(data))
            set({ user: respuesta.data })
            toast.success("Perfil actualizado correctamente")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg || "Ocurrió un error al actualizar el perfil")
        }
    },

    updatePasswordProfile: async (url, data) => {
        try {
            const respuesta = await axios.put(url, data, getAuthHeaders(data))
            return respuesta
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.msg || "Ocurrió un error al actualizar la contraseña")
        }
    }
}))

export default storeProfile
