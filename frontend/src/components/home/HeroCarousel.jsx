import { useNavigate } from 'react-router-dom'
import { FiBriefcase, FiClock, FiMapPin } from 'react-icons/fi'
import selloEPN from '../../assets/selloEPN.png'

const STATS = [
    { icon: FiBriefcase, value: '100+', label: 'HERRAMIENTAS', bg: 'bg-[#2E4CDB]' },
    { icon: FiClock,     value: '24/7',  label: 'DISPONIBLE',   bg: 'bg-[#0E9F6E]' },
    { icon: FiMapPin,    value: 'ESFOT', label: 'EPN',          bg: 'bg-[#C77D1E]' },
]

export const HeroCarousel = () => {
    const navigate = useNavigate()

    const scrollCatalogo = () =>
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })

    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0B1A3A] to-[#123B8F]">
            {/* Textura de puntos sutil */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 px-8 md:px-14 py-16 max-w-7xl mx-auto items-center">
                {/* Columna izquierda */}
                <div>
                    <span className="inline-block text-[11px] font-medium tracking-widest text-white bg-white/10 px-3 py-1 rounded-full mb-5 uppercase">
                        ESFOT · Taller estudiantil
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                        Herramientas y consumibles,{' '}
                        <br className="hidden md:block" />
                        <span className="text-[#4FA6FF]">sin planillas de papel</span>
                    </h1>
                    <p className="text-white/70 text-sm md:text-base max-w-md mb-8">
                        Préstamos de equipo y compra de componentes electrónicos,
                        todo desde una sola plataforma académica.
                    </p>

                    <div className="flex gap-3 mb-10 flex-wrap">
                        <button
                            onClick={scrollCatalogo}
                            className="px-5 py-2.5 rounded-lg bg-[#1E5FD9] text-white text-sm font-medium hover:bg-[#1A50BA] transition flex items-center gap-2"
                        >
                            Ver catálogo
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition flex items-center gap-2"
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
                            <div key={label} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5">
                                <div className={`w-8 h-8 rounded-md ${bg} flex items-center justify-center text-white flex-shrink-0`}>
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold leading-none">{value}</p>
                                    <p className="text-white/50 text-[10px] mt-1 tracking-wide">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Columna derecha — visual */}
                <div className="hidden md:flex h-72 rounded-2xl bg-white/5 border border-white/10 items-center justify-center">
                    <div className="text-center">
                        <img src={selloEPN} alt="Sello EPN" className="w-32 opacity-80 mx-auto mb-4" />
                        <p className="text-white/40 text-xs tracking-widest uppercase">Escuela Politécnica Nacional</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
