import { useState } from 'react'
import logo from '../assets/selloEPN.png'
import { toast } from 'react-toastify'

export const Footer = () => {
    const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        // ⚠️ Simulado por ahora: no hay endpoint de soporte en el backend todavía.
        // Cuando exista (ej. POST /soporte), reemplaza esto por el axios.post real.
        toast.success("Mensaje enviado. Te contactaremos pronto.")
        setForm({ nombre: '', correo: '', mensaje: '' })
    }

    return (
        <footer className="bg-gray-950 text-gray-300 py-12 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Columna 1: Información institucional */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <img src={logo} alt="EPN" className="w-10" />
                        <h2 className="font-display text-xl font-bold text-white">EPN ToolRental</h2>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li>🕗 Horario de atención: Lunes a Viernes, 08:00 – 16:00</li>
                        <li>📍 Edificio N° 24, Planta Baja — Taller ESFOT</li>
                        <li>📧 soporte.esfot@epn.edu.ec</li>
                    </ul>
                    <p className="text-gray-500 text-xs mt-6">
                        © {new Date().getFullYear()} EPN ToolRental — Escuela Politécnica Nacional
                    </p>
                </div>

                {/* Columna 2: Formulario rápido de soporte */}
                <div>
                    <h3 className="font-display text-lg font-bold text-white mb-4">
                        ¿Necesitas ayuda?
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm
                                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                        />
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo institucional"
                            value={form.correo}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm
                                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                        />
                        <textarea
                            name="mensaje"
                            rows={3}
                            placeholder="Mensaje"
                            value={form.mensaje}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm
                                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]"
                        />
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-[#6B46C1] text-white rounded-lg text-sm font-semibold
                                       hover:bg-[#5b3aa8] transition-colors"
                        >
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    )
}