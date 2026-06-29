// components/home/Catalog.jsx
import { useState, useEffect, useMemo } from 'react'
import { Sidebar } from '../catalogo/Sidebar'
import { Searchbar } from '../catalog/Searchbar'
import { ToolCard } from '../catalog/ToolCard'
import storeProducto from '../../context/storeProducto'

export const Catalog = () => {
    const { productos, listarProductos } = storeProducto()

    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')
    const [filtros, setFiltros] = useState({ categorias: [], tipos: [] })

    useEffect(() => {
        listarProductos()
    }, [])

    const productosFiltrados = useMemo(() => {
        let resultado = productos.filter(p =>
            p.nombre.toLowerCase().includes(search.toLowerCase()) ||
            p.codigoInventario.toLowerCase().includes(search.toLowerCase())
        )

        if (filtros.categorias.length > 0) {
            resultado = resultado.filter(p => filtros.categorias.includes(p.categoria))
        }
        if (filtros.tipos.length > 0) {
            resultado = resultado.filter(p => filtros.tipos.includes(p.tipo))
        }

        if (sortBy === 'nombre') {
            resultado = [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre))
        } else if (sortBy === 'tipo') {
            resultado = [...resultado].sort((a, b) => (a.tipo === 'Prestable' ? -1 : 1))
        } else if (sortBy === 'precio') {
            resultado = [...resultado].sort((a, b) => a.precio - b.precio)
        }

        return resultado
    }, [productos, search, filtros, sortBy])

    return (
        <div id="catalogo" className="container mx-auto px-4 py-10">
            <h2 className="font-display text-2xl font-bold text-[#0F2A4A] dark:text-white mb-6">
                Catálogo del taller
            </h2>

            <Searchbar search={search} setSearch={setSearch} sortBy={sortBy} setSortBy={setSortBy} />

            <div className="flex gap-6">
                <Sidebar filtros={filtros} onChangeFiltros={setFiltros} />

                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productosFiltrados.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500 py-10">
                            No se encontraron productos con esos filtros.
                        </p>
                    ) : (
                        productosFiltrados.map(producto => (
                            <ToolCard key={producto._id} producto={producto} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}