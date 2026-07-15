import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import TableTreatments from '../components/treatments/Table'
import ModalTreatments from '../components/treatments/Modal'
import useStorePrestamos from '../context/storePrestamos'
import { FiBox, FiLoader } from 'react-icons/fi'

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

    // Cargar model-viewer web component desde Google CDN
    useEffect(() => {
        if (!document.querySelector('[data-model-viewer]')) {
            const s = document.createElement('script')
            s.type = 'module'
            s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'
            s.setAttribute('data-model-viewer', 'true')
            document.head.appendChild(s)
        }
    }, [])

    const generarModelo = async () => {
        if (!herramienta) return
        setGenerando3D(true)
        setError3D(null)
        setModelo3D(null)
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/meshy/generar`,
                { nombre: herramienta.nombre, descripcion: herramienta.descripcion },
                { ...getAuthHeaders(), timeout: 130000 }
            )
            setModelo3D(data)
        } catch (error) {
            setError3D(error.response?.data?.msg || 'No se pudo generar el modelo 3D')
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

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Visualizar</h1>
                <hr className='my-4 border-t-2 border-gray-300' />
                <p className='mb-8'>Este módulo te permite visualizar todos los datos</p>
            </div>

            <div>
                <div className='m-5 flex justify-between'>

                    <div>
                        <ul className="list-disc pl-5">

                            <li className="text-md text-gray-00 mt-4 font-bold text-xl">Datos de la herramienta</li>

                            <ul className="pl-5">
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Nombre: </span>
                                    {herramienta?.nombre}
                                </li>
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Código de inventario: </span>
                                    {herramienta?.codigoInventario}
                                </li>
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Descripción: </span>
                                    {herramienta?.descripcion}
                                </li>
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Estado: </span>
                                    <span className={`bg-blue-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${
                                        herramienta?.estado ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {herramienta?.estado ? 'Disponible' : 'No disponible'}
                                    </span>
                                </li>
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">En préstamo: </span>
                                    <span className={`bg-blue-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${
                                        herramienta?.enPrestamo ? 'text-orange-500' : 'text-green-500'
                                    }`}>
                                        {herramienta?.enPrestamo ? 'Sí' : 'No'}
                                    </span>
                                </li>
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Registrado por: </span>
                                    {herramienta?.registradoPor?.nombre} {herramienta?.registradoPor?.apellido}
                                </li>
                            </ul>

                        </ul>
                    </div>

                    {/* Imagen + modelo 3D */}
                    <div className="flex flex-col items-center gap-3">
                        {modelo3D?.modelUrl ? (
                            <div className="w-80 h-80 rounded-lg overflow-hidden border border-gray-200">
                                <model-viewer
                                    src={modelo3D.modelUrl}
                                    alt={herramienta?.nombre}
                                    auto-rotate=""
                                    camera-controls=""
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        ) : (
                            <img
                                src={herramienta?.imagen || 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png'}
                                alt={herramienta?.nombre || 'herramienta'}
                                className='h-80 w-80 object-cover rounded-lg'
                            />
                        )}

                        <button
                            onClick={generarModelo}
                            disabled={generando3D}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:bg-gray-400 text-white rounded-lg text-sm transition-colors"
                        >
                            {generando3D
                                ? <><FiLoader className="animate-spin" size={16} /> Generando modelo 3D...</>
                                : <><FiBox size={16} /> {modelo3D ? 'Regenerar modelo 3D' : 'Ver modelo 3D (Meshy AI)'}</>
                            }
                        </button>
                        {error3D && <p className="text-red-500 text-xs text-center max-w-xs">{error3D}</p>}
                        {generando3D && <p className="text-gray-500 text-xs text-center">Esto puede tardar hasta 2 minutos...</p>}
                    </div>
                </div>

                <hr className='my-4 border-t-2 border-gray-300' />

                {/* Sección de préstamos */}
                <div className='flex justify-between items-center'>
                    <p>Este módulo te permite gestionar los préstamos de esta herramienta</p>
                    <button
                        className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
                        onClick={() => toggleModal('registro')}
                    >
                        Registrar préstamo
                    </button>

                    {modal === 'registro' && (
                        <ModalTreatments herramientaId={id} listarPrestamos={listarPrestamos} />
                    )}
                </div>

                {/* Mostrar los préstamos */}
                {prestamos.length === 0
                    ? <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 mt-5" role="alert">
                        <span className="font-medium">No existen préstamos registrados</span>
                      </div>
                    : <TableTreatments treatments={prestamos} listarPrestamos={listarPrestamos} />
                }
            </div>
        </>
    )
}

export default Details
