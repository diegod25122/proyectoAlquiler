import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdShoppingCart, MdLogout, MdPerson } from 'react-icons/md'
import sello from '../assets/selloEPN.png'
import useDarkMode from '../hooks/useDarkMode'
import storeCarrito from '../context/storeCarrito'

export const Navbar = () => {
    const { isDarkMode, setIsDarkMode } = useDarkMode()
    const { reservas, compras, quitarReserva, quitarCompra, totalItems } = storeCarrito()
    const [carritoAbierto, setCarritoAbierto] = useState(false)
    const carritoRef = useRef(null)
    const navigate = useNavigate()

    // ⚠️ Asumo la misma forma de localStorage que usas en getAuthHeaders()
    // de storeProfile (JSON con state.token). Si tu storeAuth guarda el rol
    // en otro campo, ajusta esta lectura.
    const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
    const estaLogueado = Boolean(sesion?.state?.token)
    const esAdmin = sesion?.state?.rol === "Admin"

    // Cerrar el dropdown si se hace clic afuera
    useEffect(() => {
        const cerrarSiAfuera = (e) => {
            if (carritoRef.current && !carritoRef.current.contains(e.target)) {
                setCarritoAbierto(false)
            }
        }
        document.addEventListener("mousedown", cerrarSiAfuera)
        return () => document.removeEventListener("mousedown", cerrarSiAfuera)
    }, [])

    const cerrarSesion = () => {
        localStorage.removeItem("auth-token")
        navigate("/login")
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-gray-950/90
                        shadow-sm transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center px-4 py-3">

                {/* Logo institucional */}
                <Link to="/" className="flex items-center gap-3">
                    <img src={sello} alt="Sello EPN" className="w-10" />
                    <span className="font-display text-lg font-bold text-[#0F2A4A] dark:text-white tracking-tight">
                        EPN ToolRental
                    </span>
                </Link>

                <div className="flex items-center gap-5">
                    {/* Links principales */}
                    <ul className="hidden md:flex gap-6">
                        <li><Link to="/" className="font-medium text-gray-700 dark:text-gray-200 hover:text-[#1E4D8C]">Inicio</Link></li>
                        {esAdmin && (
                            <li><Link to="/dashboard" className="font-medium text-gray-700 dark:text-gray-200 hover:text-[#1E4D8C]">Dashboard</Link></li>
                        )}
                    </ul>

                    {/* Carrito Híbrido */}
                    <div className="relative" ref={carritoRef}>
                        <button
                            onClick={() => setCarritoAbierto((prev) => !prev)}
                            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Carrito"
                        >
                            <MdShoppingCart className="text-2xl text-[#0F2A4A] dark:text-white" />
                            {totalItems() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px]
                                                 font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems()}
                                </span>
                            )}
                        </button>

                        {carritoAbierto && (
                            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-xl
                                            shadow-xl border border-gray-100 dark:border-gray-800 p-4 z-50">

                                {/* Sección: Herramientas a Reservar */}
                                <h3 className="text-xs font-mono uppercase tracking-wide text-[#6B46C1] mb-2">
                                    Herramientas a Reservar (Préstamo)
                                </h3>
                                {reservas.length === 0 ? (
                                    <p className="text-sm text-gray-400 mb-3">Sin herramientas en espera de reserva</p>
                                ) : (
                                    <ul className="mb-3 space-y-2">
                                        {reservas.map((r) => (
                                            <li key={r.productoId} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-700 dark:text-gray-200 truncate">{r.nombre}</span>
                                                <button onClick={() => quitarReserva(r.productoId)} className="text-red-500 text-xs hover:underline">
                                                    Quitar
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="border-t border-gray-100 dark:border-gray-800 my-3" />

                                {/* Sección: Componentes a Pagar */}
                                <h3 className="text-xs font-mono uppercase tracking-wide text-[#15803D] mb-2">
                                    Componentes a Pagar (Compra)
                                </h3>
                                {compras.length === 0 ? (
                                    <p className="text-sm text-gray-400 mb-3">Carrito de compra vacío</p>
                                ) : (
                                    <ul className="mb-3 space-y-2">
                                        {compras.map((c) => (
                                            <li key={c.productoId} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-700 dark:text-gray-200 truncate">
                                                    {c.cantidad}x {c.nombre}
                                                </span>
                                                <button onClick={() => quitarCompra(c.productoId)} className="text-red-500 text-xs hover:underline">
                                                    Quitar
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {(reservas.length > 0 || compras.length > 0) && (
                                    <button
                                        onClick={() => { setCarritoAbierto(false); navigate("/carrito") }}
                                        className="w-full mt-1 py-2 bg-[#0F2A4A] text-white rounded-lg text-sm font-semibold hover:bg-[#1E4D8C] transition-colors"
                                    >
                                        Ir a confirmar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sesión */}
                    {estaLogueado ? (
                        <button onClick={cerrarSesion} className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600">
                            <MdLogout /> <span className="hidden md:inline">Salir</span>
                        </button>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#1E4D8C]">
                            <MdPerson /> <span className="hidden md:inline">Login</span>
                        </Link>
                    )}

                    {/* Dark mode */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        </nav>
    )
}