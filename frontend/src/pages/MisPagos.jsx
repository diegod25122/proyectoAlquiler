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
    Entregado: { label: "Entregado", cls: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300", icon: MdCheckCircle },
    Pendiente: { label: "Pendiente", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300", icon: MdHourglassEmpty },
    Cancelada: { label: "Cancelada", cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300", icon: MdCancel },
    Expirada: { label: "Expirada", cls: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300", icon: MdCancel }
};

export const MisPagos = () => {
    const { token } = storeAuth();
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerMisOrdenes = async () => {
            try {
                // Extracción segura del JWT
                const sesionStorage = JSON.parse(localStorage.getItem("auth-token") || "null");
                const jwtToken = token || sesionStorage?.state?.token || sesionStorage;

                const config = { headers: { Authorization: `Bearer ${jwtToken}` } };
                
                // Endpoint exacto que ejecuta 'listarMisOrdenes'
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/ordenes/mis-ordenes`, 
                    config
                );

                setOrdenes(data || []);
            } catch (error) {
                console.error("Error al cargar órdenes desde la API:", error);
                setOrdenes([]);
            } finally {
                setCargando(false);
            }
        };

        obtenerMisOrdenes();
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
                        <MdReceipt className="text-purple-600" /> Mis Pagos y Compras
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Historial de transacciones y compras procesadas con Stripe.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-3 py-2 rounded-lg text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    <MdCreditCard className="text-lg" />
                    Pagos Prototipo Stripe USD
                </div>
            </div>

            {/* Listado */}
            {cargando ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">
                    Cargando comprobantes...
                </div>
            ) : ordenes.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No tienes transacciones registradas.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {ordenes.map((orden) => {
                        const BadgeInfo = estadoBadges[orden.estado] || { 
                            label: orden.estado, 
                            cls: "bg-gray-100 text-gray-700 border-gray-300", 
                            icon: MdHourglassEmpty 
                        };
                        const Icon = BadgeInfo.icon;

                        return (
                            <div 
                                key={orden._id} 
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                {/* Header del Pago */}
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <span className="font-mono text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                                            #{orden._id.slice(-8).toUpperCase()}
                                        </span>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                                            Orden de Compra
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Fecha: {formatearFecha(orden.createdAt)}
                                        </p>
                                    </div>

                                    {/* Badge Estado */}
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${BadgeInfo.cls}`}>
                                        <Icon className="text-sm" />
                                        {BadgeInfo.label}
                                    </span>
                                </div>

                                {/* Artículos Comprados */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                        Artículos ({orden.items?.length || 0})
                                    </p>
                                    <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
                                        {orden.items?.map((item, idx) => (
                                            <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex justify-between">
                                                <span>• {item.nombre} x{item.cantidad}</span>
                                                <span className="font-mono text-gray-500">${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Pie del Pago */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                            Monto Total
                                        </span>
                                        <p className="text-lg font-black text-gray-900 dark:text-white flex items-center">
                                            <MdAttachMoney className="text-green-600 -mr-1" />
                                            {Number(orden.total || 0).toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:text-purple-400 px-3 py-1.5 rounded-lg transition-colors bg-purple-50/50 dark:bg-transparent"
                                    >
                                        <MdFileDownload className="text-sm" /> Imprimir Recibo
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