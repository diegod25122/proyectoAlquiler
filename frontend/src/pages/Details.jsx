import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import TableTreatments from '../components/treatments/Table'
import ModalTreatments from '../components/treatments/Modal'
import useStorePrestamos from '../context/storePrestamos'
import { FiBox, FiLoader, FiTag, FiHash, FiFileText, FiUser, FiToggleRight, FiLayers, FiDollarSign } from 'react-icons/fi'
import VisorHerramienta3D from '../components/VisorHerramienta3D'

const getAuthHeaders = () => {
    const storedUser = JSON.parse(localStorage.getItem('auth-token'))
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedUser?.state?.token}`
        }
    }
}

const Details = () => {
    const { id } = useParams()
    const { modal, toggleModal } = useStorePrestamos()
    const [herramienta, setHerramienta] = useState(null)
    const [prestamos, setPrestamos] = useState([])
    const [modelo3D, setModelo3D] = useState(null)
    const [generando3D, setGenerando3D] = useState(false)
    const [error3D, setError3D] = useState(null)

    // Generar modelo 3D usando el backend con Tripo3D
    const generarModelo = async () => {
        if (!herramienta) return
        setGenerando3D(true)
        setError3D(null)
        setModelo3D(null)
        try {
            const promptTexto = `${herramienta.nombre} - ${herramienta.descripcion || 'herramienta de trabajo'}`

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/generate-3d`,
                { prompt: promptTexto },
                { ...getAuthHeaders(), timeout: 130000 }
            )

            if (data.modelUrl) {
                setModelo3D(data)
            } else {
                setError3D('No se obtuvo el enlace del modelo 3D')
            }
        } catch (error) {
            setError3D(error.response?.data?.error || error.response?.data?.msg || 'No se pudo generar el modelo 3D')
        } finally {
            setGenerando3D(false)
        }
    }

    const listarPrestamos = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/prestamo/herramienta/${id}`
            const { data } = await axios.get(url, getAuthHeaders())
            setPrestamos(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const fetchHerramienta = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/producto/${id}`
                const { data } = await axios.get(url, getAuthHeaders())
                setHerramienta(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchHerramienta()
        listarPrestamos()
    }, [id])

    if (!herramienta) return (
        <div className="flex items-center justify-center min-h-64 text-gray-400">
            <FiLoader className="animate-spin mr-2" size={20} /> Cargando producto...
        </div>
    )

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{herramienta.nombre}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Código: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{herramienta.codigoInventario}</span>
                </p>
            </div>

            {/* Cuerpo principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Información de la herramienta */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            herramienta.estado
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${herramienta.estado ? 'bg-green-500' : 'bg-red-500'}`} />
                            {herramienta.estado ? 'Disponible' : 'No disponible'}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                            herramienta.enPrestamo
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                            <FiToggleRight size={12} />
                            {herramienta.enPrestamo ? 'En préstamo' : 'Sin préstamo activo'}
                        </span>
                        {herramienta.tipo && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                <FiLayers size={12} /> {herramienta.tipo}
                            </span>
                        )}
                        {herramienta.categoria && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                <FiTag size={12} /> {herramienta.categoria}
                            </span>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                        {[
                            { icon: FiTag,        label: "Nombre",               value: herramienta.nombre },
                            { icon: FiHash,       label: "Código de inventario", value: herramienta.codigoInventario },
                            { icon: FiLayers,     label: "Categoría",            value: herramienta.categoria || "—" },
                            { icon: FiLayers,     label: "Tipo",                 value: herramienta.tipo || "—" },
                            { icon: FiDollarSign, label: "Precio",               value: herramienta.precio ? `$${herramienta.precio.toFixed(2)}` : "Gratuito (Préstamo)" },
                            { icon: FiLayers,     label: "Stock",                value: herramienta.stock ?? "—" },
                            { icon: FiUser,       label: "Registrado por",       value: herramienta.registradoPor ? `${herramienta.registradoPor.nombre} ${herramienta.registradoPor.apellido}` : "—" },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-start gap-3 px-5 py-3.5">
                                <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon size={14} className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-start gap-3 px-5 py-3.5">
                            <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <FiFileText size={14} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Descripción</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-0.5">{herramienta.descripcion}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna derecha: Imagen / Visor 3D */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                        {modelo3D?.modelUrl ? (
                            /* ✅ Se pasa correctamente 'modelUrl' al componente */
                            <VisorHerramientas3D modelUrl={modelo3D.modelUrl} />
                        ) : (
                            <img
                                src={herramienta.imagen || 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png'}
                                alt={herramienta.nombre}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        )}

                        <button
                            onClick={generarModelo}
                            disabled={generando3D}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                            {generando3D
                                ? <><FiLoader className="animate-spin" size={15} /> Generando 3D...</>
                                : <><FiBox size={15} /> {modelo3D ? 'Regenerar modelo 3D' : 'Ver modelo 3D'}</>
                            }
                        </button>
                        {error3D && <p className="text-red-500 text-xs text-center mt-2">{error3D}</p>}
                        {generando3D && <p className="text-gray-400 text-xs text-center mt-1">Puede tardar entre 30s y 1 minuto...</p>}
                    </div>
                </div>
            </div>

            {/* Sección de préstamos */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Historial de préstamos</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Préstamos registrados para este producto</p>
                    </div>
                    <button
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                        onClick={() => toggleModal('registro')}
                    >
                        + Registrar préstamo
                    </button>
                </div>

                {modal === 'registro' && (
                    <ModalTreatments herramientaId={id} listarPrestamos={listarPrestamos} />
                )}

                {prestamos.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                        <FiLayers size={32} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No existen préstamos registrados para este producto</p>
                    </div>
                ) : (
                    <TableTreatments treatments={prestamos} listarPrestamos={listarPrestamos} />
                )}
            </div>
        </div>
    )
}

export default Details