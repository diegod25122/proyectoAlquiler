export const AboutSection = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 transition-colors duration-300">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Columna texto */}
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#6B46C1]">
                        Sobre el sistema
                    </span>
                    <h2 className="font-display text-3xl font-bold text-[#0F2A4A] dark:text-white mt-2 mb-5">
                        Un solo lugar para préstamos e insumos del taller
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        EPN ToolRental centraliza el control de los activos físicos de la ESFOT —
                        equipos de laboratorio, herramientas manuales y tecnológicas — eliminando
                        las planillas en papel y dando trazabilidad real a cada préstamo.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        A la vez, resuelve la venta ágil de consumibles de electrónica y desarrollo
                        de software — resistencias, microcontroladores, componentes de prototipado —
                        para que estudiantes y docentes avancen sus proyectos de titulación sin
                        fricciones administrativas.
                    </p>
                </div>

                {/* Columna geométrica: identidad institucional sin foto stock */}
                <div className="relative h-72 md:h-80">
                    <div className="absolute inset-0 bg-[#0F2A4A] rounded-2xl rotate-2" />
                    <div className="absolute inset-0 bg-[#6B46C1]/20 rounded-2xl -rotate-3 translate-x-3 translate-y-3" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#0F2A4A]">
                        <div className="text-center px-8">
                            <p className="font-display text-5xl font-bold text-white">ESFOT</p>
                            <p className="font-mono text-xs text-gray-300 mt-2 tracking-widest">
                                ESCUELA POLITÉCNICA NACIONAL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}