// components/catalog/ToolCard.jsx
export const ToolCard = ({ tool }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md 
                        hover:shadow-xl transition-shadow duration-300 p-4">
            
            {/* Imagen + favorito */}
            <div className="relative">
                <img
                    src={tool.imagen}
                    alt={tool.nombre}
                    className="w-full h-40 object-contain mb-3"
                />
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    ♡
                </button>
            </div>

            {/* Info */}
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">{tool.nombre}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{tool.categoria}</p>

            {/* Disponibilidad */}
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold
                ${tool.disponible 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'}`}>
                {tool.disponible ? 'DISPONIBLE' : `RESERVADO HASTA ${tool.hasta}`}
            </span>

            {/* Botón */}
            <button className="mt-3 w-full py-2 bg-blue-900 dark:bg-purple-700 
                               text-white rounded-lg text-sm font-medium
                               hover:bg-blue-800 transition-colors">
                Añadir a Reserva
            </button>

        </div>
    )
}