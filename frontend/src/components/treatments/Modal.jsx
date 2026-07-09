/* eslint-disable react/prop-types */
import { useRef } from 'react'
import useStorePrestamos from '../../context/storePrestamos'
import storeProfile from '../../context/storeProfile'

const ModalTreatments = ({ herramientaId, listarPrestamos }) => {
    const { registerPrestamo, toggleModal } = useStorePrestamos()
    const { user } = storeProfile()
    const form = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(form.current))
        const url = `${import.meta.env.VITE_BACKEND_URL}/prestamo/registro`
        await registerPrestamo(url, {
            ...data,
            herramienta: herramientaId,
            usuario: user?._id
        })
        listarPrestamos()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-w-lg w-full border border-gray-700 relative">

                <p className="text-white font-bold text-lg text-center mt-4">Registrar Préstamo</p>

                <form ref={form} onSubmit={handleSubmit} className="p-10">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Precio ($)</label>
                        <input
                            name="precio"
                            type="number"
                            min="1"
                            placeholder="Ingresa el precio"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5 bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Fecha inicio</label>
                        <input
                            name="fechaInicio"
                            type="date"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5 bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Fecha fin</label>
                        <input
                            name="fechaFin"
                            type="date"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-500 mb-5 bg-gray-50"
                        />
                    </div>

                    <div className="flex justify-center gap-5">
                        <input
                            type="submit"
                            value="Registrar"
                            className="bg-green-700 px-6 py-2 text-slate-300 rounded-lg hover:bg-green-900 cursor-pointer"
                        />
                        <button
                            type="button"
                            onClick={() => toggleModal('registro')}
                            className="text-white px-6 py-4 rounded-lg bg-red-700 hover:bg-red-900"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalTreatments
