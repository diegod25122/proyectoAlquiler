import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBriefcase, FiClock, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import heroTools from '../../assets/hero-tools.png'

const SLIDES = [
    {
        id: 1,
        tag: 'ESFOT · Taller Estudiantil',
        title: 'Herramientas y consumibles,',
        titleHighlight: 'sin planillas de papel',
        desc: 'Préstamos de equipo y compra de componentes electrónicos, todo desde una sola plataforma académica.',
        image: heroTools
    },
    {
        id: 2,
        tag: 'Laboratorio de Electrónica y Redes',
        title: 'Equipos de Alta Precisión',
        titleHighlight: 'a tu disposición',
        desc: 'Reserva osciloscopios, multímetros y generadores de señales para tus prácticas y proyectos integradores.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 3,
        tag: 'Gestión Digital ESFOT',
        title: 'Control de Inventario y Reservas',
        titleHighlight: '100% Automatizado',
        desc: 'Consulta disponibilidad en tiempo real y recibe confirmaciones de tus préstamos al instante.',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80'
    }
]

const STATS = [
    { icon: FiBriefcase, value: '100+', label: 'HERRAMIENTAS', bg: 'bg-[#2E4CDB]' },
    { icon: FiClock,     value: '24/7',  label: 'DISPONIBLE',   bg: 'bg-[#0E9F6E]' },
    { icon: FiMapPin,    value: 'ESFOT', label: 'EPN',          bg: 'bg-[#C77D1E]' },
]

export const HeroCarousel = () => {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % SLIDES.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    const nextSlide = () => setCurrent((current + 1) % SLIDES.length)
    const prevSlide = () => setCurrent((current - 1 + SLIDES.length) % SLIDES.length)

    const scrollCatalogo = () =>
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })

    const activeSlide = SLIDES[current]

    return (
        <section className="relative overflow-hidden bg-[#0B1A3A] min-h-[460px] flex items-center">
            {/* Imágenes del carrusel con efecto fade */}
            {SLIDES.map((slide, index) => (
                <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                />
            ))}

            {/* Degradado: navy opaco a la izquierda */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A3A] via-[#0B1A3A]/85 to-transparent z-10" />

            {/* Flechas de navegación */}
            <button
                onClick={prevSlide}
                aria-label="Diapositiva anterior"
                className="absolute left-4 z-30 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/60 hover:text-white transition-all hidden sm:flex"
            >
                <FiChevronLeft size={22} />
            </button>

            <button
                onClick={nextSlide}
                aria-label="Siguiente diapositiva"
                className="absolute right-4 z-30 p-2 rounded-full bg-black/30 text-white/80 hover:bg-black/60 hover:text-white transition-all hidden sm:flex"
            >
                <FiChevronRight size={22} />
            </button>

            {/* Contenido principal */}
            <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 px-8 md:px-14 py-16 max-w-7xl mx-auto items-center w-full">
                <div>
                    <span className="inline-block text-[11px] font-medium tracking-widest text-white bg-white/10 px-3 py-1 rounded-full mb-5 uppercase backdrop-blur-sm">
                        {activeSlide.tag}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 transition-all duration-300">
                        {activeSlide.title}<br />
                        <span className="text-[#4FA6FF]">{activeSlide.titleHighlight}</span>
                    </h1>
                    <p className="text-white/80 text-sm md:text-base max-w-md mb-8">
                        {activeSlide.desc}
                    </p>

                    <div className="flex gap-3 mb-10 flex-wrap">
                        <button
                            onClick={scrollCatalogo}
                            className="px-5 py-2.5 rounded-lg bg-[#1E5FD9] text-white text-sm font-medium hover:bg-[#1A50BA] transition flex items-center gap-2 shadow-lg shadow-[#1E5FD9]/30"
                        >
                            Ver catálogo
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition flex items-center gap-2 backdrop-blur-sm"
                        >
                            Crear cuenta
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3 flex-wrap">
                        {STATS.map(({ icon: Icon, value, label, bg }) => (
                            <div key={label} className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2.5">
                                <div className={`w-8 h-8 rounded-md ${bg} flex items-center justify-center text-white flex-shrink-0`}>
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold leading-none">{value}</p>
                                    <p className="text-white/60 text-[10px] mt-1 tracking-wide">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block" />
            </div>

            {/* Indicadores / Puntos */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Ir a diapositiva ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                            idx === current ? 'w-8 bg-[#4FA6FF]' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}

