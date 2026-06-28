// src/context/storeHerramienta.js
import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"
import { actualizarProducto, listarProductos, registrarProducto } from "../../../backend/src/controllers/producto_controller"

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

const storeProducto = create((set) => ({
    productos: [],

    listarProductos: async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/productos`
            const respuesta = await axios.get(url, getAuthHeaders())
            set({ herramientas: respuesta.data })
        } catch (error) {
            console.error("Error al listar productos:", error)
            toast.error("No se pudieron cargar los productos")
        }
    },

    registrarProducto: async (formData) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/producto/registro`
            await axios.post(url, formData, getAuthHeaders(formData))
            toast.success("Producto registrada correctamente")
            return true
        } catch (error) {
            console.error("Error al registrar producto:", error)
            toast.error(error.response?.data?.msg || "Error al registrar el producto")
            return false
        }
    },

    actualizarProducto: async (id, formData) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/producto/actualizar/${id}`
            await axios.put(url, formData, getAuthHeaders(formData))
            toast.success("Producto actualizado correctamente")
            return true
        } catch (error) {
            console.error("Error al actualizar producto:", error)
            toast.error(error.response?.data?.msg || "Error al actualizar el producto")
            return false
        }
    },
}))

export default storeProducto