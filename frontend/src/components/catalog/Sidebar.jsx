// components/catalog/Sidebar.jsx
export const Sidebar = ({ onFilter }) => {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 
                          h-fit sticky top-4">

            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Filtros
            </h2>

            {/* Categorías */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 
                               flex justify-between items-center">
                    Categorías <span>▲</span>
                </h3>
                {['Manuales', 'Tecnológicas', 'Ópticas'].map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm 
                                                text-gray-600 dark:text-gray-400 mb-1">
                        <input type="checkbox" className="accent-blue-900"/>
                        {cat}
                    </label>
                ))}
            </div>

            {/* Disponibilidad */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Disponibilidad
                </h3>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input type="checkbox" className="accent-blue-900" defaultChecked/>
                    Disponible
                </label>
            </div>

            {/* Marca */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Marca
                </h3>
                {['Bosch', 'DeWalt', 'Makita'].map(marca => (
                    <label key={marca} className="flex items-center gap-2 text-sm 
                                                   text-gray-600 dark:text-gray-400 mb-1">
                        <input type="checkbox" className="accent-blue-900"/>
                        {marca}
                    </label>
                ))}
            </div>

        </aside>
    )
}