export const StatsCard = ({ titulo, numero, icono, porcentaje, tendencia, colorIcono }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center gap-4">

            {/* Ícono */}
            <div className={`p-3 rounded-xl ${colorIcono}`}>
                <span className="text-2xl">{icono}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{titulo}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{numero}</p>
            </div>

            {/* Porcentaje */}
            <span className={`text-sm font-semibold px-2 py-1 rounded-lg
                ${tendencia === 'up' ? 'text-green-600 bg-green-100' : ''}
                ${tendencia === 'down' ? 'text-red-600 bg-red-100' : ''}
                ${tendencia === 'neutral' ? 'text-gray-600 bg-gray-100' : ''}
            `}>
                {tendencia === 'up' ? '▲' : tendencia === 'down' ? '▼' : '●'} {porcentaje}
            </span>

        </div>
    )
}