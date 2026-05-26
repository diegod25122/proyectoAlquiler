// components/Footer.jsx
import { Link } from 'react-router-dom'
import logo from '../assets/selloEPN.png'

export const Footer = () => {
    return (
        <footer className="bg-blue-900 dark:bg-gray-900 text-white mt-12">

            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Logo y descripción */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src={logo} alt="EPN" className="w-10 h-10"/>
                            <h2 className="text-xl font-bold">Poli Rent</h2>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Sistema de gestión de herramientas para estudiantes 
                            de la Escuela Politécnica Nacional.
                        </p>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contacto</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>📍 Ladrón de Guevara E11-253, Quito</li>
                            <li>📧 esfot@epn.edu.ec</li>
                            <li>📞 (02) 297-6300</li>
                        </ul>
                    </div>

                </div>

                {/* Línea divisora y copyright */}
                <div className="border-t border-blue-800 dark:border-gray-700 mt-8 pt-6 
                                text-center text-gray-400 text-sm">
                    <p>© 2025 Poli Rent - Escuela Politécnica Nacional. Todos los derechos reservados.</p>
                </div>
            </div>

        </footer>
    )
}