// pages/ReservarProducto.jsx
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import axios from "axios"
import storeCarrito from "../context/storeCarrito"

const getAuthHeaders = () => {
    const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
    return { headers: { Authorization: `Bearer ${sesion?.state?.token}` } }
}

const ReservarProducto = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { quitarReserva } = storeCarrito()

    const [producto, setProducto] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [enviando, setEnviando] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm()

    // Cargar datos del producto para mostrar en el resumen
    useEffect(() => {
        const cargar = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/producto/${id}`
                )
                if (data.tipo !== "Prestable") {
                    toast.error("Este producto no es prestable")
                    navigate("/")
                    return
                }
                setProducto(data)
            } catch {
                toast.error("No se pudo cargar el producto")
                navigate("/")
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [id])

    const onSubmit = async (dataForm) => {
        setEnviando(true)
        try {
            const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
            const usuarioId = sesion?.state?._id

            // ⚠️ NOTA: tu reserva_controller.js actual espera
            // { usuario, producto, fechaInicio, fechaFin }.
            // Debes actualizarlo para que acepte los campos académicos:
            // { producto, materia, docente, proposito, horasSolicitadas, cantidadSolicitada }
            // El usuario lo toma del JWT (req.usuarioHeader._id), no del body.
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/registrarReserva`,
                {
                    producto: id,
                    materia: dataForm.materia,
                    docente: dataForm.docente,
                    proposito: dataForm.proposito,
                    horasSolicitadas: Number(dataForm.horasSolicitadas),
                    cantidadSolicitada: Number(dataForm.cantidadSolicitada) || 1,
                },
                getAuthHeaders()
            )

            // Limpiar del carrito de reservas
            quitarReserva(id)
            toast.success("✅ Reserva enviada. El encargado la revisará pronto.")
            setTimeout(() => navigate("/dashboard/mis-reservas"), 2000)

        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al enviar la reserva")
        } finally {
            setEnviando(false)
        }
    }

    if (cargando) return (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
            Cargando producto...
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
            <ToastContainer />
            <div className="max-w-2xl mx-auto">

                {/* Encabezado */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3 flex items-center gap-1"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Solicitar Reserva
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Completa los datos académicos para justificar el préstamo
                    </p>
                </div>

                {/* Resumen del producto */}
                {producto && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4 mb-6">
                        <img
                            src={producto.imagen || "https://cdn-icons-png.flaticon.com/512/2618/2618671.png"}
                            alt={producto.nombre}
                            className="w-20 h-20 object-contain rounded-lg bg-gray-50 dark:bg-gray-800"
                        />
                        <div>
                            <span className="font-mono text-xs text-gray-400">{producto.codigoInventario}</span>
                            <h2 className="font-bold text-gray-900 dark:text-white">{producto.nombre}</h2>
                            <p className="text-sm text-gray-500">{producto.categoria}</p>
                            <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                Stock disponible: {producto.stock}
                            </span>
                        </div>
                    </div>
                )}

                {/* Formulario */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Materia */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Materia *
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Electrónica Digital"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("materia", { required: "La materia es obligatoria" })}
                            />
                            {errors.materia && <p className="text-red-500 text-xs mt-1">{errors.materia.message}</p>}
                        </div>

                        {/* Docente */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Docente *
                            </label>
                            <input
                                type="text"
                                placeholder="Ej: Ing. García"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("docente", { required: "El docente es obligatorio" })}
                            />
                            {errors.docente && <p className="text-red-500 text-xs mt-1">{errors.docente.message}</p>}
                        </div>
                    </div>

                    {/* Propósito */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Propósito del préstamo *
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Describe para qué necesitas esta herramienta..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("proposito", {
                                required: "El propósito es obligatorio",
                                minLength: { value: 20, message: "Describe con más detalle (mínimo 20 caracteres)" }
                            })}
                        />
                        {errors.proposito && <p className="text-red-500 text-xs mt-1">{errors.proposito.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Horas */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Horas solicitadas *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="8"
                                placeholder="Ej: 3"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("horasSolicitadas", {
                                    required: "Las horas son obligatorias",
                                    min: { value: 1, message: "Mínimo 1 hora" },
                                    max: { value: 8, message: "Máximo 8 horas por reserva" }
                                })}
                            />
                            {errors.horasSolicitadas && <p className="text-red-500 text-xs mt-1">{errors.horasSolicitadas.message}</p>}
                        </div>

                        {/* Cantidad */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={producto?.stock || 1}
                                defaultValue={1}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("cantidadSolicitada", {
                                    min: { value: 1, message: "Mínimo 1" },
                                    max: { value: producto?.stock, message: "No hay suficiente stock" }
                                })}
                            />
                            {errors.cantidadSolicitada && <p className="text-red-500 text-xs mt-1">{errors.cantidadSolicitada.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full py-3 bg-[#6B46C1] text-white rounded-xl font-semibold text-sm hover:bg-[#5b3aa8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {enviando ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando reserva...</>
                        ) : (
                            "📅 Enviar solicitud de reserva"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ReservarProducto