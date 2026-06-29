export const Searchbar = ({ search, setSearch, sortBy, setSortBy }) => {
    return (
        <div className="flex gap-3 mb-6 items-center">
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Buscar por nombre o código de inventario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               rounded-xl px-4 py-2.5 pl-10 focus:outline-none
                               focus:ring-2 focus:ring-[#1E4D8C]"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           rounded-xl px-4 py-2.5 focus:outline-none"
            >
                <option value="default">Ordenar por: Relevancia</option>
                <option value="nombre">Ordenar por: Nombre (A-Z)</option>
                <option value="tipo">Ordenar por: Tipo (Prestables primero)</option>
                <option value="precio">Ordenar por: Precio (menor a mayor)</option>
            </select>
        </div>
    )
}