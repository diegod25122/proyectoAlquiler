/* eslint-disable react/prop-types */
import { MdDeleteForever, MdOutlinePayments } from 'react-icons/md'
import ModalPayment from './ModalPayment'
import useStorePrestamos from '../../context/storePrestamos'
import storeAuth from '../../context/storeAuth'

const TableTreatments = ({ treatments, listarPrestamos }) => {

    const { deletePrestamo, modal, toggleModal, setPrestamoSeleccionado } = useStorePrestamos()
    const { rol } = storeAuth()

    const handleDelete = async (id) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/prestamo/eliminar/${id}`
        await deletePrestamo(url)
        listarPrestamos()
    }

    const handlePagar = (prestamo) => {
        setPrestamoSeleccionado(prestamo)
        toggleModal('pago')
    }

    return (
        <>
            <table className='w-full mt-5 table-auto shadow-lg bg-white'>
                <thead className='bg-gray-800 text-slate-400'>
                    <tr>
                        <th className="p-2">N°</th>
                        <th className="p-2">Herramienta</th>
                        <th className="p-2">Estudiante</th>
                        <th className="p-2">Fecha inicio</th>
                        <th className="p-2">Fecha fin</th>
                        <th className="p-2">Precio</th>
                        <th className="p-2">Estado pago</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {treatments?.map((prestamo, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={prestamo._id || index}>
                            <td>{index + 1}</td>
                            <td>{prestamo.herramienta?.nombre}</td>
                            <td>{prestamo.usuario?.nombre} {prestamo.usuario?.apellido}</td>
                            <td>{new Date(prestamo.fechaInicio).toLocaleDateString()}</td>
                            <td>{new Date(prestamo.fechaFin).toLocaleDateString()}</td>
                            <td className="font-semibold">${prestamo.precio}</td>
                            <td>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                                    prestamo.estadoPago === 'Pagado'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {prestamo.estadoPago}
                                </span>
                            </td>
                            <td className='py-2 text-center'>
                                {prestamo.estadoPago === 'Pendiente' && (
                                    <MdOutlinePayments
                                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2 hover:text-green-600"
                                        title="Pagar"
                                        onClick={() => handlePagar(prestamo)}
                                    />
                                )}
                                {rol === 'Administrador' && (
                                    <MdDeleteForever
                                        className="h-8 w-8 text-red-900 cursor-pointer inline-block hover:text-red-600"
                                        title="Eliminar"
                                        onClick={() => handleDelete(prestamo._id)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modal === 'pago' && <ModalPayment listarPrestamos={listarPrestamos} />}
        </>
    )
}

export default TableTreatments
