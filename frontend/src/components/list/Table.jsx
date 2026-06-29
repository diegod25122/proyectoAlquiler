import { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md";

const Table = () => {
    // 1. Estado para almacenar los productos de la ESFOT
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 2. Cargar los productos al montar la tabla
    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                // Si en el futuro decides proteger la lista general del admin, 
                // aquí extraes el token del almacenamiento
                const token = localStorage.getItem('token'); 
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Petición a tu endpoint público/privado de Render
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos`, config);
                setProductos(data);
            } catch (error) {
                console.error("Error cargando productos en la tabla:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerProductos();
    }, []);

    if (cargando) {
        return <p className="text-center mt-5 text-gray-500">Cargando inventario de la ESFOT...</p>;
    }

    return (
        <div className="overflow-x-auto w-full mt-5 shadow-lg rounded-lg">
            <table className="w-full table-auto bg-white">
                {/* Encabezado Semántico para Tesis */}
                <thead className="bg-gray-800 text-slate-200">
                    <tr>
                        {["N°", "Código", "Nombre", "Categoría", "Tipo", "Precio", "Stock", "Estado", "Acciones"].map((header) => (
                            <th key={header} className="p-3 text-center text-sm font-semibold">{header}</th>
                        ))}
                    </tr>
                </thead>
                
                {/* Cuerpo de la tabla dinámico */}
                <tbody>
                    {productos.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center py-4 text-gray-500">No hay productos registrados en el inventario.</td>
                        </tr>
                    ) : (
                        productos.map((producto, index) => (
                            <tr key={producto._id} className="hover:bg-gray-100 border-b border-gray-200 text-center text-gray-700 transition-colors">
                                <td className="p-3 text-sm">{index + 1}</td>
                                <td className="p-3 text-sm font-mono text-gray-600">{producto.codigoInventario}</td>
                                <td className="p-3 text-sm font-medium text-gray-900">{producto.nombre}</td>
                                <td className="p-3 text-sm">{producto.categoria}</td>
                                <td className="p-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        producto.tipo === 'Prestable' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {producto.tipo}
                                    </span>
                                </td>
                                <td className="p-3 text-sm">
                                    {producto.tipo === 'Consumible' ? `$${producto.precio.toFixed(2)}` : 'N/A'}
                                </td>
                                <td className="p-3 text-sm font-semibold">{producto.stock} u</td>
                                <td className="p-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        producto.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {producto.estado ? 'Activo' : 'Baja'}
                                    </span>
                                </td>
                                
                                {/* Columna de acciones */}
                                <td className="p-3 text-center whitespace-nowrap">
                                    <MdInfo 
                                        title="Ver Detalle" 
                                        className="h-6 w-6 text-slate-700 cursor-pointer inline-block mr-3 hover:text-green-600 transition-colors"
                                    />
                                    <MdPublishedWithChanges 
                                        title="Actualizar / Editar" 
                                        className="h-6 w-6 text-slate-700 cursor-pointer inline-block mr-3 hover:text-blue-600 transition-colors"
                                    />
                                    <MdDeleteForever 
                                        title="Dar de Baja" 
                                        className="h-6 w-6 text-red-800 cursor-pointer inline-block hover:text-red-600 transition-colors"
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;