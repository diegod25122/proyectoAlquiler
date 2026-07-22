// pages/Carrito.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import { toast, ToastContainer } from "react-toastify"
import { MdDelete, MdShoppingCart, MdLock } from "react-icons/md"
import storeCarrito from "../context/storeCarrito"
import storeOrden from "../context/storeOrden"

// Inicializar Stripe con la clave pública (nunca uses la privada aquí)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// ─── Formulario de pago (debe estar dentro de <Elements>) ────────
const FormularioPago = ({ items, total, onExito }) => {
    const stripe = useStripe()
    const elements = useElements()
    const { crearOrden, confirmarPago } = storeOrden()
    const [procesando, setProcesando] = useState(false)

    const handlePagar = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setProcesando(true)
        try {
            // Paso 1: Crear la orden en el backend → recibimos clientSecret
            const { clientSecret, ordenId } = await crearOrden(
                items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad }))
            )

            // Paso 2: Confirmar el pago con Stripe.js
            // Los datos de tarjeta NUNCA pasan por tu servidor — van directo a Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            })

            if (error) {
                toast.error(error.message || "Error al procesar el pago")
                return
            }

            const estadosExitosos = ["succeeded", "processing", "requires_capture"]
            const debeSimularExito = import.meta.env.DEV && paymentIntent?.status === "requires_payment_method"

            if (estadosExitosos.includes(paymentIntent?.status) || debeSimularExito) {
                // Paso 3: Notificar al backend que el pago fue exitoso
                await confirmarPago(ordenId, { simularPagoExitoso: debeSimularExito })
                onExito()
            } else {
                toast.error("El pago no pudo completarse. Intenta nuevamente con otra tarjeta o verifica tus datos.")
            }

        } catch {
            // El store ya muestra el toast de error
        } finally {
            setProcesando(false)
        }
    }

    return (
        <form onSubmit={handlePagar} className="space-y-4">
            {/* Stripe Card Element */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Datos de tarjeta
                </label>
                <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "14px",
                                    color: "#1f2937",
                                    "::placeholder": { color: "#9ca3af" }
                                },
                                invalid: { color: "#ef4444" }
                            }
                        }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MdLock size={12} /> Pago seguro procesado por Stripe
                </p>
            </div>

            {/* Total y botón pagar */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <span>Total a pagar</span>
                    <span className="text-green-600">${total.toFixed(2)} USD</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={!stripe || procesando}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {procesando ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Procesando pago...</>
                ) : (
                    <><MdLock /> Pagar ${total.toFixed(2)} USD</>
                )}
            </button>
        </form>
    )
}

// ─── Página principal del Carrito ─────────────────────────────────
const Carrito = () => {
    const navigate = useNavigate()
    const { compras, quitarCompra, vaciarCarrito } = storeCarrito()
    const [pagoExitoso, setPagoExitoso] = useState(false)

    const total = compras.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

    const handleExito = () => {
        vaciarCarrito()
        setPagoExitoso(true)
    }

    // Vista de éxito post-pago
    if (pagoExitoso) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Pago exitoso!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Tu orden fue registrada. Acércate al taller con tu cédula para retirar los materiales.
                </p>
                <button
                    onClick={() => navigate("/dashboard/mis-ordenes")}
                    className="px-6 py-2.5 bg-[#0F2A4A] text-white rounded-xl font-semibold text-sm hover:bg-[#1E4D8C] transition-colors"
                >
                    Ver mis órdenes
                </button>
            </div>
        </div>
    )

    // Carrito vacío
    if (compras.length === 0) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
            <div className="text-center max-w-sm">
                <MdShoppingCart className="text-6xl text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Agrega consumibles desde el catálogo
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2.5 bg-[#0F2A4A] text-white rounded-xl font-semibold text-sm hover:bg-[#1E4D8C] transition-colors"
                >
                    Ir al catálogo
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
            <ToastContainer />
            <div className="max-w-4xl mx-auto">

                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-3 flex items-center gap-1"
                    >
                        ← Volver
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MdShoppingCart /> Carrito de compra
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Revisa tus consumibles y procede al pago
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Lista de ítems */}
                    <div className="lg:col-span-3 space-y-3">
                        {compras.map((item) => (
                            <div
                                key={item.productoId}
                                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4"
                            >
                                <img
                                    src={item.imagen || "https://cdn-icons-png.flaticon.com/512/2618/2618671.png"}
                                    alt={item.nombre}
                                    className="w-16 h-16 object-contain rounded-lg bg-gray-50 dark:bg-gray-800"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.nombre}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Cantidad: {item.cantidad}</p>
                                    <p className="text-green-600 font-semibold text-sm mt-1">
                                        ${(item.precio * item.cantidad).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => quitarCompra(item.productoId)}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                    title="Quitar del carrito"
                                >
                                    <MdDelete size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Panel de pago */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 sticky top-20">
                            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Resumen del pago</h2>

                            {/* Stripe Elements envuelve el formulario de pago */}
                            <Elements stripe={stripePromise}>
                                <FormularioPago
                                    items={compras}
                                    total={Math.round(total * 100) / 100}
                                    onExito={handleExito}
                                />
                            </Elements>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carrito