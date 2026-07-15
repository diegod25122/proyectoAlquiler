import { useEffect, useRef } from 'react'
import { FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi'
import { MdCalendarToday, MdShoppingCart } from 'react-icons/md'
import storeProducto from '../../context/storeProducto'
import storeCarrito from '../../context/storeCarrito'
import { useNavigate } from 'react-router-dom'

const getStatus = (p) => {
    if (p.stock === 0 || p.estado === false)
        return { label: 'Agotado', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-400' }
    if (p.stock <= 2)
        return { label: 'Pocas unidades', cls: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' }
    return { label: 'Disponible', cls: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' }
}

const CarouselCard = ({ producto }) => {
    const { agregarReserva, agregarCompra } = storeCarrito()
    const navigate = useNavigate()

    const sinStock = producto.stock === 0 || producto.estado === false
    const esPrestable = producto.tipo === 'Prestable'
    const status = getStatus(producto)

    const handleAccion = () => {
        if (sinStock) return
        const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
        if (!sesion?.state?.token) { navigate("/login"); return }

        if (esPrestable) {
            agregarReserva({ productoId: producto._id, nombre: producto.nombre, imagen: producto.imagen })
            navigate(`/reservar/${producto._id}`)
        } else {
            agregarCompra({ productoId: producto._id, nombre: producto.nombre, imagen: producto.imagen, precio: producto.precio })
        }
    }

    return (
        <div className="min-w-[210px] max-w-[210px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col shrink-0 hover:border-[#1E5FD9]/40 dark:hover:border-[#1E5FD9]/40 hover:shadow-md transition-all">
            {/* Header: código + badge */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[90px]">
                    {producto.codigoInventario}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${status.cls}`}>
                    {status.label}
                </span>
            </div>

            {/* Imagen */}
            <div className="h-28 flex items-center justify-center mb-3">
                <img
                    src={producto.imagen || 'https://cdn-icons-png.flaticon.com/512/2618/2618671.png'}
                    alt={producto.nombre}
                    className="h-full w-full object-contain"
                />
            </div>

            {/* Info */}
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                {producto.nombre}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{producto.categoria}</p>

            {!esPrestable && producto.precio != null && (
                <p className="text-sm font-bold text-[#1E5FD9] mt-1">${producto.precio.toFixed(2)}</p>
            )}

            <div className="flex-1" />

            {/* Botón */}
            <button
                onClick={handleAccion}
                disabled={sinStock}
                className={`mt-3 w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    sinStock
                        ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                        : esPrestable
                            ? 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100'
                }`}
            >
                {sinStock ? 'Sin stock'
                    : esPrestable ? <><MdCalendarToday size={12} /> Reservar</>
                    : <><MdShoppingCart size={12} /> Añadir</>
                }
            </button>
        </div>
    )
}

export const Catalog = () => {
    const { productos, listarProductos } = storeProducto()
    const scrollRef = useRef(null)

    useEffect(() => { listarProductos() }, [])

    const scroll = (dir) => {
        scrollRef.current?.scrollBy({ left: dir * 460, behavior: 'smooth' })
    }

    return (
        <section id="catalogo" className="max-w-7xl mx-auto px-8 md:px-14 pb-16">
            {/* Header del carrusel */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1E5FD9]/10 flex items-center justify-center">
                        <FiShoppingBag className="text-[#1E5FD9]" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Catálogo destacado</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Explora herramientas y componentes del taller
                        </p>
                    </div>
                </div>

                {/* Flechas */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll(-1)}
                        aria-label="Anterior"
                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
                    >
                        <FiChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        aria-label="Siguiente"
                        className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
                    >
                        <FiChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Carrusel */}
            {productos.length === 0 ? (
                <div className="flex gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="min-w-[210px] h-60 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-3"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {productos.map(producto => (
                        <CarouselCard key={producto._id} producto={producto} />
                    ))}
                </div>
            )}
        </section>
    )
}
