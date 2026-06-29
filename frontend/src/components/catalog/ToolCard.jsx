import { MdCalendarToday, MdShoppingCart } from 'react-icons/md'
import storeCarrito from '../../context/storeCarrito'
import { useNavigate } from 'react-router-dom'

export const ToolCard = ({ producto }) => {
    const { agregarReserva, agregarCompra } = storeCarrito()
    const navigate = useNavigate()

    const sinStock = producto.stock === 0 || producto.estado === false
    const esPrestable = producto.tipo === 'Prestable'

    const requiereLogin = () => {
        const sesion = JSON.parse(localStorage.getItem("auth-token") || "null")
        return !sesion?.state?.token
    }

    const handleAccion = () => {
        if (sinStock) return

        if (requiereLogin()) {
            navigate("/login")
            return
        }

        if (esPrestable) {
            agregarReserva({ productoId: producto._id, nombre: producto.nombre, imagen: producto.imagen })
            navigate(`/reservar/${producto._id}`) // ahí va el formulario de Materia/Docente/Propósito/Horas
        } else {
            agregarCompra({ productoId: producto._id, nombre: producto.nombre, imagen: producto.imagen, precio: producto.precio })
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md
                        hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col">

            {/* Imagen + badge tipo "etiqueta de taller" (código de inventario en mono) */}
            <div className="relative">
                <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-40 object-contain mb-3"
                />
                <span className="absolute top-2 left-2 bg-gray-900/80 text-white font-mono
                                 text-[10px] px-2 py-1 rounded-md tracking-wide">
                    {producto.codigoInventario}
                </span>
            </div>

            {/* Info */}
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">{producto.nombre}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{producto.categoria}</p>

            {/* Disponibilidad real (stock/estado, no el mock "disponible" anterior) */}
            <span className={`inline-block mb-2 px-2 py-1 rounded-full text-xs font-semibold w-fit
                ${sinStock
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-green-100 text-green-700'}`}>
                {sinStock ? 'NO DISPONIBLE' : 'DISPONIBLE'}
            </span>

            {/* Precio (solo Consumibles) */}
            {!esPrestable && (
                <p className="text-green-700 dark:text-green-400 font-bold text-lg mb-2">
                    ${producto.precio?.toFixed(2)}
                </p>
            )}

            <div className="flex-1" />

            {/* Botón condicional */}
            <button
                onClick={handleAccion}
                disabled={sinStock}
                className={`mt-3 w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors
                    ${sinStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : esPrestable
                            ? 'bg-[#6B46C1] text-white hover:bg-[#5b3aa8]'
                            : 'bg-[#15803D] text-white hover:bg-[#12692f]'}`}
            >
                {sinStock ? (
                    'No Disponible'
                ) : esPrestable ? (
                    <><MdCalendarToday /> Reservar Herramienta</>
                ) : (
                    <><MdShoppingCart /> Añadir al Carrito</>
                )}
            </button>
        </div>
    )
}