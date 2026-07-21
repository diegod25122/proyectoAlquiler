import { Outlet, useNavigate, Link } from 'react-router'
import { useState } from 'react'
import { MdHome, MdLogout } from 'react-icons/md'
import { Sidebar } from '../components/dashboard/Sidebar'
import storeProfile from '../context/storeProfile'
import storeAuth from '../context/storeAuth'

const Dashboard = () => {
    const { user } = storeProfile()
    const { clearToken } = storeAuth()
    const navigate = useNavigate()
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false)
    const [mostrarMenu, setMostrarMenu] = useState(false)

    const handleLogout = () => {
        clearToken()
        navigate('/')
    }

    // Genera iniciales del usuario para el avatar de respaldo
    const iniciales = user
        ? `${user.nombre?.[0] ?? ""}${user.apellido?.[0] ?? ""}`.toUpperCase()
        : "?"

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950">

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-3
                                   flex items-center justify-between">

                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        Dashboard
                    </h1>

                    <div className="flex items-center gap-4">

                        {/* Ir a Home — el usuario ya está logueado, el catálogo lo detecta automáticamente */}
                        <Link
                            to="/"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-colors"
                        >
                            <MdHome className="text-base" />
                            Ir a Inicio
                        </Link>

                        {/* Notificaciones — en 0 hasta implementar modelo Notificacion */}
                        <div className="relative">
                            <button
                                onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                                className="relative text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
                            >
                                🔔
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white
                                                 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    0
                                </span>
                            </button>

                            {mostrarNotificaciones && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800
                                               shadow-lg rounded-lg p-3 z-50 text-sm text-gray-700 dark:text-white">
                                    <p className="text-gray-400 text-center py-2">
                                        Sin notificaciones nuevas
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Avatar + nombre + menú desplegable */}
                        <div className="relative">
                            <button
                                onClick={() => setMostrarMenu(!mostrarMenu)}
                                className="flex items-center gap-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition-colors"
                            >
                                {/* Avatar: foto si existe, iniciales si no */}
                                {user?.imagen ? (
                                    <img
                                        src={user.imagen}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/50"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-500/50">
                                        {iniciales}
                                    </div>
                                )}

                                {/* Nombre y rol */}
                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">
                                        {user?.nombre} {user?.apellido}
                                    </p>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                        {user?.rol}
                                    </p>
                                </div>

                                {/* Chevron */}
                                <span className="text-gray-400 text-xs hidden md:block">▾</span>
                            </button>

                            {/* Menú desplegable */}
                            {mostrarMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50">

                                    {/* Info del usuario */}
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">
                                            {user?.nombre} {user?.apellido}
                                        </p>
                                        <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                                    </div>

                                    {/* Perfil — solo visible para Usuario, no Admin */}
                                    {user?.rol === 'Usuario' && (
                                        <Link
                                            to="/dashboard/profile"
                                            onClick={() => setMostrarMenu(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            👤 Mi Perfil
                                        </Link>
                                    )}

                                    {/* Cerrar sesión */}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <MdLogout size={14} /> Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

                <footer className="bg-gray-800 py-3 text-center text-gray-400 text-sm">
                    © 2025 Poli Rent - Todos los derechos reservados
                </footer>

            </div>
        </div>
    )
}

export default Dashboard