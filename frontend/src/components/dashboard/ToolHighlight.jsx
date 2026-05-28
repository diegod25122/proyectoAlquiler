export const ToolHighlight = ({ nombre, categoria, imagen, descripcion, disponible }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 
                        dark:border-gray-700 p-4 flex flex-col gap-2">

            {/* Badge categoría */}
            <span className="text-xs text-gray-400 border border-gray-200 
                             rounded-full px-2 py-0.5 w-fit">
                {categoria}
            </span>

            {/* Nombre */}
            <h3 className="font-bold text-gray-800 dark:text-white">{nombre}</h3>

            {/* Imagen */}
            <img
                src={imagen}
                alt={nombre}
                className="w-full h-40 object-contain"
            />

            {/* Descripción */}
            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3">
                {descripcion}
            </p>

            {/* Disponibilidad */}
            <p className="text-green-500 text-xs font-semibold">
                Disponibilidad: {disponible ? '+5%' : 'No disponible'}
            </p>

            {/* Botón */}
            <button className="w-full py-2 bg-gray-800 dark:bg-gray-700 text-white 
                               rounded-lg text-sm hover:bg-gray-700 transition-colors mt-auto">
                Reservar
            </button>

        </div>
    )
}