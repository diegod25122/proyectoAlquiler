// components/catalog/ModalReserva.jsx
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MdClose, MdEventNote } from 'react-icons/md'
import storeAuth from '../../context/storeAuth'

export const ModalReserva = ({ producto, onCerrar }) => {
    const { token } = storeAuth()
    const [enviando, setEnviando] = useState(false)
    const [form, setForm] = useState({
        materia: '',
        docente: '',
        proposito: '',
        cantidadSolicitada: 1,
        horasSolicitadas: 2
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setEnviando(true)
            const sesionStorage = JSON.parse(localStorage.getItem("auth-token") || "null")
            const jwtToken = token || sesionStorage?.state?.token || sesionStorage

            const payload = {
                producto: producto._id,
                ...form
            }

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/reservas`,
                payload,
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            )

            toast.success("✅ Solicitud de reserva enviada con éxito")
            onCerrar()
        } catch (error) {
            console.error("Error al crear reserva:", error)
            toast.error(error.response?.data?.msg || "Error al solicitar la reserva")
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 relative animate-in fade-in zoom-in-95">
                
                {/* Botón cerrar */}
                <button 
                    onClick={onCerrar} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <MdClose size={20} />
                </button>

                {/* Encabezado */}
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                    <MdEventNote size={24} />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Reservar Herramienta</h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                    Solicitud para: <strong className="text-gray-800 dark:text-gray-200">{producto.nombre}</strong> ({producto.codigoInventario})
                </p>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Materia / Asignatura</label>
                        <input
                            type="text"
                            name="materia"
                            required
                            placeholder="Ej: Electrónica de Potencia"
                            value={form.materia}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Docente a cargo</label>
                        <input
                            type="text"
                            name="docente"
                            required
                            placeholder="Ej: Ing. Carlos Pérez"
                            value={form.docente}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Propósito de uso</label>
                        <textarea
                            name="proposito"
                            required
                            rows="2"
                            placeholder="Ej: Práctica de laboratorio Nro. 3"
                            value={form.proposito}
                            onChange={handleChange}
                            className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Cantidad</label>
                            <input
                                type="number"
                                name="cantidadSolicitada"
                                min="1"
                                max={producto.stock || 1}
                                required
                                value={form.cantidadSolicitada}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Horas de uso</label>
                            <input
                                type="number"
                                name="horasSolicitadas"
                                min="1"
                                max="8"
                                required
                                value={form.horasSolicitadas}
                                onChange={handleChange}
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onCerrar}
                            className="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={enviando}
                            className="w-1/2 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            {enviando ? 'Enviando...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalReserva