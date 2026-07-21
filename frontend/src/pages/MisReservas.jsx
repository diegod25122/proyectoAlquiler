import { useEffect, useState } from "react";
import axios from "axios";
import { MdCalendarToday, MdInfo, MdCheckCircle, MdHourglassEmpty, MdCancel } from "react-icons/md";
import storeAuth from "../context/storeAuth";

const estadoBadges = {
    Aprobada: { label: "Aprobada", cls: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300", icon: MdCheckCircle },
    Pendiente: { label: "En Revisión", cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300", icon: MdHourglassEmpty },
    Rechazada: { label: "Rechazada", cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300", icon: MdCancel },
    Devuelta: { label: "Devuelto", cls: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300", icon: MdCheckCircle },
    Alquilada: { label: "En Préstamo", cls: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300", icon: MdHourglassEmpty }
};

export const MisReservas = () => {
    const { token } = storeAuth();
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState("Todas");

    useEffect(() => {
        const obtenerMisReservas = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reserva/mis-reservas`, config);
                setReservas(data || []);
            } catch (error) {
                console.error("Error al cargar reservas desde la API:", error);
                setReservas([]);
            } finally {
                setCargando(false);
            }
        };
        if (token) obtenerMisReservas();
        else setCargando(false);
    }, [token]);

    const reservasFiltradas = filtro === "Todas" 
        ? reservas 
        : reservas.filter(r => r.estado === filtro);

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
                        <MdCalendarToday className="text-purple-600" /> Mis Reservas de Herramientas
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Historial en tiempo real de tus solicitudes de equipos en el taller ESFOT.
                    </p>
                </div>

                {/* Filtros de Estado */}
                <div className="flex gap-2 flex-wrap">
                    {["Todas", "Pendiente", "Aprobada", "Devuelta"].map(opcion => (
                        <button
                            key={opcion}
                            onClick={() => setFiltro(opcion)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                filtro === opcion
                                    ? "bg-purple-700 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                        >
                            {opcion === "Todas" ? "Todas" : (estadoBadges[opcion]?.label || opcion)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listado / Tabla */}
            {cargando ? (
                <div className="text-center py-12 text-gray-500 animate-pulse">Cargando tus reservas desde MongoDB...</div>
            ) : reservasFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No tienes reservas registradas en este estado.
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="p-4">Código</th>
                                    <th className="p-4">Herramienta</th>
                                    <th className="p-4">Fecha Inicio</th>
                                    <th className="p-4">Fecha Fin</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                {reservasFiltradas.map((r) => {
                                    const BadgeInfo = estadoBadges[r.estado] || { label: r.estado, cls: "bg-gray-100 text-gray-700", icon: MdInfo };
                                    const Icon = BadgeInfo.icon;
                                    return (
                                        <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold">
                                                {r.producto?.codigoInventario || "HER-N/A"}
                                            </td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                                {r.producto?.imagen && (
                                                    <img src={r.producto.imagen} alt="" className="w-8 h-8 object-contain rounded" />
                                                )}
                                                {r.producto?.nombre || "Equipo ESFOT"}
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">{formatearFecha(r.fechaInicio)}</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">{formatearFecha(r.fechaFin)}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${BadgeInfo.cls}`}>
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {BadgeInfo.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right text-gray-500 text-xs">
                                                {r.observaciones || "Sin observaciones"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisReservas;
