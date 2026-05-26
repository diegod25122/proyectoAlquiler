import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"

export function useFetch() {

    const [loading, setLoading] = useState(false)

    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}) => {

        const loadingToast = toast.loading("Procesando solicitud...")
        setLoading(true)
        try {
            const response = await axios({
                method,
                url,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                data,
            })

            toast.dismiss(loadingToast)
            toast.success(response?.data?.msg)
            return response?.data

        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error(error.response?.data?.msg || "Ocurrió un error inesperado")
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    return {fetchDataBackend,loading }
}