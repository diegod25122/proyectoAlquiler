import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import TableTreatments from '../components/treatments/Table'
import ModalTreatments from '../components/treatments/Modal'
import useStorePrestamos from '../context/storePrestamos'

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
                const url = `${import.meta.env.VITE_BACKEND_URL}/herramienta/${id}`
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

                    {/* Imagen lateral */}
                    <div>
                        <img
                            src={herramienta?.imagen || 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png'}
                            alt={herramienta?.nombre || 'herramienta'}
                            className='h-80 w-80 object-cover rounded-lg'
                        />
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
