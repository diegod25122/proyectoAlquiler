import { create } from 'zustand'
import axios from 'axios'
import { toast } from 'react-toastify'

const getAuthHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem('auth-token'))
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedUser?.state?.token}`
        }
    }
}

const useStorePrestamos = create((set) => ({

    modal: null,
    prestamoSeleccionado: null,

    toggleModal: (modalType) => set((state) => ({
        modal: state.modal === modalType ? null : modalType
    })),

    setPrestamoSeleccionado: (prestamo) => set({ prestamoSeleccionado: prestamo }),

    registerPrestamo: async (url, data) => {
        try {
            const respuesta = await axios.post(url, data, getAuthHeaders())
            toast.success(respuesta.data.msg)
            set({ modal: null })
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error al registrar el préstamo')
            console.error(error)
        }
    },

    deletePrestamo: async (url) => {
        try {
            const isConfirmed = confirm('Vas a eliminar un préstamo ¿Estás seguro de realizar esta acción?')
            if (isConfirmed) {
                const respuesta = await axios.delete(url, getAuthHeaders())
                toast.success(respuesta.data.msg)
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error al eliminar')
            console.error(error)
        }
    },

    payPrestamo: async (url, data) => {
        try {
            const respuesta = await axios.post(url, data, getAuthHeaders())
            toast.success(respuesta.data.msg)
            set({ modal: null, prestamoSeleccionado: null })
            return { success: true }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error al procesar el pago')
            console.error(error)
            return { success: false }
        }
    }

}))

export default useStorePrestamos
