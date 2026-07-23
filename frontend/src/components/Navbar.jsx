import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdShoppingCart, MdLogout, MdPerson } from 'react-icons/md'
import sello from '../assets/selloEPN.png'
import useDarkMode from '../hooks/useDarkMode'
import storeCarrito from '../context/storeCarrito'
import storeAuth from '../context/storeAuth'
import storeProfile from '../context/storeProfile'

export const Navbar = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode()
    const { reservas, compras, quitarReserva, quitarCompra, totalItems } = storeCarrito()

    // ✅ Suscripción reactiva — cuando token/rol cambian en storeAuth,
    // Zustand re-renderiza el Navbar automáticamente sin leer localStorage
    const { token, rol, clearToken } = storeAuth()
    const { user, profile } = storeProfile()

    const [carritoAbierto, setCarritoAbierto] = useState(false)
    const [menuAbierto, setMenuAbierto] = useState(false)
    const carritoRef = useRef(null)
    const menuRef = useRef(null)
    const navigate = useNavigate()

    const estaLogueado = Boolean(token)
    const esAdmin = rol === "Admin"
    const iniciales = user
        ? `${user.nombre?.[0] ?? ""}${user.apellido?.[0] ?? ""}`.toUpperCase()
        : ""

    // Si hay token pero el store perdió el user (ej: recarga de página),
    // volvemos a pedir el perfil al backend
    useEffect(() => {
        if (token && !user) profile()
    }, [token])

    // Cerrar dropdowns al hacer clic afuera
    useEffect(() => {
        const cerrar = (e) => {
            if (carritoRef.current && !carritoRef.current.contains(e.target))
                setCarritoAbierto(false)
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuAbierto(false)
        }
        document.addEventListener("mousedown", cerrar)
        return () => document.removeEventListener("mousedown", cerrar)
    }, [])

    const handleLogout = () => {
        clearToken()
        setMenuAbierto(false)
        navigate("/")
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-950/90 shadow-sm transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center px-4 py-3">

                <Link to="/" className="flex items-center gap-3">
                    <img src={sello} alt="Sello EPN" className="w-10" />
                    <span className="font-bold text-lg text-[#0F2A4A] dark:text-white tracking-tight">PoliRent</span>
                </Link>

                <div className="flex items-center gap-4">
                    <ul className="hidden md:flex gap-6">
                        <li><Link to="/" className="font-medium text-gray-700 dark:text-gray-200 hover:text-[#1E4D8C] text-sm">Inicio</Link></li>
                        {esAdmin && (
                            <li><Link to="/dashboard" className="font-medium text-gray-700 dark:text-gray-200 hover:text-[#1E4D8C] text-sm">Dashboard</Link></li>
                        )}
                    </ul>

                    {/* Carrito */}
                    <div className="relative" ref={carritoRef}>
                        <button onClick={() => setCarritoAbierto(p => !p)} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <MdShoppingCart className="text-2xl text-[#0F2A4A] dark:text-white" />
                            {totalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems()}
                                </span>
                            )}
                        </button>

                        {carritoAbierto && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 z-50">
                                <h3 className="text-xs font-mono uppercase tracking-wide text-[#6B46C1] mb-2">Herramientas a Reservar</h3>
                                {reservas.length === 0
                                    ? <p className="text-sm text-gray-400 mb-3">Sin herramientas en reserva</p>
                                    : <ul className="mb-3 space-y-2">{reservas.map(r => (
                                        <li key={r.productoId} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700 dark:text-gray-200 truncate">{r.nombre}</span>
                                            <button onClick={() => quitarReserva(r.productoId)} className="text-red-500 text-xs hover:underline ml-2">Quitar</button>
                                        </li>
                                    ))}</ul>
                                }
                                <div className="border-t border-gray-100 dark:border-gray-800 my-3" />
                                <h3 className="text-xs font-mono uppercase tracking-wide text-[#15803D] mb-2">Consumibles a Pagar</h3>
                                {compras.length === 0
                                    ? <p className="text-sm text-gray-400 mb-3">Carrito vacío</p>
                                    : <ul className="mb-3 space-y-2">{compras.map(c => (
                                        <li key={c.productoId} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700 dark:text-gray-200 truncate">{c.cantidad}x {c.nombre}</span>
                                            <button onClick={() => quitarCompra(c.productoId)} className="text-red-500 text-xs hover:underline ml-2">Quitar</button>
                                        </li>
                                    ))}</ul>
                                }
                                {(reservas.length > 0 || compras.length > 0) && (
                                    <button onClick={() => { setCarritoAbierto(false); navigate("/carrito") }}
                                        className="w-full mt-1 py-2 bg-[#0F2A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#1E4D8C] transition-colors">
                                        Ir a confirmar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Avatar o Login */}
                    {estaLogueado ? (
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setMenuAbierto(p => !p)}
                                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition-colors">
                                {user?.imagen ? (
                                    <img src={user.imagen} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#6B46C1]/50" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-[#6B46C1]/50">
                                        {iniciales}
                                    </div>
                                )}
                                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">{user?.nombre}</span>
                                <span className="text-gray-400 text-xs">▾</span>
                            </button>

                            {menuAbierto && (
                                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{user?.nombre} {user?.apellido}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1 inline-block ${esAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {rol}
                                        </span>
                                    </div>

                                    {esAdmin && (
                                        <Link to="/dashboard" onClick={() => setMenuAbierto(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            📊 Dashboard Admin
                                        </Link>
                                    )}
                                    {!esAdmin && (<>
                                        <Link to="/dashboard/mis-reservas" onClick={() => setMenuAbierto(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            📅 Mis Reservas
                                        </Link>
                                        <Link to="/dashboard/mis-pagos" onClick={() => setMenuAbierto(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            🧾 Mis Pagos
                                        </Link>
                                        <Link to="/dashboard/profile" onClick={() => setMenuAbierto(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            👤 Mi Perfil
                                        </Link>
                                    </>)}

                                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1" />
                                    <button onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <MdLogout size={13} /> Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#1E4D8C]">
                            <MdPerson size={18} /> Login
                        </Link>
                    )}

                    <button onClick={() => setIsDarkMode(!isDarkMode)}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        </nav>
    )
}