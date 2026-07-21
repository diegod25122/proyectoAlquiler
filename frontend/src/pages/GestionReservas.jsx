import { useState, useEffect } from "react"
import axios from "axios"
import { FiCheck, FiX, FiClock, FiUser, FiPackage, FiCalendar, FiMessageSquare } from "react-icons/fi"

const ESTADO_BADGE = {
    Pendiente:  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    Aprobada:   "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    Rechazada:  "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    Alquilada:  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Devuelta:   "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Cancelada:  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
}

const GestionReservas = () => {
    const [reservas, setReservas] = useState([])
    const [loading, setLoading] = useState(true)
    const [filtro, setFiltro] = useState("Pendiente")
    const [modal, setModal] = useState(null)
    const [motivo, setMotivo] = useState("")
    const [procesando, setProcesando] = useState(false)
    const [msg, setMsg] = useState(null)

    const token = JSON.parse(localStorage.getItem("token") || '""')

    const cargar = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/reservas`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setReservas(data)
        } catch {
            setMsg({ tipo: "error", texto: "Error al cargar las reservas" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargar() }, [])

    const mostrarMsg = (tipo, texto) => {
        setMsg({ tipo, texto })
        setTimeout(() => setMsg(null), 3500)
    }

    const aprobar = async (id) => {
        try {
            setProcesando(true)
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/reservas/aprobar/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            mostrarMsg("ok", "Reserva aprobada correctamente")
            cargar()
        } catch (e) {
            mostrarMsg("error", e.response?.data?.msg || "Error al aprobar")
        } finally {
            setProcesando(false)
        }
    }

    const rechazar = async () => {
        if (!motivo.trim()) return
        try {
            setProcesando(true)
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/reservas/rechazar/${modal}`,
                { motivo },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            mostrarMsg("ok", "Reserva rechazada y notificación enviada al usuario")
            setModal(null)
            setMotivo("")
            cargar()
        } catch (e) {
            mostrarMsg("error", e.response?.data?.msg || "Error al rechazar")
        } finally {
            setProcesando(false)
        }
    }

    const lista = reservas.filter(r => filtro === "Todas" || r.estado === filtro)

    const conteo = (estado) => reservas.filter(r => r.estado === estado).length

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    <FiCalendar size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Reservas</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aprueba o rechaza solicitudes de reserva</p>
                </div>
            </div>

            {/* Notificación */}
            {msg && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                    msg.tipo === "ok"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                }`}>
                    {msg.texto}
                </div>
            )}

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-5">
                {["Todas", "Pendiente", "Aprobada", "Rechazada", "Alquilada", "Devuelta"].map(estado => (
                    <button
                        key={estado}
                        onClick={() => setFiltro(estado)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            filtro === estado
                                ? "bg-purple-600 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        {estado}
                        {estado !== "Todas" && (
                            <span className="ml-1.5 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                                {conteo(estado)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400">
                    <FiClock className="animate-spin mr-2" /> Cargando reservas...
                </div>
            ) : lista.length === 0 ? (
                <div className="text-center py-16 text-gray-400 dark:text-gray-600">
                    <FiCalendar size={40} className="mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No hay reservas en este estado</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Usuario</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Producto</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Fechas</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Cantidad</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {lista.map(r => (
                                    <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        {/* Usuario */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                                                    <FiUser size={14} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">
                                                        {r.usuario?.nombre} {r.usuario?.apellido}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{r.usuario?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Producto */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {r.producto?.imagen ? (
                                                    <img src={r.producto.imagen} alt="" className="w-8 h-8 rounded object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                                        <FiPackage size={14} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">{r.producto?.nombre}</p>
                                                    <p className="text-xs text-gray-400">{r.producto?.codigoInventario}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Fechas */}
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">
                                            <p>{new Date(r.fechaInicio).toLocaleDateString("es-EC")}</p>
                                            <p className="text-gray-400">→ {new Date(r.fechaFin).toLocaleDateString("es-EC")}</p>
                                        </td>
                                        {/* Cantidad */}
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium text-center">
                                            {r.cantidad ?? 1}
                                        </td>
                                        {/* Estado */}
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ESTADO_BADGE[r.estado] || ESTADO_BADGE.Cancelada}`}>
                                                {r.estado}
                                            </span>
                                            {r.estado === "Rechazada" && r.observaciones && (
                                                <p className="text-xs text-gray-400 mt-1 max-w-[160px] truncate" title={r.observaciones}>
                                                    {r.observaciones}
                                                </p>
                                            )}
                                        </td>
                                        {/* Acciones */}
                                        <td className="px-4 py-3">
                                            {r.estado === "Pendiente" ? (
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => aprobar(r._id)}
                                                        disabled={procesando}
                                                        title="Aprobar"
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <FiCheck size={13} /> Aprobar
                                                    </button>
                                                    <button
                                                        onClick={() => { setModal(r._id); setMotivo("") }}
                                                        disabled={procesando}
                                                        title="Rechazar"
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <FiX size={13} /> Rechazar
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 text-center">—</p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de Rechazo */}
            {modal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <FiMessageSquare className="text-red-600" size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Rechazar reserva</h3>
                                <p className="text-xs text-gray-500">Se enviará un correo al usuario con el motivo</p>
                            </div>
                        </div>

                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Motivo del rechazo <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={motivo}
                            onChange={e => setMotivo(e.target.value)}
                            placeholder="Explica brevemente por qué se rechaza la reserva..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2.5 px-3 text-sm text-gray-700 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        />

                        <div className="flex gap-3 mt-5 justify-end">
                            <button
                                onClick={() => { setModal(null); setMotivo("") }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={rechazar}
                                disabled={!motivo.trim() || procesando}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <FiX size={14} />
                                {procesando ? "Enviando..." : "Rechazar y notificar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GestionReservas
