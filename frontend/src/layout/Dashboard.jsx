import { Outlet, useLocation, useNavigate } from 'react-router'
import { useState } from 'react'
import { Sidebar } from '../components/dashboard/Sidebar'
import storeProfile from '../context/storeProfile'
import storeAuth from '../context/storeAuth'
import RegistrarHerramienta from '../components/create/RegistrarProducto'

const Dashboard = () => {
    const { user } = storeProfile()
    const { clearToken } = storeAuth()
    const navigate = useNavigate()
    const [busqueda, setBusqueda] = useState('')
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false)

    const handleLogout = () => {
        clearToken()
        navigate('/')
    }

    const handleBuscar = (e) => {
        e.preventDefault()
        // Aquí puedes filtrar tus alquileres o navegar a una vista de resultados
        console.log('Buscando:', busqueda)
    }

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

                        {/* Notificaciones funcionales */}
                        <div className="relative">
                            <button
                                onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
                                className="relative text-gray-500 hover:text-gray-700"
                            >
                                🔔
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                                                 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    1
                                </span>
                            </button>

                            {mostrarNotificaciones && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 
                                               shadow-lg rounded-lg p-3 z-50 text-sm text-gray-700 dark:text-white">
                                    <p>No tienes notificaciones nuevas.</p>
                                </div>
                            )}
                        </div>

                        {/* Avatar, nombre y logout */}
            

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