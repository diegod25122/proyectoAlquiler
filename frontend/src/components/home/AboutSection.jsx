export const AboutSection = () => {
    return (
        <section id="about" className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 py-16 px-8 transition-colors">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Texto */}
                <div>
                    <p className="text-xs tracking-widest text-gray-400 uppercase mb-3">Sobre el sistema</p>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-5 leading-snug">
                        Un solo lugar para préstamos e insumos del taller
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                        PoliRent centraliza el control de los activos físicos de la ESFOT —
                        equipos de laboratorio, herramientas manuales y tecnológicas — eliminando
                        las planillas en papel y dando trazabilidad real a cada préstamo.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        Resuelve también la venta ágil de consumibles de electrónica —
                        resistencias, microcontroladores, componentes de prototipado —
                        para que estudiantes y docentes avancen sin fricciones administrativas.
                    </p>
                </div>

                {/* Panel derecho — identidad institucional */}
                <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-10 text-center">
                    <p className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">ESFOT</p>
                    <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">Escuela Politécnica Nacional</p>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        {[
                            { label: 'Préstamos', desc: 'de herramientas' },
                            { label: 'Consumibles', desc: 'con Stripe' },
                            { label: 'Chat IA', desc: 'PoliBot' },
                        ].map(item => (
                            <div key={item.label} className="border border-gray-100 dark:border-gray-800 rounded-lg p-3">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.label}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
