import { useState, useEffect } from "react"
import axios from "axios"
import { FiUsers, FiTrash2, FiLock, FiUnlock, FiAlertTriangle } from "react-icons/fi"

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [procesando, setProcesando] = useState(null)
    const [confirmar, setConfirmar] = useState(null)
    const [msg, setMsg] = useState(null)

    const token = JSON.parse(localStorage.getItem("token") || '""')

    const cargar = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUsuarios(data)
        } catch {
            mostrarMsg("error", "Error al cargar los usuarios")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargar() }, [])

    const mostrarMsg = (tipo, texto) => {
        setMsg({ tipo, texto })
        setTimeout(() => setMsg(null), 3500)
    }

    const bloquear = async (id) => {
        try {
            setProcesando(id)
            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/bloquear/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            mostrarMsg("ok", data.msg)
            cargar()
        } catch (e) {
            mostrarMsg("error", e.response?.data?.msg || "Error al cambiar estado")
        } finally {
            setProcesando(null)
        }
    }

    const eliminar = async (id) => {
        try {
            setProcesando(id)
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            mostrarMsg("ok", "Usuario eliminado correctamente")
            setConfirmar(null)
            cargar()
        } catch (e) {
            mostrarMsg("error", e.response?.data?.msg || "Error al eliminar")
        } finally {
            setProcesando(null)
        }
    }

    const iniciales = (u) =>
        `${u.nombre?.[0] ?? ""}${u.apellido?.[0] ?? ""}`.toUpperCase()

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <FiUsers size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Administra los usuarios registrados en la plataforma</p>
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total", value: usuarios.length, color: "blue" },
                    { label: "Activos", value: usuarios.filter(u => u.confirmEmail).length, color: "green" },
                    { label: "Bloqueados", value: usuarios.filter(u => !u.confirmEmail).length, color: "red" },
                    { label: "Admins", value: usuarios.filter(u => u.rol === "Admin").length, color: "purple" },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-400">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                    Cargando usuarios...
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Usuario</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Cédula</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Facultad</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Rol</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {usuarios.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        {/* Avatar + nombre */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {u.imagen ? (
                                                    <img src={u.imagen} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {iniciales(u)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 leading-tight">
                                                        {u.nombre} {u.apellido}
                                                    </p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.cedula || "—"}</td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.facultad || "—"}</td>
                                        {/* Rol */}
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                u.rol === "Admin"
                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                            }`}>
                                                {u.rol}
                                            </span>
                                        </td>
                                        {/* Estado */}
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                u.confirmEmail
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                            }`}>
                                                {u.confirmEmail ? "Activo" : "Bloqueado"}
                                            </span>
                                        </td>
                                        {/* Acciones */}
                                        <td className="px-4 py-3">
                                            {u.rol === "Admin" ? (
                                                <p className="text-xs text-gray-400 text-center">Protegido</p>
                                            ) : (
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => bloquear(u._id)}
                                                        disabled={procesando === u._id}
                                                        title={u.confirmEmail ? "Bloquear usuario" : "Desbloquear usuario"}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                                                            u.confirmEmail
                                                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-900/60"
                                                                : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60"
                                                        }`}
                                                    >
                                                        {u.confirmEmail ? <FiLock size={12} /> : <FiUnlock size={12} />}
                                                        {u.confirmEmail ? "Bloquear" : "Desbloquear"}
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmar(u._id)}
                                                        disabled={procesando === u._id}
                                                        title="Eliminar usuario"
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                                    >
                                                        <FiTrash2 size={12} /> Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminación */}
            {confirmar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertTriangle size={24} className="text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">¿Eliminar usuario?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Esta acción es irreversible. Se eliminarán todos los datos del usuario.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setConfirmar(null)}
                                className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => eliminar(confirmar)}
                                disabled={!!procesando}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <FiTrash2 size={14} />
                                {procesando ? "Eliminando..." : "Sí, eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GestionUsuarios
