import { Link, useLocation } from 'react-router'
import { 
    MdDashboard, 
    MdInventory,      
    MdAddBox,      
    MdPerson, 
    MdLogout,
    MdCalendarToday,
    MdReceipt
} from 'react-icons/md'
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

    return (
        <aside className="w-56 bg-gray-900 flex flex-col justify-between h-screen sticky top-0 border-r border-gray-800">

            {/* Parte superior - Logo y navegación */}
            <div>
                {/* Logo EPN */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
                    <img src={logo} alt="EPN" className="w-10 h-10 object-contain" />
                    <div>
                        <p className="text-white font-bold text-sm tracking-wide">EPN ToolRental</p>
                        <p className="text-gray-400 text-xs font-medium">ESFOT - EPN</p>
                    </div>
                </div>

                {/* Navegación condicional por rol */}
                <nav className="mt-5 px-3">
                    {user?.rol === 'Admin' ? (
                        <>
                            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider px-3 mb-3">
                                Módulos Admin
                            </p>
                            <ul className="space-y-1">
                                {[
                                    { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard className="h-5 w-5" /> },
                                    { to: '/dashboard/list', label: 'Inventario General', icon: <MdInventory className="h-5 w-5" /> },
                                    { to: '/dashboard/registrar-producto', label: 'Registrar Producto', icon: <MdAddBox className="h-5 w-5" /> },
                                    { to: '/dashboard/reservas', label: 'Aprobar Reservas', icon: <MdCalendarToday className="h-5 w-5" /> },
                                    { to: '/dashboard/ordenes', label: 'Órdenes de Compra', icon: <MdReceipt className="h-5 w-5" /> },
                                    { to: '/dashboard/usuarios', label: 'Usuarios', icon: <MdPerson className="h-5 w-5" /> },
                                ].map(link => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                                                ${isActive(link.to)
                                                    ? 'bg-purple-700 text-white font-semibold shadow-md shadow-purple-900/30'
                                                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                                                }`}
                                        >
                                            <span className={`${isActive(link.to) ? 'text-white' : 'text-gray-400'}`}>
                                                {link.icon}
                                            </span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider px-3 mb-3">
                                Mi espacio
                            </p>
                            <ul className="space-y-1">
                                {[
                                    { to: '/dashboard/mis-reservas', label: 'Mis Reservas', icon: <MdCalendarToday className="h-5 w-5" /> },
                                    { to: '/dashboard/mis-pagos', label: 'Mis Pagos', icon: <MdReceipt className="h-5 w-5" /> },
                                    { to: '/dashboard/profile', label: 'Mi Perfil', icon: <MdPerson className="h-5 w-5" /> },
                                ].map(link => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                                                ${isActive(link.to)
                                                    ? 'bg-purple-700 text-white font-semibold shadow-md shadow-purple-900/30'
                                                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                                                }`}
                                        >
                                            <span className={`${isActive(link.to) ? 'text-white' : 'text-gray-400'}`}>
                                                {link.icon}
                                            </span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </nav>
            </div>

            {/* Parte Inferior: Dark mode + Información del Usuario */}
            <div className="px-4 pb-4 border-t border-gray-800 pt-4 space-y-4 bg-gray-950/40">

                {/* Toggle dark mode */}
                <div className="flex items-center justify-between px-2">
                    <span className="text-gray-400 text-xs font-medium">Modo Oscuro</span>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-0.5
                            ${isDarkMode ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                        <span className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm
                            ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                {/* Info usuario y botón de salida */}
                <div className="flex items-center justify-between border-t border-gray-800/60 pt-3 px-1">
                    <div className="flex items-center gap-2.5 max-w-[140px]">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                            alt="avatar"
                            className="w-8 h-8 rounded-full border-2 border-purple-500/80 object-cover"
                        />
                        <div className="truncate">
                            <p className="text-white text-xs font-semibold truncate">
                                {user?.nombre} - {user?.rol}
                            </p>
                            <p className="text-gray-500 text-[10px] truncate">{user?.facultad}</p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        onClick={() => clearToken()}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                        title="Cerrar sesión"
                    >
                        <MdLogout className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </aside>
    )
}