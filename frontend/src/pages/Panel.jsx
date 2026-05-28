import { StatsCard } from '../components/dashboard/StatsCard'
import { ToolHighlight } from '../components/dashboard/ToolHighlight'

const stats = [
    { titulo: "Herramientas Disponibles", numero: 145, icono: "🔧", porcentaje: "+5%", tendencia: "up", colorIcono: "bg-blue-100" },
    { titulo: "Alquileres Activos", numero: 38, icono: "📦", porcentaje: "-2%", tendencia: "down", colorIcono: "bg-orange-100" },
    { titulo: "Reservas Pendientes", numero: 12, icono: "📅", porcentaje: "+1%", tendencia: "up", colorIcono: "bg-yellow-100" },
    { titulo: "En Mantenimiento", numero: 5, icono: "🛠️", porcentaje: "0%", tendencia: "neutral", colorIcono: "bg-red-100" },
]

const toolsDestacadas = [
    { nombre: "Osciloscopio", categoria: "Tecnológicas", imagen: "/images/osciloscopie.webp", descripcion: "Osciloscopio de alta frecuencia para laboratorio.", disponible: true },
    { nombre: "Taladro 20V", categoria: "Manuales", imagen: "/images/drill.jpeg", descripcion: "Taladro inalámbrico de 20V con batería incluida.", disponible: true },
    { nombre: "Arduino Kit", categoria: "Tecnológicas", imagen: "/images/arduino.jpeg", descripcion: "Kit completo de Arduino Uno para proyectos.", disponible: true },
    { nombre: "Brocha", categoria: "Manuales", imagen: "/images/brocha.jpeg", descripcion: "Herramienta de precisión para trabajos manuales.", disponible: true },
]

export default function Panel() {
    return (
        <div className="space-y-6">

            <h1 className="font-black text-2xl text-gray-500 dark:text-gray-300">
                Métricas generales
            </h1>
            <hr className="border-t-2 border-gray-300"/>

            {/* Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                    <StatsCard key={stat.titulo} {...stat}/>
                ))}
            </section>

            {/* Herramientas destacadas */}
            <h2 className="font-black text-2xl text-gray-500 dark:text-gray-300">
                Herramientas Destacadas
            </h2>
            <hr className="border-t-2 border-gray-300"/>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {toolsDestacadas.map(tool => (
                    <ToolHighlight key={tool.nombre} {...tool}/>
                ))}
            </section>

        </div>
    )
}