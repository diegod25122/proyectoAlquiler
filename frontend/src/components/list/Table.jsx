import { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md"; // Cambia "x" por "md" en tu entorno
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Table = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // 1. Cargar inventario exclusivo del Admin
    useEffect(() => {
        const obtenerInventarioAdmin = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                
                // Llamamos al nuevo endpoint administrativo protegido
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/productos/admin`, config);
                setProductos(data);
            } catch (error) {
                console.error("Error al cargar el inventario de administración:", error);
                Swal.fire("Error", "No se pudo cargar el inventario o sesión expirada", "error");
            } finally {
                setCargando(false);
            }
        };
        obtenerInventarioAdmin();
    }, []);

    // 2. Función para dar de baja / eliminar físicamente un producto
    const handleEliminar = async (id, nombre) => {
        Swal.fire({
            title: `¿Estás seguro de dar de baja el artículo: ${nombre}?`,
            text: "Esta acción cambiará su estado a inactivo en el sistema.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, dar de baja",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };

                    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/producto/eliminar/${id}`, config);
                    
                    // Actualizar el estado local para reflejar el cambio visual inmediato sin recargar la página
                    setProductos(productos.map(p => p._id === id ? { ...p, estado: false } : p));
                    
                    Swal.fire("¡Éxito!", "El artículo ha sido dado de baja correctamente.", "success");
                } catch (error) {
                    console.error("Error al eliminar:", error);
                    Swal.fire("Error", "No se pudo procesar la baja del producto.", "error");
                }
            }
        });
    };

    if (cargando) return <p className="text-center mt-5 text-gray-500">Cargando inventario de la ESFOT...</p>;

    return (
        <div className="overflow-x-auto w-full shadow-lg rounded-lg">
            <table className="w-full table-auto bg-white">
                <thead className="bg-gray-800 text-slate-200">
                    <tr>
                        {["N°", "Código", "Nombre", "Categoría", "Tipo", "Precio", "Stock", "Estado", "Acciones"].map((header) => (
                            <th key={header} className="p-3 text-center text-sm font-semibold">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {productos.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center py-4 text-gray-500">No hay productos en el inventario.</td>
                        </tr>
                    ) : (
                        productos.map((producto, index) => (
                            <tr key={producto._id} className="hover:bg-gray-100 border-b border-gray-200 text-center text-gray-700 transition-colors">
                                <td className="p-3 text-sm">{index + 1}</td>
                                <td className="p-3 text-sm font-mono text-gray-600">{producto.codigoInventario}</td>
                                <td className="p-3 text-sm font-medium text-gray-900">{producto.nombre}</td>
                                <td className="p-3 text-sm">{producto.categoria}</td>
                                <td className="p-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${producto.tipo === 'Prestable' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {producto.tipo}
                                    </span>
                                </td>
                                <td className="p-3 text-sm">{producto.tipo === 'Consumible' ? `$${producto.precio.toFixed(2)}` : 'N/A'}</td>
                                <td className="p-3 text-sm font-semibold">{producto.stock} u</td>
                                <td className="p-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${producto.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {producto.estado ? 'Activo' : 'Baja'}
                                    </span>
                                </td>
                                <td className="p-3 text-center whitespace-nowrap">
                                    <MdInfo 
                                        onClick={() => navigate(`/admin/producto/${producto._id}`)}
                                        title="Ver Detalle" 
                                        className="h-6 w-6 text-slate-700 cursor-pointer inline-block mr-3 hover:text-green-600"
                                    />
                                    <MdPublishedWithChanges 
                                        onClick={() => navigate(`/admin/producto/editar/${producto._id}`)}
                                        title="Actualizar / Editar" 
                                        className="h-6 w-6 text-slate-700 cursor-pointer inline-block mr-3 hover:text-blue-600"
                                    />
                                    <MdDeleteForever 
                                        onClick={() => handleEliminar(producto._id, producto.nombre)}
                                        title="Dar de Baja" 
                                        className="h-6 w-6 text-red-800 cursor-pointer inline-block hover:text-red-600"
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