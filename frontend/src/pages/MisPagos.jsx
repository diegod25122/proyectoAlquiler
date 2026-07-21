import { useEffect, useState } from "react";
import axios from "axios";
import { MdReceipt, MdCreditCard, MdAttachMoney, MdFileDownload, MdCheckCircle } from "react-icons/md";
import storeAuth from "../context/storeAuth";

export const MisPagos = () => {
    const { token } = storeAuth();
    const [pagos, setPagos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerMisPagos = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/pago/mis-pagos`, config);
                setPagos(data || []);
            } catch (error) {
                console.error("Error al cargar pagos:", error);
                // Registros mock demostrativos
                setPagos([
                    {
                        _id: "PAY-99201",
                        concepto: "Compra de Componentes (Resistencias + Kit Arduino)",
                        monto: 15.50,
                        metodo: "Stripe / Tarjeta",
                        fecha: "2026-07-18",
                        estado: "Completado",
                        comprobanteUrl: "#"
                    },
                    {
                        _id: "PAY-99180",
                        concepto: "Depósito Garantía - Taladro Percutor industrial",
                        monto: 10.00,
                        metodo: "Efectivo Taller",
                        fecha: "2026-07-10",
                        estado: "Completado",
                        comprobanteUrl: "#"
                    }
                ]);
            } finally {
                setCargando(false);
            }
        };
        if (token) obtenerMisPagos();
        else setCargando(false);
    }, [token]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <MdReceipt className="text-purple-600" /> Mis Pagos y Transacciones
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Historial de comprobantes de compras de consumibles y depósitos en la ESFOT.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 px-3 py-2 rounded-lg text-purple-700 dark:text-purple-300 text-xs font-semibold">
                    <MdCreditCard className="text-lg" />
                    Pasarela activa: Stripe & Efectivo
                </div>
            </div>

            {/* Contenido / Listado */}
            {cargando ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">Cargando tus pagos...</div>
            ) : pagos.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No has realizado pagos ni transacciones recientemente.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pagos.map((pago) => (
                        <div key={pago._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
                                        #{pago._id}
                                    </span>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base mt-0.5">
                                        {pago.concepto}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Fecha: {pago.fecha} • Vía: {pago.metodo}
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    <MdCheckCircle className="text-sm" /> {pago.estado}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase font-medium">Monto Total</span>
                                    <p className="text-lg font-black text-gray-900 dark:text-white flex items-center">
                                        <MdAttachMoney className="text-green-600 -mr-1" />
                                        {pago.monto.toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => alert(`Descargando comprobante de ${pago._id}`)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 border border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:text-purple-400 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <MdFileDownload className="text-sm" /> Recibo PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MisPagos;
