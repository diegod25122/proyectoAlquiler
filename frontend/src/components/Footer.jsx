import logo from '../assets/selloEPN.png'

export const Footer = () => {
    return (
        <footer className="bg-blue-900 dark:bg-gray-950 text-white mt-12">

            <div className="container mx-auto px-6 py-12">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

                    {/* Logo y descripción */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="EPN" className="w-12 h-12"/>
                            <h2 className="text-2xl font-bold">Poli Rent</h2>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                            Sistema de gestión de herramientas para estudiantes
                            de la Escuela Politécnica Nacional.
                        </p>
                    </div>

                    {/* Sobre nosotros */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h3 className="font-bold text-lg border-b border-blue-700 pb-2 w-full text-center md:text-left">
                            Sobre Nosotros
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Somos estudiantes de la ESFOT comprometidos con 
                            facilitar el acceso a herramientas tecnológicas 
                            para toda la comunidad politécnica.
                        </p>
                    </div>

                    {/* Contacto */}
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <h3 className="font-bold text-lg border-b border-blue-700 pb-2 w-full text-center md:text-left">
                            Contacto
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>📍 Ladrón de Guevara E11-253, Quito</li>
                            <li>📧 esfot@epn.edu.ec</li>
                            <li>📞 (02) 297-6300</li>
                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t border-blue-700 dark:border-gray-700 mt-10 pt-6 
                                flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-gray-400 text-sm">
                        © 2025 Poli Rent - Escuela Politécnica Nacional
                    </p>
                    <p className="text-gray-500 text-xs">
                        Todos los derechos reservados
                    </p>
                </div>

            </div>
        </footer>
    )
}