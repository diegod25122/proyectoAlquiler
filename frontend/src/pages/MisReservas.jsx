import { useEffect, useState } from "react";
import axios from "axios";
import { 
    MdCalendarToday, 
    MdInfo, 
    MdCheckCircle, 
    MdHourglassEmpty, 
    MdCancel, 
    MdBuild, 
    MdAssignment 
} from "react-icons/md";
import storeAuth from "../context/storeAuth";

// Mapeo exacto con los estados del modelo Reserva en el backend
const estadoBadges = {
    Pendiente: { 
        label: "En Revisión", 
        cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 border-yellow-300", 
        icon: MdHourglassEmpty 
    },
    Aprobada: { 
        label: "Aprobada", 
        cls: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300", 
        icon: MdCheckCircle 
    },
    EnUso: { 
        label: "En Préstamo", 
        cls: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300", 
        icon: MdBuild 
    },
    Devuelto: { 
        label: "Devuelta", 
        cls: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-300", 
        icon: MdCheckCircle 
    },
    Rechazada: { 
        label: "Rechazada", 
        cls: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300", 
        icon: MdCancel 
    }
};

export const MisReservas = () => {
    const { token } = storeAuth();
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState("Todas");

    useEffect(() => {
        const obtenerMisReservas = async () => {
            try {
                // Extracción segura del token en caso de venir de Zustand Persist
                const sesionStorage = JSON.parse(localStorage.getItem("auth-token") || "null");
                const jwtToken = token || sesionStorage?.state?.token || sesionStorage;

                const config = { 
                    headers: { Authorization: `Bearer ${jwtToken}` } 
                };

                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/reserva/mis-reservas`, 
                    config
                );
                setReservas(data || []);
            } catch (error) {
                console.error("Error al cargar reservas desde la API:", error);
                setReservas([]);
            } finally {
                setCargando(false);
            }
        };

        obtenerMisReservas();
    }, [token]);

    const reservasFiltradas = filtro === "Todas" 
        ? reservas 
        : reservas.filter(r => r.estado === filtro);

    const formatearFechaHora = (str) => {
        if (!str) return "N/A";
        return new Date(str).toLocaleString('es-EC', { 
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
                        <MdCalendarToday className="text-purple-600" /> Mis Reservas de Herramientas
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Historial en tiempo real de tus solicitudes de equipos en el taller ESFOT.
                    </p>
                </div>

                {/* Filtros de Estado */}
                <div className="flex gap-2 flex-wrap">
                    {["Todas", "Pendiente", "Aprobada", "EnUso", "Devuelto", "Rechazada"].map(opcion => (
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
                <div className="text-center py-12 text-gray-500 animate-pulse">
                    Cargando tus reservas desde el sistema ESFOT...
                </div>
            ) : reservasFiltradas.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
                    No tienes solicitudes de reserva registradas en este estado.
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="p-4">Código</th>
                                    <th className="p-4">Herramienta</th>
                                    <th className="p-4">Contexto Académico</th>
                                    <th className="p-4">Solicitud</th>
                                    <th className="p-4">Estado</th>
                                    <th className="p-4 text-right">Observaciones / Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                {reservasFiltradas.map((r) => {
                                    const BadgeInfo = estadoBadges[r.estado] || { 
                                        label: r.estado, 
                                        cls: "bg-gray-100 text-gray-700", 
                                        icon: MdInfo 
                                    };
                                    const Icon = BadgeInfo.icon;

                                    return (
                                        <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            {/* Código de Inventario */}
                                            <td className="p-4 font-mono text-xs text-purple-600 dark:text-purple-400 font-semibold whitespace-nowrap">
                                                {r.producto?.codigoInventario || "HER-N/A"}
                                            </td>

                                            {/* Producto */}
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">
                                                <div className="flex items-center gap-3">
                                                    {r.producto?.imagen && (
                                                        <img 
                                                            src={r.producto.imagen} 
                                                            alt={r.producto.nombre || "Herramienta"} 
                                                            className="w-10 h-10 object-cover rounded border border-gray-100 dark:border-gray-800" 
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="leading-snug">{r.producto?.nombre || "Equipo ESFOT"}</p>
                                                        <span className="text-[11px] text-gray-400 font-normal">
                                                            {r.producto?.categoria || "Taller"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contexto Académico */}
                                            <td className="p-4 text-gray-600 dark:text-gray-300">
                                                <div className="space-y-0.5 text-xs">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{r.materia}</p>
                                                    <p className="text-gray-500 dark:text-gray-400">Docente: {r.docente}</p>
                                                    <p className="italic text-gray-400 truncate max-w-xs">{r.proposito}</p>
                                                </div>
                                            </td>

                                            {/* Cantidad y Horas */}
                                            <td className="p-4 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap">
                                                <p><strong>Cant:</strong> {r.cantidadSolicitada} un.</p>
                                                <p><strong>Tiempo:</strong> {r.horasSolicitadas} horas</p>
                                            </td>

                                            {/* Badge de Estado */}
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${BadgeInfo.cls}`}>
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {BadgeInfo.label}
                                                </span>
                                            </td>

                                            {/* Observaciones y Fechas Dinámicas */}
                                            <td className="p-4 text-right text-gray-500 text-xs">
                                                {r.estado === "Aprobada" && r.fechaDevolucionEsperada && (
                                                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                                                        Devolver antes de: <br />
                                                        {formatearFechaHora(r.fechaDevolucionEsperada)}
                                                    </p>
                                                )}

                                                {r.estado === "Rechazada" && (
                                                    <p className="text-red-500 dark:text-red-400 font-medium">
                                                        Motivo: {r.motivoRechazo || "No especificado"}
                                                    </p>
                                                )}

                                                {r.estado === "Devuelto" && (
                                                    <p className="text-green-600 dark:text-green-400">
                                                        Entregado el: <br />
                                                        {formatearFechaHora(r.fechaDevolucionReal)}
                                                    </p>
                                                )}

                                                {r.estado === "Pendiente" && (
                                                    <p className="text-gray-400 italic">Esperando aprobación</p>
                                                )}

                                                {r.estado === "EnUso" && (
                                                    <p className="text-purple-600 dark:text-purple-400 font-medium">
                                                        En uso en taller
                                                    </p>
                                                )}
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