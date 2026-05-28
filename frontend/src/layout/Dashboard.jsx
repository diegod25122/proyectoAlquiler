import { Outlet, useLocation } from 'react-router'
import { Sidebar } from '../components/dashboard/Sidebar'
import storeProfile from '../context/storeProfile'

const Dashboard = () => {
    const { user } = storeProfile()
    const location = useLocation()

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950">

            {/* Sidebar */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header superior */}
                <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-3 
                                   flex items-center justify-between">

                    {/* Título página actual */}
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        Dashboard
                    </h1>

                    {/*búsqueda, notificaciones, avatar */}
                    <div className="flex items-center gap-4">

                        {/* Búsqueda */}
                        <div className="relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white
                                           rounded-lg px-4 py-2 pl-9 text-sm focus:outline-none w-64"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                        </div>

                        {/* Notificaciones */}
                        <button className="relative text-gray-500 hover:text-gray-700">
                            🔔
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                                             text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                1
                            </span>
                        </button>

                        {/* Avatar */}
                        <div className="flex items-center gap-2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                                alt="avatar"
                                className="w-9 h-9 rounded-full border-2 border-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-white hidden md:block">
                                Hola, {user?.nombre}
                            </span>
                        </div>

                    </div>
                </header>

                {/* Contenido páginas */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 py-3 text-center text-gray-400 text-sm">
                    © 2025 Poli Rent - Todos los derechos reservados
                </footer>

            </div>
        </div>
    )
}

export default Dashboard