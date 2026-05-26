// pages/Home.jsx
import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/catalog/Sidebar'
import { ToolCard } from '../components/catalog/ToolCard'
import { Footer } from '../components/Footer'
import useDarkMode from '../hooks/useDarkMode'
// Data de prueba mientras conectas la API
const toolsMock = [
    { id: 1, nombre: 'Oscilloscope 100MHz', categoria: 'Tecnológicas', disponible: true, imagen: '/images/osciloscopie.webp' },
    { id: 2, nombre: 'Cordless Drill 20V', categoria: 'Manuales', disponible: true, imagen: '/images/drill.jpeg' },
    { id: 3, nombre: 'Arduino Uno Kit', categoria: 'Tecnológicas', disponible: false, hasta: '25 MAY', imagen: '/images/arduino.jpeg' },
    { id: 4, nombre: 'Brocha', categoria: 'Manuales', disponible: true, imagen: '/images/brocha.jpeg' },
]

export const Home = () => {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('default')

    const filteredTools = toolsMock.filter(tool =>
        tool.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-4 py-6">

                {/* Barra búsqueda + ordenar */}
                <div className="flex gap-3 mb-6 items-center">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 
                                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                       rounded-lg px-4 py-2 pl-10 focus:outline-none 
                                       focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 dark:border-gray-700 
                                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                   rounded-lg px-4 py-2 focus:outline-none"
                    >
                        <option value="default">Sort: os</option>
                        <option value="nombre">Nombre</option>
                        <option value="disponible">Disponibilidad</option>
                    </select>
                </div>

                {/* Layout principal */}
                <div className="flex gap-6">
                    <Sidebar />

                    {/* Grid herramientas */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredTools.map(tool => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    )
}