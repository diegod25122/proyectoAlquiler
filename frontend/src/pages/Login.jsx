import React from 'react'
import { Navbar } from '../components/Navbar'
import useDarkMode from '../hooks/useDarkMode'
import { useState } from 'react'
import logo from '../assets/selloEPN.png'
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'


export function Login() {
  const { isDarkMode } = useDarkMode()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <Navbar />
      <main
        className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[url('/images/sistemaLogin.jpg')] bg-cover bg-center relative transition-colors duration-300"
      >
        {/* Filtro para oscurecer la imagen de fondo */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0"></div>

        {/* Tarjeta de login */}
      
                {/* Tarjeta */}
                <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 
          w-full max-w-sm mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 
          transition-colors duration-300 my-8">
            
          {/* Formulario de login */}
          
                    {/* Sello, título y descripción */}
          <img src={logo} className="w-20 mx-auto mb-4" alt="Sello EPN" />
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white transition-colors">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 mb-6 block">
            Accede con tus credenciales institucionales
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Correo electrónico */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="nombre.apellido@epn.edu.ec"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-600 dark:focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-500 py-2 px-3 text-sm transition-all"
              />
            </div>

            {/* Contraseña */}
            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********************"
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-600 dark:focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-500 py-2 px-3 text-sm pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A9.956 9.956 0 0112 19c-4.418 0-8.165-2.928-9.53-7a10.005 10.005 0 0119.06 0 9.956 9.956 0 01-1.845 3.35M9.9 14.32a3 3 0 114.2-4.2m.5 3.5l3.8 3.8m-3.8-3.8L5.5 5.5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.95 0a9.96 9.96 0 0119.9 0m-19.9 0a9.96 9.96 0 0119.9 0M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botón de iniciar sesión */}
            <div className="mt-4">
              <Link
                to="/dashboard"
                className="py-2.5 w-full block text-center font-medium rounded-xl transition-all duration-300 transform active:scale-[0.98] bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
              >
                Iniciar sesión
              </Link>
            </div>
          </form>
          {/* Separador con opción de "O" */}
          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">O</p>
            <hr className="border-gray-400" />
          </div>

          {/* Botón de inicio de sesión con Google */}
          <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-black hover:text-white">
            <img className="w-5 mr-2" src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google icon" />
            Sign in with Google
          </button>

          {/* Olvidaste tu contraseña */}
          <div className="mt-5 text-xs border-b-2 py-4">
            <Link to="/forgot/id" className="underline text-sm text-gray-400 hover:text-gray-900">¿Olvidaste tu contraseña?</Link>
          </div>

          {/* Enlaces para volver o registrarse */}
          <div className="mt-3 text-sm flex justify-between items-center">
            <Link to="/" className="underline text-sm text-gray-400 hover:text-gray-900">Regresar</Link>
            <Link to="/register" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</Link>
          </div>

        </div>
      </main>
    </>
  )
}

export default Login