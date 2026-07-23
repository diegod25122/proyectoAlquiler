// components/dashboard/ModalRechazo.jsx
const ModalRechazo = ({ onConfirmar, onCerrar }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 text-xl">
                        ✕
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Rechazar reserva</h3>
                        <p className="text-xs text-gray-400">Indica el motivo para notificar al estudiante</p>
                    </div>
                </div>

                <textarea
                    id="motivo-rechazo"
                    rows={3}
                    placeholder="Ej: Stock insuficiente, documentación incompleta..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onCerrar}
                        className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            const motivo = document.getElementById("motivo-rechazo").value.trim()
                            onConfirmar(motivo || "No especificado")
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                        Confirmar rechazo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalRechazo