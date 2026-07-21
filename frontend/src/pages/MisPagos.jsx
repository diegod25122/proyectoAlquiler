import { useEffect, useState } from "react";
import axios from "axios";
import { MdReceipt, MdCreditCard, MdAttachMoney, MdFileDownload, MdCheckCircle, MdHourglassEmpty } from "react-icons/md";
import storeAuth from "../context/storeAuth";

export const MisPagos = () => {
    const { token } = storeAuth();
    const [pagos, setPagos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerMisPagos = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/prestamo/mis-pagos`, config);
                setPagos(data || []);
            } catch (error) {
                console.error("Error al cargar pagos desde la API:", error);
                setPagos([]);
            } finally {
                setCargando(false);
            }
        };
        if (token) obtenerMisPagos();
        else setCargando(false);
    }, [token]);

    const formatearFecha = (str) => {
        if (!str) return "N/A";
        return new Date(str).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' });
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
                        Historial en tiempo real de transacciones de préstamos y compras en la ESFOT.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-3 py-2 rounded-lg text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    <MdCreditCard className="text-lg" />
                    Pasarela de Pagos Stripe / Efectivo
                </div>
            </div>

            {/* Contenido / Listado */}
            {cargando ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">Cargando tus pagos desde la base de datos...</div>
            ) : pagos.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No has registrado transacciones ni préstamos cobrados aún.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pagos.map((pago) => {
                        const esPagado = pago.estadoPago === "Pagado";
                        return (
                            <div key={pago._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        {pago.herramienta?.imagen && (
                                            <img src={pago.herramienta.imagen} alt="" className="w-12 h-12 object-contain rounded border border-gray-100 dark:border-gray-800 p-1" />
                                        )}
                                        <div>
                                            <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
                                                {pago.herramienta?.codigoInventario || `#${pago._id.slice(-6)}`}
                                            </span>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-base mt-0.5">
                                                {pago.herramienta?.nombre || "Préstamo de Herramienta"}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Período: {formatearFecha(pago.fechaInicio)} — {formatearFecha(pago.fechaFin)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        esPagado 
                                            ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    }`}>
                                        {esPagado ? <MdCheckCircle className="text-sm" /> : <MdHourglassEmpty className="text-sm" />}
                                        {pago.estadoPago || "Pendiente"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase font-medium">Monto / Valor</span>
                                        <p className="text-lg font-black text-gray-900 dark:text-white flex items-center">
                                            <MdAttachMoney className="text-green-600 -mr-1" />
                                            {Number(pago.precio || 0).toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => alert(`Comprobante oficial de pago #${pago._id}`)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:text-purple-400 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <MdFileDownload className="text-sm" /> Recibo PDF
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
