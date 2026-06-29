const CATEGORIAS = ['Manuales', 'Tecnológicas', 'Ópticas', 'Consumibles']
const TIPOS = ['Prestable', 'Consumible']

export const Sidebar = ({ filtros, onChangeFiltros }) => {
    const toggleCategoria = (cat) => {
        const nuevas = filtros.categorias.includes(cat)
            ? filtros.categorias.filter(c => c !== cat)
            : [...filtros.categorias, cat]
        onChangeFiltros({ ...filtros, categorias: nuevas })
    }

    const toggleTipo = (tipo) => {
        const nuevos = filtros.tipos.includes(tipo)
            ? filtros.tipos.filter(t => t !== tipo)
            : [...filtros.tipos, tipo]
        onChangeFiltros({ ...filtros, tipos: nuevos })
    }

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md p-5
                          h-fit sticky top-20">

            <h2 className="font-display text-lg font-bold text-gray-800 dark:text-white mb-4">
                Filtros
            </h2>

            {/* Categorías — alineadas al enum real de Producto.categoria */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Categorías
                </h3>
                {CATEGORIAS.map(cat => (
                    <label key={cat} className="flex items-center gap-2 text-sm
                                                text-gray-600 dark:text-gray-400 mb-1 cursor-pointer">
                        <input
                            type="checkbox"
                            className="accent-[#1E4D8C]"
                            checked={filtros.categorias.includes(cat)}
                            onChange={() => toggleCategoria(cat)}
                        />
                        {cat}
                    </label>
                ))}
            </div>

            {/* Tipo — reemplaza al filtro de "Marca" que no existe en tu schema */}
            <div className="mb-5">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tipo
                </h3>
                {TIPOS.map(tipo => (
                    <label key={tipo} className="flex items-center gap-2 text-sm
                                                text-gray-600 dark:text-gray-400 mb-1 cursor-pointer">
                        <input
                            type="checkbox"
                            className="accent-[#6B46C1]"
                            checked={filtros.tipos.includes(tipo)}
                            onChange={() => toggleTipo(tipo)}
                        />
                        {tipo}
                    </label>
                ))}
            </div>

            {(filtros.categorias.length > 0 || filtros.tipos.length > 0) && (
                <button
                    onClick={() => onChangeFiltros({ categorias: [], tipos: [] })}
                    className="text-xs text-red-500 hover:underline"
                >
                    Limpiar filtros
                </button>
            )}
        </aside>
    )
}