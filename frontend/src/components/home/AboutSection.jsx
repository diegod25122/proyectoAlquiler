import { FiShield, FiBriefcase, FiPackage, FiMessageCircle } from 'react-icons/fi'

export const AboutSection = () => {
    return (
        <section id="about" className="max-w-7xl mx-auto px-8 md:px-14 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Columna izquierda */}
            <div>
                <p className="text-xs font-semibold text-[#1E5FD9] tracking-widest uppercase mb-3">
                    Sobre el sistema
                </p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5 leading-snug">
                    Un solo lugar para préstamos e insumos del taller
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    PoliRent centraliza el control de los activos físicos de la ESFOT —
                    equipos de laboratorio, herramientas manuales y tecnológicas — eliminando
                    las planillas en papel y dando trazabilidad real a cada préstamo.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    Resuelve también la venta ágil de consumibles de electrónica para que
                    estudiantes y docentes avancen sus proyectos sin fricciones administrativas.
                </p>

                {/* Feature highlight */}
                <div className="flex items-start gap-3 bg-blue-50 dark:bg-[#1E5FD9]/10 border border-blue-100 dark:border-[#1E5FD9]/20 rounded-xl p-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1E5FD9]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiShield className="text-[#1E5FD9]" size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Seguridad, trazabilidad y control total</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cada préstamo registrado, cada equipo cuidado.</p>
                    </div>
                </div>
            </div>

            {/* Columna derecha — panel ESFOT */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">ESFOT</h3>
                <p className="text-xs font-semibold text-[#1E5FD9] tracking-widest uppercase mt-1 mb-8">
                    Escuela Politécnica Nacional
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: FiBriefcase,     label: 'Préstamos',  sub: 'de herramientas' },
                        { icon: FiPackage,       label: 'Consumibles', sub: 'con Stripe' },
                        { icon: FiMessageCircle, label: 'Chat IA',    sub: 'PoliBot' },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-[#1E5FD9]/30 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-[#1E5FD9]/10 flex items-center justify-center mx-auto mb-2">
                                <Icon className="text-[#1E5FD9]" size={16} />
                            </div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
