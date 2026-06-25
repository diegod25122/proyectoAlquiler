import { Link, useLocation } from 'react-router'
import { MdDashboard, MdCategory, MdPerson, MdBarChart, MdSupport, MdShoppingCart, MdLogout } from 'react-icons/md'
import useDarkMode from '../../hooks/useDarkMode'
import storeAuth from '../../context/storeAuth'
import storeProfile from '../../context/storeProfile'
import logo from '../../assets/selloEPN.png'

export const Sidebar = () => {
    const location = useLocation()
    const urlActual = location.pathname
    const { isDarkMode, setIsDarkMode } = useDarkMode()
    const { clearToken } = storeAuth()
    const { user } = storeProfile()

    const isActive = (path) => urlActual === path

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { to: '/dashboard/list', label: 'Mis Alquileres', icon: '🛒' },
        { to: '/dashboard/profile', label: 'Perfil', icon: '👤' },

    ]

    return (
        <aside className="w-56 bg-gray-900 flex flex-col justify-between h-screen sticky top-0">

            {/* Parte superior - Logo y navegación */}
            <div>
                {/* Logo */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700">
                    <img src={logo} alt="EPN" className="w-10 h-10" />
                    <div>
                        <p className="text-white font-bold text-sm">EPN ToolRental</p>
                        <p className="text-gray-400 text-xs">Escuela Politécnica Nacional</p>
                    </div>
                </div>

                {/* Navegación */}
                <nav className="mt-4 px-3">
                    <p className="text-gray-500 text-xs uppercase px-3 mb-2">Navegación</p>
                    <ul className="space-y-1">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                                        ${isActive(link.to)
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <span>{link.icon}</span>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Dark mode + usuario */}
            <div className="px-4 pb-4 border-t border-gray-700 pt-4 space-y-4">

                {/* Toggle dark mode */}
                <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Dark modo</span>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                      
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1
            ${isDarkMode ? 'bg-blue-600' : 'bg-gray-600'}`}
                    >
                       
                        <span className={`w-4 h-4 bg-white rounded-full transition-transform
            ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                </div>


                {/* Info usuario */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                            alt="avatar"
                            className="w-8 h-8 rounded-full border-2 border-green-500"
                        />
                        <div>
                            <p className="text-white text-xs font-semibold">{user?.nombre}</p>
                            <p className="text-gray-400 text-xs">{user?.facultad}</p>
                        </div>
                    </div>
                    <Link
                        to="/"
                        onClick={() => clearToken()}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Cerrar sesión"
                    >
                        <button>Salir</button>
                    </Link>
                </div>

            </div>
        </aside>
    )
}