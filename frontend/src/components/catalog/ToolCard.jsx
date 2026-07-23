import { MdCalendarToday, MdShoppingCart } from 'react-icons/md'
import storeCarrito from '../../context/storeCarrito'
import storeAuth from '../../context/storeAuth'
import { useNavigate } from 'react-router-dom'

export const ToolCard = ({ producto }) => {
    const { agregarReserva, agregarCompra } = storeCarrito()

    // ✅ Suscripción reactiva al store — no leemos localStorage directamente
    const { token } = storeAuth()
    const navigate = useNavigate()

    const sinStock = producto.stock === 0 || producto.estado === false
    const esPrestable = producto.tipo === 'Prestable'
    const estaLogueado = Boolean(token)

    const handleAccion = () => {
        if (sinStock) return

        // Guard: redirige al login si no hay sesión activa
        if (!estaLogueado) {
            navigate("/login")
            return
        }

        if (esPrestable) {
            agregarReserva({
                productoId: producto._id,
                nombre: producto.nombre,
                imagen: producto.imagen
            })
            navigate(`/reservar/${producto._id}`)
        } else {
            // ✅ Guard para compras también — antes no estaba cubierto
            agregarCompra({
                productoId: producto._id,
                nombre: producto.nombre,
                imagen: producto.imagen,
                precio: producto.precio
            })
        }
    }

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-900">

            <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 tracking-wide">
                    {producto.codigoInventario}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    sinStock
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                    {sinStock ? 'Agotado' : 'Disponible'}
                </span>
            </div>

            <div className="h-28 flex items-center justify-center mb-3">
                <img
                    src={producto.imagen || 'https://cdn-icons-png.flaticon.com/512/2618/2618671.png'}
                    alt={producto.nombre}
                    className="h-full w-full object-contain"
                />
            </div>

            <h3 className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{producto.nombre}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-3">
                {producto.categoria}
                {!esPrestable && producto.precio != null && (
                    <span className="ml-2 font-semibold text-gray-700 dark:text-gray-300">
                        ${producto.precio.toFixed(2)}
                    </span>
                )}
            </p>

            <div className="flex-1" />

            <button
                onClick={handleAccion}
                disabled={sinStock}
                className={`mt-2 w-full py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    sinStock
                        ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                        : esPrestable
                            ? 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            : 'border border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100'
                }`}
            >
                {sinStock ? 'Sin stock' : esPrestable
                    ? <><MdCalendarToday size={12} /> Reservar</>
                    : <><MdShoppingCart size={12} /> Añadir</>
                }
            </button>
        </div>
    )
}