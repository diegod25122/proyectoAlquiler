import { useState } from "react"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { ToastContainer } from 'react-toastify'
import useDarkMode from "../hooks/useDarkMode"
import { Navbar } from "../components/Navbar"
import { useFetch } from "../hooks/useFetch.js"
import logo from '../assets/selloEPN.png'

const FACULTADES = [
    "Sistemas",
    "Eléctrica y Electrónica",
    "Escuela de Formación de Tecnólogos",
    "Civil",
    "Química",
    "Nivelación",
    "Agroindustria",
]

export function Register() {

    const { isDarkMode } = useDarkMode()
    const [showPassword, setShowPassword] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const registerUser = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/registro`
        await fetchDataBackend(url, dataForm, "POST")
    }

    return (
        <>
            <main className="h-screen w-full flex items-center justify-center bg-[url('/images/prepoRegister.webp')]
        bg-cover bg-center relative transition-colors duration-300 overflow-hidden">

                {/* Filtro oscuro */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

                {/* Tarjeta */}
                <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-6 md:p-8
          w-full max-w-4xl mx-4 shadow-2xl border border-gray-100 dark:border-gray-800
          transition-colors duration-300 max-h-[95vh] overflow-y-auto lg:overflow-visible">

                    <ToastContainer />

                    {/* Logo y título */}
                    <div className="flex flex-col items-center mb-5">
                        <img src={logo} className="w-14 mx-auto mb-2" alt="Sello EPN" />
                        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white transition-colors">
                            Crear Cuenta
                        </h1>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 block">
                            Regístrate con tus credenciales institucionales
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(registerUser)}>

                        {/* Grid de 2 columnas en pantallas md+ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3">

                            {/* Nombre */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu nombre"
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      placeholder-gray-400 dark:placeholder-gray-500 
                      focus:border-purple-600 dark:focus:border-purple-500 
                      focus:outline-none focus:ring-1 focus:ring-purple-600 
                      py-2 px-3 text-sm transition-all"
                                    {...register("nombre", { required: "El nombre es obligatorio" })}
                                />
                                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                            </div>

                            {/* Apellido */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ingresa tu apellido"
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      placeholder-gray-400 dark:placeholder-gray-500 
                      focus:border-purple-600 dark:focus:border-purple-500 
                      focus:outline-none focus:ring-1 focus:ring-purple-600 
                      py-2 px-3 text-sm transition-all"
                                    {...register("apellido", { required: "El apellido es obligatorio" })}
                                />
                                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                            </div>

                            {/* Facultad - Combobox */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Facultad
                                </label>
                                <select
                                    defaultValue=""
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      focus:border-purple-600 dark:focus:border-purple-500 
                      focus:outline-none focus:ring-1 focus:ring-purple-600 
                      py-2 px-3 text-sm transition-all cursor-pointer"
                                    {...register("facultad", { required: "La facultad es obligatoria" })}
                                >
                                    <option value="" disabled>Selecciona tu facultad</option>
                                    {FACULTADES.map((facultad) => (
                                        <option key={facultad} value={facultad}>{facultad}</option>
                                    ))}
                                </select>
                                {errors.facultad && <p className="text-red-500 text-xs mt-1">{errors.facultad.message}</p>}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    inputMode="tel"
                                    placeholder="09XXXXXXXX"
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      placeholder-gray-400 dark:placeholder-gray-500 
                      focus:border-purple-600 dark:focus:border-purple-500 
                      focus:outline-none focus:ring-1 focus:ring-purple-600 
                      py-2 px-3 text-sm transition-all"
                                    {...register("telefono", {
                                        required: "El teléfono es obligatorio",
                                        pattern: {
                                            value: /^(09)\d{8}$/,
                                            message: "Debe ser un número válido ej: 09XXXXXXXX"
                                        },
                                        minLength: { value: 10, message: "El teléfono debe tener 10 dígitos" },
                                        maxLength: { value: 10, message: "El teléfono debe tener 10 dígitos" }
                                    })}
                                />
                                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                            </div>

                            {/* Cédula */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Cédula
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Ingrese su número de cédula"
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      placeholder-gray-400 dark:placeholder-gray-500 
                      focus:border-purple-600 dark:focus:border-purple-500 
                      focus:outline-none focus:ring-1 focus:ring-purple-600 
                      py-2 px-3 text-sm transition-all"
                                    {...register("cedula", {
                                        required: "La cédula es obligatoria",
                                        pattern: {
                                            value: /^\d{10}$/,
                                            message: "Debe ser un número de cédula válido"
                                        },
                                        minLength: { value: 10, message: "La cédula debe tener 10 dígitos" },
                                        maxLength: { value: 10, message: "La cédula debe tener 10 dígitos" }
                                    })}
                                />
                                {errors.cedula && <p className="text-red-500 text-xs mt-1">{errors.cedula.message}</p>}
                            </div>

                            {/* Correo */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    placeholder="nombre.apellido@epn.edu.ec"
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                      placeholder-gray-400 dark:placeholder-gray-500 
                      focus:border-purple-600 dark:focus:border-purple-500 
                      focus:outline-none focus:ring-1 focus:ring-purple-600 
                      py-2 px-3 text-sm transition-all"
                                    {...register("email", {
                                        required: "El correo es obligatorio",
                                        pattern: {
                                            value: /^[^\s@]+@epn\.edu\.ec$/,
                                            message: "Debe ser un correo institucional @epn.edu.ec"
                                        }
                                    })}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            {/* Contraseña - ocupa el ancho completo */}
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********************"
                                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                        placeholder-gray-400 dark:placeholder-gray-500 
                        focus:border-purple-600 dark:focus:border-purple-500 
                        focus:outline-none focus:ring-1 focus:ring-purple-600 
                        py-2 px-3 text-sm pr-10 transition-all"
                                        {...register("password", {
                                            required: "La contraseña es obligatoria",
                                            minLength: { value: 6, message: "Mínimo 6 caracteres" }
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 
                        hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                            </div>

                        </div>

                        {/* Botón - ancho completo */}
                        <button
                            type="submit"
                            className="py-2.5 w-full block text-center font-medium rounded-xl transition-all 
                duration-300 transform active:scale-[0.98] bg-purple-700 hover:bg-purple-800 
                dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-md hover:shadow-lg mt-5"
                            disabled={loading}
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>

                    </form>

                    {/* Link login */}
                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400">¿Ya posees una cuenta?</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-gray-600 dark:bg-gray-700 text-slate-300 border 
                dark:border-gray-600 rounded-xl hover:scale-110 duration-300 
                hover:bg-gray-900 hover:text-white"
                        >
                            Iniciar sesión
                        </Link>
                    </div>

                </div>
            </main>
        </>
    )
}