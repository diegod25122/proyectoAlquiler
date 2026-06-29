import { useNavigate } from "react-router-dom";
import Table from "../components/Table"; // Asegúrate de ajustar la ruta de importación de tu tabla
import { MdAddCircleOutline } from "react-icons/x"; // Ajusta a "md" según tus iconos

const InventarioAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header del Inventario con Flexbox alineado */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventario General ESFOT</h1>
                    <p className="text-sm text-gray-500">Control global de herramientas prestables y componentes consumibles.</p>
                </div>
                
                {/* Botón de Registro alineado a la derecha */}
                <button
                    onClick={() => navigate("/admin/producto/registro")}
                    className="mt-4 md:mt-0 flex items-center bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
                >
                    <MdAddCircleOutline className="mr-2 h-5 w-5" />
                    Registrar Nuevo Producto
                </button>
            </div>

            {/* Renderizado de la Tabla */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <Table />
            </div>
        </div>
    );
};

export default InventarioAdmin;