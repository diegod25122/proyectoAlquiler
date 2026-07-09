/* eslint-disable react/prop-types */
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { toast } from 'react-toastify'
import useStorePrestamos from '../../context/storePrestamos'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

function PaymentForm({ listarPrestamos }) {
    const stripe = useStripe()
    const elements = useElements()
    const [loading, setLoading] = useState(false)
    const { prestamoSeleccionado, payPrestamo, toggleModal } = useStorePrestamos()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return
        setLoading(true)

        const cardElement = elements.getElement(CardElement)
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        const url = `${import.meta.env.VITE_BACKEND_URL}/prestamo/pago`
        const resultado = await payPrestamo(url, {
            paymentMethodId: paymentMethod.id,
            prestamoId: prestamoSeleccionado._id,
            cantidad: prestamoSeleccionado.precio * 100,
            motivo: `Pago de préstamo - ${prestamoSeleccionado.herramienta?.nombre}`
        })

        if (resultado?.success) listarPrestamos()
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-semibold text-gray-200 text-left">Detalle</label>
                <ul className="text-gray-400 bg-gray-700 p-2 rounded-md text-left">
                    <li>
                        Herramienta: <span className="text-white">{prestamoSeleccionado?.herramienta?.nombre}</span>
                    </li>
                    <li>
                        Estudiante: <span className="text-white">{prestamoSeleccionado?.usuario?.nombre} {prestamoSeleccionado?.usuario?.apellido}</span>
                    </li>
                    <li>
                        Período: <span className="text-white">
                            {new Date(prestamoSeleccionado?.fechaInicio).toLocaleDateString()} - {new Date(prestamoSeleccionado?.fechaFin).toLocaleDateString()}
                        </span>
                    </li>
                </ul>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-200 text-left">Precio</label>
                <p className="text-green-400 bg-gray-700 p-2 rounded-md font-bold text-left">
                    $ {prestamoSeleccionado?.precio}
                </p>
            </div>

            <label className="block text-sm font-semibold text-gray-200 text-left m-0">Tarjeta de crédito</label>
            <div className="p-3 border border-gray-600 rounded-lg bg-white">
                <CardElement options={{ style: { base: { fontSize: '16px', color: '#333' } } }} />
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-800 text-white transition duration-300 disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : 'Pagar'}
                </button>
                <button
                    type="button"
                    onClick={() => toggleModal('pago')}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-800 text-white transition duration-300"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}

function ModalPayment({ listarPrestamos }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-y-auto p-6 max-w-lg w-full border border-gray-700 relative">
                <p className="text-white font-bold text-xl mb-4">Pagar Préstamo</p>
                <Elements stripe={stripePromise}>
                    <PaymentForm listarPrestamos={listarPrestamos} />
                </Elements>
            </div>
        </div>
    )
}

export default ModalPayment
