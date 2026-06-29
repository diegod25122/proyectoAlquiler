import { useState, useEffect } from 'react'

const SLIDES = [
    {
        titulo: 'Equipamiento Tecnológico a tu Alcance',
        subtitulo: 'Gestión optimizada para los talleres de la ESFOT',
        // Gradiente "circuito nocturno": navy a violeta, evoca placas/laboratorio sin foto externa
        gradiente: 'from-[#0B1220] via-[#0F2A4A] to-[#27205A]'
    },
    {
        titulo: 'Reserva tus Materiales en Segundos',
        subtitulo: 'Planifica tus proyectos académicos y de titulación de forma ágil',
        gradiente: 'from-[#0B1220] via-[#1E4D8C] to-[#0F2A4A]'
    },
    {
        titulo: 'Abastecimiento de Consumibles Autorizados',
        subtitulo: 'Compra de componentes electrónicos directamente desde la plataforma',
        gradiente: 'from-[#0B1220] via-[#14532D] to-[#0F2A4A]'
    }
]

export const HeroCarousel = () => {
    const [indice, setIndice] = useState(0)

    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndice((prev) => (prev + 1) % SLIDES.length)
        }, 5000)
        return () => clearInterval(intervalo)
    }, [])

    return (
        <section className="relative w-full h-[420px] md:h-[480px] overflow-hidden">
            {SLIDES.map((slide, i) => (
                <div
                    key={slide.titulo}
                    className={`absolute inset-0 bg-gradient-to-br ${slide.gradiente}
                                transition-opacity duration-700 ease-in-out
                                ${i === indice ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Textura sutil tipo "circuito" — reemplazo deliberado de foto stock */}
                    <div className="absolute inset-0 opacity-[0.07]"
                         style={{
                             backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
                             backgroundSize: '48px 48px'
                         }} />

                    <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                        <h1 className="font-display text-3xl md:text-5xl font-bold text-white max-w-3xl leading-tight">
                            {slide.titulo}
                        </h1>
                        <p className="mt-4 text-gray-200 text-base md:text-lg max-w-xl">
                            {slide.subtitulo}
                        </p>
                    </div>
                </div>
            ))}

            {/* Indicadores */}
            <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndice(i)}
                        aria-label={`Ir a la diapositiva ${i + 1}`}
                        className={`h-1.5 rounded-full transition-all ${i === indice ? 'w-8 bg-white' : 'w-3 bg-white/40'}`}
                    />
                ))}
            </div>
        </section>
    )
}