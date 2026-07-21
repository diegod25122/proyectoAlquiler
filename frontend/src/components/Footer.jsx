import { useState } from 'react'
import logo from '../assets/selloEPN.png'
import { toast } from 'react-toastify'
import { FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi'

export const Footer = () => {
    const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })
    const [enviando, setEnviando] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        setEnviando(true)
        setTimeout(() => {
            toast.success("Mensaje enviado a la administración del laboratorio.")
            setForm({ nombre: '', correo: '', mensaje: '' })
            setEnviando(false)
        }, 800)
    }

    return (
        <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-8 md:px-14 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                {/* Columna 1: Info Institucional */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="EPN" className="w-10 h-10 object-contain" />
                        <div>
                            <h2 className="font-bold text-lg text-white tracking-wide">Poli Rent · ESFOT</h2>
                            <p className="text-xs text-purple-400 font-medium">Escuela Politécnica Nacional</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Sistema integral para préstamo de equipos de precisión y venta de componentes electrónicos de laboratorio.
                    </p>

                    <div className="space-y-2.5 pt-2 text-xs text-gray-400">
                        <div className="flex items-center gap-2.5">
                            <FiClock className="text-purple-400 flex-shrink-0" />
                            <span>Lunes a Viernes: 08:00 – 16:00</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FiMapPin className="text-purple-400 flex-shrink-0" />
                            <span>Edificio N° 24, Planta Baja — Taller ESFOT</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <FiMail className="text-purple-400 flex-shrink-0" />
                            <span>soporte.esfot@epn.edu.ec</span>
                        </div>
                    </div>
                </div>

                {/* Columna 2: Enlaces Rápidos Estudiantiles */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">
                        Accesos Rápidos
                    </h3>
                    <ul className="space-y-2.5 text-xs text-gray-400">
                        <li>
                            <a href="#catalogo" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                                • Catálogo de Equipos
                            </a>
                        </li>
                        <li>
                            <a href="/login" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                                • Iniciar Sesión en Sistema
                            </a>
                        </li>
                        <li>
                            <a href="/register" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                                • Registro de Estudiantes
                            </a>
                        </li>
                        <li>
                            <a href="https://esfot.epn.edu.ec" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                                • Sitio Oficial ESFOT EPN
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Columna 3: Soporte Rápido */}
                <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-800/80 backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-white mb-1">¿Dudas sobre tus prácticas?</h3>
                    <p className="text-xs text-gray-400 mb-4">Envía una consulta al encargado de laboratorio.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Tu nombre completo"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <input
                            type="email"
                            name="correo"
                            placeholder="correo.estudiantil@epn.edu.ec"
                            value={form.correo}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <textarea
                            name="mensaje"
                            rows={2}
                            placeholder="Describa su inquietud o herramienta requerida..."
                            value={form.mensaje}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-gray-950 border border-gray-800 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        />
                        <button
                            type="submit"
                            disabled={enviando}
                            className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <FiSend size={12} />
                            {enviando ? "Enviando..." : "Enviar Mensaje"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-8 md:px-14 pt-6 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-3">
                <p>© {new Date().getFullYear()} Poli Rent — Taller ESFOT Escuela Politécnica Nacional</p>
                <p className="flex items-center gap-1">
                    <FiCheckCircle className="text-green-500" /> Plataforma Estudiantil Híbrida
                </p>
            </div>
        </footer>
    )
}