import { useNavigate } from 'react-router-dom'

export const HeroCarousel = () => {
    const navigate = useNavigate()

    const scrollCatalogo = () => {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="text-center px-8 py-20 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-colors">
            <p className="text-xs tracking-widest text-gray-400 uppercase mb-4">
                ESFOT · Taller estudiantil
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white max-w-xl mx-auto leading-snug">
                Herramientas y consumibles,{' '}
                <span className="text-gray-500 dark:text-gray-400 font-normal">sin planillas de papel</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-4 mb-8">
                Préstamos de equipo y compra de componentes electrónicos, todo desde una sola plataforma académica.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
                <button
                    onClick={scrollCatalogo}
                    className="px-5 py-2.5 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition"
                >
                    Ver catálogo
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="px-5 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                    Crear cuenta
                </button>
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-10 mt-14 text-center">
                {[
                    { value: '100+', label: 'Herramientas' },
                    { value: '24/7', label: 'Disponible' },
                    { value: 'ESFOT', label: 'EPN' },
                ].map(s => (
                    <div key={s.label}>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
