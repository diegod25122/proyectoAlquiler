// pages/GestionReservas.jsx
import { useEffect, useState } from "react"
import axios from "axios"
import {
    MdOutlineAssignment, MdCheckCircle, MdCancel,
    MdBuild, MdSettingsBackupRestore, MdSearch, MdFilterList
} from "react-icons/md"
import storeAuth from "../context/storeAuth"
import ModalRechazo from "../components/dashboard/ModalRechazo"

const estadoBadges = {
    Pendiente:  { label: "Pendiente",  cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300" },
    Aprobada:   { label: "Aprobada",   cls: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
    Alquilada:  { label: "En Uso",     cls: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
    Devuelta:   { label: "Devuelta",   cls: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" },
    Rechazada:  { label: "Rechazada",  cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300" },
    Cancelada:  { label: "Cancelada",  cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
}

export const GestionReservas = () => {
    const { token } = storeAuth()
    const [reservas, setReservas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [filtro, setFiltro] = useState("Todas")
    const [busqueda, setBusqueda] = useState("")

    // Estado del modal de rechazo
    const [modalRechazo, setModalRechazo] = useState({ abierto: false, reservaId: null })

    const getAuthHeader = () => {
        const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
        return { headers: { Authorization: `Bearer ${token || sesion?.state?.token}` } }
    }

    const cargarReservas = async () => {
        try {
            setCargando(true)
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reservas`, getAuthHeader())
            setReservas(data || [])
        } catch (e) {
            console.error("Error al cargar reservas:", e)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => { cargarReservas() }, [token])

    const handleAprobar = async (id) => {
        if (!confirm("¿Aprobar esta solicitud? Se descontará el stock.")) return
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/reservas/aprobar/${id}`, {}, getAuthHeader())
            cargarReservas()
        } catch (e) { alert(e.response?.data?.msg || "Error al aprobar") }
    }

    // Abre el modal en vez del prompt()
    const handleRechazar = (id) => {
        setModalRechazo({ abierto: true, reservaId: id })
    }

    const confirmarRechazo = async (motivo) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/reservas/rechazar/${modalRechazo.reservaId}`,
                { motivoRechazo: motivo },
                getAuthHeader()
            )
            setModalRechazo({ abierto: false, reservaId: null })
            cargarReservas()
        } catch (e) { alert(e.response?.data?.msg || "Error al rechazar") }
    }

    const handleEntregarEquipo = async (id) => {
        if (!confirm("¿Confirmas que el estudiante retiró la herramienta?")) return
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/reservas/en-uso/${id}`, {}, getAuthHeader())
            cargarReservas()
        } catch (e) { alert(e.response?.data?.msg || "Error al marcar en uso") }
    }

    const handleRecibirDevolucion = async (id) => {
        const obs = prompt("Observaciones de la devolución:")
        if (obs === null) return
        try {
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/reservas/devolver/${id}`, { observacionesAdmin: obs }, getAuthHeader())
            cargarReservas()
        } catch (e) { alert(e.response?.data?.msg || "Error al registrar devolución") }
    }

    const reservasFiltradas = reservas.filter(r => {
        const coincideFiltro = filtro === "Todas" || r.estado === filtro
        const q = busqueda.toLowerCase()
        return coincideFiltro && (
            r.usuario?.nombre?.toLowerCase().includes(q) ||
            r.usuario?.cedula?.includes(q) ||
            r.producto?.nombre?.toLowerCase().includes(q) ||
            r.materia?.toLowerCase().includes(q)
        )
    })

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* Modal de rechazo */}
            {modalRechazo.abierto && (
                <ModalRechazo
                    onConfirmar={confirmarRechazo}
                    onCerrar={() => setModalRechazo({ abierto: false, reservaId: null })}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <MdOutlineAssignment className="text-purple-600" /> Control y Gestión de Reservas
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Autoriza y controla los préstamos de herramientas del taller.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input type="text" placeholder="Buscar por alumno, cédula o materia..."
                        value={busqueda} onChange={e => setBusqueda(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <MdFilterList className="text-gray-400 text-lg mr-1" />
                {["Todas", "Pendiente", "Aprobada", "Alquilada", "Devuelta", "Rechazada"].map(e => (
                    <button key={e} onClick={() => setFiltro(e)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            filtro === e ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                        {estadoBadges[e]?.label || "Todas"}
                    </button>
                ))}
            </div>

            {cargando ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">Cargando solicitudes...</div>
            ) : reservasFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500">
                    No se encontraron reservas.
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="p-4">Estudiante</th>
                                    <th className="p-4">Herramienta</th>
                                    <th className="p-4">Materia / Docente</th>
                                    <th className="p-4">Detalles</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                {reservasFiltradas.map(r => {
                                    const badge = estadoBadges[r.estado] || { label: r.estado, cls: "bg-gray-100 text-gray-700" }
                                    return (
                                        <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-900 dark:text-white">{r.usuario?.nombre} {r.usuario?.apellido}</p>
                                                <p className="text-xs text-gray-500">{r.usuario?.email}</p>
                                                <p className="text-xs text-gray-400">{r.usuario?.cedula}</p>
                                            </td>
                                            <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                                                <p>{r.producto?.nombre || "Herramienta"}</p>
                                                <span className="text-[11px] font-mono text-purple-600">{r.producto?.codigoInventario}</span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-600 dark:text-gray-300">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{r.materia}</p>
                                                <p className="text-gray-500">Docente: {r.docente}</p>
                                                <p className="italic text-gray-400 truncate max-w-xs">{r.proposito}</p>
                                            </td>
                                            <td className="p-4 text-xs whitespace-nowrap">
                                                <p><strong>Cant:</strong> {r.cantidad} un.</p>
                                                <p><strong>Tiempo:</strong> {r.horasSolicitadas}h</p>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {r.estado === "Pendiente" && (<>
                                                        <button onClick={() => handleAprobar(r._id)}
                                                            className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                            <MdCheckCircle className="text-lg" />
                                                        </button>
                                                        <button onClick={() => handleRechazar(r._id)}
                                                            className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                                            <MdCancel className="text-lg" />
                                                        </button>
                                                    </>)}
                                                    {r.estado === "Aprobada" && (
                                                        <button onClick={() => handleEntregarEquipo(r._id)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs font-semibold">
                                                            <MdBuild /> Entregar Equipo
                                                        </button>
                                                    )}
                                                    {r.estado === "Alquilada" && (
                                                        <button onClick={() => handleRecibirDevolucion(r._id)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold">
                                                            <MdSettingsBackupRestore /> Recibir Devolución
                                                        </button>
                                                    )}
                                                    {["Devuelta", "Rechazada", "Cancelada"].includes(r.estado) && (
                                                        <span className="text-xs text-gray-400 italic">Finalizado</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GestionReservas