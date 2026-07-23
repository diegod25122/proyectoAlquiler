import { useEffect, useState } from "react";
import axios from "axios";
import { 
    MdReceipt, 
    MdCreditCard, 
    MdAttachMoney, 
    MdFileDownload, 
    MdCheckCircle, 
    MdHourglassEmpty,
    MdCancel,
    MdShoppingCart
} from "react-icons/md";
import storeAuth from "../context/storeAuth";

const estadoBadges = {
    Pagado: { label: "Pagado", cls: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300", icon: MdCheckCircle },
    COMPLETADO: { label: "Completado", cls: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300", icon: MdCheckCircle },
    Pendiente: { label: "Pendiente", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300", icon: MdHourglassEmpty },
    PENDIENTE: { label: "Pendiente", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300", icon: MdHourglassEmpty },
    CANCELADO: { label: "Cancelado", cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300", icon: MdCancel }
};

export const MisPagos = () => {
    const { token } = storeAuth();
    const [pagos, setPagos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerMisPagos = async () => {
            try {
                // Token seguro desde Zustand o LocalStorage
                const sesionStorage = JSON.parse(localStorage.getItem("auth-token") || "null");
                const jwtToken = token || sesionStorage?.state?.token || sesionStorage;

                const config = { headers: { Authorization: `Bearer ${jwtToken}` } };
                
                // Intenta cargar transacciones (compras/ordenes) o historial de prestamos
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/ordenes/mis-compras`, 
                    config
                ).catch(async () => {
                    // Fallback a préstamos/pagos si la ruta principal es distinta
                    return await axios.get(`${import.meta.env.VITE_BACKEND_URL}/prestamo/mis-pagos`, config);
                });

                setPagos(data || []);
            } catch (error) {
                console.error("Error al cargar pagos desde la API:", error);
                setPagos([]);
            } finally {
                setCargando(false);
            }
        };

        obtenerMisPagos();
    }, [token]);

    const formatearFecha = (str) => {
        if (!str) return "N/A";
        return new Date(str).toLocaleDateString('es-EC', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <MdReceipt className="text-purple-600" /> Mis Pagos y Transacciones
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Historial en tiempo real de transacciones de compra y préstamos en Poli Rent.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-3 py-2 rounded-lg text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    <MdCreditCard className="text-lg" />
                    Pasarela Stripe / Efectivo Taller
                </div>
            </div>

            {/* Contenido / Listado */}
            {cargando ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">
                    Cargando tus comprobantes de pago...
                </div>
            ) : pagos.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No has registrado transacciones ni pagos cobrados aún.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pagos.map((pago) => {
                        const estadoKey = pago.estadoPago || pago.estado || "Pendiente";
                        const BadgeInfo = estadoBadges[estadoKey] || { 
                            label: estadoKey, 
                            cls: "bg-gray-100 text-gray-700 border-gray-300", 
                            icon: MdHourglassEmpty 
                        };
                        const Icon = BadgeInfo.icon;
                        const producto = pago.herramienta || pago.producto || (pago.items && pago.items[0]?.producto);

                        return (
                            <div 
                                key={pago._id} 
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                {/* Header del ítem */}
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-100 dark:border-purple-900">
                                            {producto?.imagen ? (
                                                <img 
                                                    src={producto.imagen} 
                                                    alt="" 
                                                    className="w-10 h-10 object-cover rounded" 
                                                />
                                            ) : (
                                                <MdShoppingCart className="text-purple-600 text-2xl" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-mono text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                                                {pago.codigoTransaccion || `#${pago._id.slice(-8).toUpperCase()}`}
                                            </span>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                                                {producto?.nombre || pago.concepto || "Compra de Materiales / Reserva"}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Fecha: {formatearFecha(pago.createdAt || pago.fecha)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${BadgeInfo.cls}`}>
                                        <Icon className="text-sm" />
                                        {BadgeInfo.label}
                                    </span>
                                </div>

                                {/* Método de Pago & Detalles */}
                                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800/80 flex justify-between items-center">
                                    <span>
                                        <strong>Método:</strong> {pago.metodoPago || (pago.stripePaymentIntentId ? "Tarjeta (Stripe)" : "Efectivo")}
                                    </span>
                                    {pago.materia && (
                                        <span><strong>Materia:</strong> {pago.materia}</span>
                                    )}
                                </div>

                                {/* Pie: Monto y Recibo */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                            Monto Total
                                        </span>
                                        <p className="text-lg font-black text-gray-900 dark:text-white flex items-center">
                                            <MdAttachMoney className="text-green-600 -mr-1" />
                                            {Number(pago.monto || pago.total || pago.precio || 0).toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:text-purple-400 px-3 py-1.5 rounded-lg transition-colors bg-purple-50/50 dark:bg-transparent"
                                    >
                                        <MdFileDownload className="text-sm" /> Imprimir Comprobante
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MisPagos;