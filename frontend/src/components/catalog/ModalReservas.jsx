// components/catalog/ModalConfirmarCompra.jsx

const ModalConfirmarCompra = ({ producto, onConfirmar, onCerrar }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">Añadir al carrito</p>
                    <button
                        onClick={onCerrar}
                        className="text-gray-400 hover:text-gray-600 text-lg font-bold w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido */}
                <div className="px-5 py-5">
                    <div className="flex items-center gap-4 mb-5">
                        <img
                            src={producto.imagen || 'https://cdn-icons-png.flaticon.com/512/2618/2618671.png'}
                            alt={producto.nombre}
                            className="w-16 h-16 object-contain rounded-xl bg-gray-50 dark:bg-gray-800"
                        />
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{producto.nombre}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{producto.categoria}</p>
                            <p className="text-green-600 dark:text-green-400 font-bold text-lg mt-1">
                                ${producto.precio?.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                        ¿Deseas añadir <span className="font-semibold text-gray-800 dark:text-white">{producto.nombre}</span> a tu carrito?
                        Podrás revisar y pagar desde el ícono del carrito en la barra superior.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCerrar}
                            className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirmar}
                            className="flex-1 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                        >
                            🛒 Sí, añadir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalConfirmarCompra