import { useEffect, useState } from 'react'
import axios from 'axios'
import { StatsCard } from '../components/dashboard/StatsCard'
import { ToolHighlight } from '../components/dashboard/ToolHighlight'

const getToken = () => {
  const storedAuth = JSON.parse(localStorage.getItem('auth-token'))
  return storedAuth?.state?.token || null
}

export default function Panel() {
  const [herramientas, setHerramientas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHerramientas = async () => {
      try {
        const token = getToken()
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/herramientas`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        })
        setHerramientas(response.data || [])
      } catch (error) {
        console.error('Error cargando herramientas:', error)
        setHerramientas([])
      } finally {
        setLoading(false)
      }
    }

    fetchHerramientas()
  }, [])

  const total = herramientas.length
  const disponibles = herramientas.filter((herramienta) => herramienta.estado).length
  const enPrestamo = herramientas.filter((herramienta) => herramienta.enPrestamo).length
  const sinDisponibilidad = herramientas.filter((herramienta) => herramienta.estado === false).length

  const stats = [
    {
      titulo: 'Herramientas Disponibles',
      numero: disponibles,
      icono: '🔧',
      porcentaje: total ? `${Math.round((disponibles / total) * 100)}%` : '0%',
      tendencia: 'up',
      colorIcono: 'bg-blue-100',
    },
    {
      titulo: 'Alquileres Activos',
      numero: enPrestamo,
      icono: '📦',
      porcentaje: total ? `${Math.round((enPrestamo / total) * 100)}%` : '0%',
      tendencia: enPrestamo ? 'up' : 'neutral',
      colorIcono: 'bg-orange-100',
    },
    {
      titulo: 'Total de Herramientas',
      numero: total,
      icono: '📚',
      porcentaje: total ? '100%' : '0%',
      tendencia: 'neutral',
      colorIcono: 'bg-yellow-100',
    },
    {
      titulo: 'No disponibles',
      numero: sinDisponibilidad,
      icono: '🛠️',
      porcentaje: total ? `${Math.round((sinDisponibilidad / total) * 100)}%` : '0%',
      tendencia: sinDisponibilidad ? 'down' : 'neutral',
      colorIcono: 'bg-red-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-black text-2xl text-gray-500 dark:text-gray-300">Métricas generales</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Datos cargados desde la base de datos</p>
        </div>
        {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Cargando...</p>}
      </div>

      <hr className="border-t-2 border-gray-300" />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.titulo} {...stat} />
        ))}
      </section>

      <h2 className="font-black text-2xl text-gray-500 dark:text-gray-300">Herramientas Destacadas</h2>
      <hr className="border-t-2 border-gray-300" />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {herramientas.slice(0, 4).map((tool) => (
          <ToolHighlight
            key={tool._id}
            nombre={tool.nombre}
            categoria={tool.categoria || 'General'}
            imagen={tool.imagen || '/images/drill.jpeg'}
            descripcion={tool.descripcion || 'Descripción no disponible'}
            disponible={tool.estado}
          />
        ))}
      </section>
    </div>
  )
}
