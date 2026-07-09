<<<<<<< HEAD
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import TableTreatments from "../components/treatments/Table"
import ModalTreatments from "../components/treatments/Modal"


import { useParams } from "react-router"
import {useFetch} from "../hooks/useFetch"


const Details = () => {
    
    const { id } = useParams()
    const [patient, setPatient] = useState({})
    const  {fetchDataBackend}  = useFetch()
    const [treatments, setTreatments] = useState(["demo"])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-EC', { dateStyle: 'long', timeZone: 'UTC' })
    }

    useEffect(() => {
        const listPatient = async () => {
            const url = `${import.meta.env.VITE_BACKEND_URL}/paciente/${id}`
            const storedUser = JSON.parse(localStorage.getItem("auth-token"))
            const headers= {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedUser.state.token}`
            }
            const response = await fetchDataBackend(url, null, "GET", headers)
            setPatient(response)
        }
        listPatient()
    }, [])

=======
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
>>>>>>> 1bf228a (Agrega modulo de prestamos con pago Stripe e IA)

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
<<<<<<< HEAD

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Cédula: {patient?.cedulaPropietario}</span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Nombres completos: {patient?.nombrePropietario}</span>
                                </li>

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Correo electrónico: {patient?.emailPropietario}</span>
                                </li>

                                <li className="text-md mt-2">
                                <span className="text-gray-600 font-bold">Celular: {patient?.celularPropietario}</span>
                                </li>

                            </ul>



                            <li className="text-md text-gray-00 mt-4 font-bold text-xl">Datos de la mascota</li>


                            {/* Datos del paciente */}
                            <ul className="pl-5">

                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Nombre: {patient?.nombreMascota}</span>
=======
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Nombre: </span>
                                    {herramienta?.nombre}
>>>>>>> 1bf228a (Agrega modulo de prestamos con pago Stripe e IA)
                                </li>
                                <li className="text-md mt-2">
<<<<<<< HEAD
                                    <span className="text-gray-600 font-bold">Tipo: {patient?.tipoMascota}</span>
=======
                                    <span className="text-gray-600 font-bold">Código de inventario: </span>
                                    {herramienta?.codigoInventario}
>>>>>>> 1bf228a (Agrega modulo de prestamos con pago Stripe e IA)
                                </li>
                                <li className="text-md mt-2">
<<<<<<< HEAD
                                    <span className="text-gray-600 font-bold">Fecha de nacimiento: {formatDate(patient?.fechaNacimientoMascota)}</span>
=======
                                    <span className="text-gray-600 font-bold">Descripción: </span>
                                    {herramienta?.descripcion}
>>>>>>> 1bf228a (Agrega modulo de prestamos con pago Stripe e IA)
                                </li>
                                <li className="text-md mt-2">
                                    <span className="text-gray-600 font-bold">Estado: </span>
<<<<<<< HEAD
                                    <span className="bg-blue-100 text-green-500 text-xs font-medium 
                                        mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    {patient?.estadoMascota && "activo"}
                                    </span>
                                </li>

                                <li className="text-md text-gray-00 mt-4">
                                    <span className="text-gray-600 font-bold">Observación: {patient?.detalleMascota}</span>
=======
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
>>>>>>> 1bf228a (Agrega modulo de prestamos con pago Stripe e IA)
                                </li>
                            </ul>

                        </ul>
                    </div>

                    {/* Imagen lateral */}
                    <div>
<<<<<<< HEAD
                        <img src={patient?.avatarMascota || patient?.avatarMascotaIA} alt="dogandcat" className='h-80 w-80 rounded-full'/>
=======
                        <img
                            src={herramienta?.imagen || 'https://cdn-icons-png.flaticon.com/512/2138/2138440.png'}
                            alt={herramienta?.nombre || 'herramienta'}
                            className='h-80 w-80 object-cover rounded-lg'
                        />
>>>>>>> 1bf228a (Agrega modulo de prestamos con pago Stripe e IA)
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
