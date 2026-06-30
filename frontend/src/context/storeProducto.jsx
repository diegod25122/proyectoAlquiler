import { create } from "zustand"
import axios from "axios"
import { toast } from "react-toastify"

// 🔁 Mismo helper que ya usas en storeProfile.
// (Recomendación a futuro: extraer esto a un solo archivo compartido,
// ej. src/helpers/getAuthHeaders.js, para no mantenerlo duplicado en cada store)
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

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/producto`

const storeProducto = create((set) => ({
    productos: [],
    productoSeleccionado: null,

    // Listar catálogo (Público)
    listarProductos: async () => {
        try {
            const respuesta = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos`)
            set({ productos: respuesta.data })
        } catch (error) {
            console.error(error)
            toast.error("No se pudo cargar el catálogo de productos")
        }
    },

    // Detalle de un producto (Público) 
    detalleProducto: async (id) => {
        try {
            const respuesta = await axios.get(`${BASE_URL}/${id}`)
            set({ productoSeleccionado: respuesta.data })
        } catch (error) {
            console.error(error)
            toast.error("No se pudo cargar el detalle del producto")
        }
    },

    //Registrar producto
    registrarProducto: async (data) => {
        try {
            // data debe ser FormData si incluye imagen, o un objeto plano si no
            const respuesta = await axios.post(`${BASE_URL}/registro`, data, getAuthHeaders(data))
            toast.success(respuesta.data.msg || "Producto registrado exitosamente")
            return respuesta.data
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.msg || "Ocurrió un error al registrar el producto")
            throw error 
        }
    },

    // Actualizar producto
    actualizarProducto: async (id, data) => {
        try {
            const respuesta = await axios.put(`${BASE_URL}/actualizar/${id}`, data, getAuthHeaders(data))
            toast.success(respuesta.data.msg || "Producto actualizado exitosamente")
            return respuesta.data
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.msg || "Ocurrió un error al actualizar el producto")
            throw error
        }
    },

    //Dar de baja producto
    eliminarProducto: async (id) => {
        try {
            const respuesta = await axios.delete(`${BASE_URL}/eliminar/${id}`, getAuthHeaders())
            toast.success(respuesta.data.msg || "Producto dado de baja exitosamente")
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.msg || "Ocurrió un error al dar de baja el producto")
            throw error
        }
    }
}))

export default storeProducto