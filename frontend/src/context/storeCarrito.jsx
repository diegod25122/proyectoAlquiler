import { create } from "zustand"
import { persist } from "zustand/middleware"

// Carrito híbrido: dos colecciones separadas porque tienen ciclos de vida
// de negocio distintos (Reserva vs Orden de Compra). Nunca las mezclamos
// en un solo array, igual que no mezclamos los modelos en el backend.
const storeCarrito = create(
    persist(
        (set, get) => ({
            reservas: [],   // [{ productoId, nombre, imagen, materia, docente, proposito, horasSolicitadas }]
            compras: [],    // [{ productoId, nombre, imagen, precio, cantidad }]

            agregarReserva: (item) => {
                const yaExiste = get().reservas.some(r => r.productoId === item.productoId)
                if (yaExiste) return
                set((state) => ({ reservas: [...state.reservas, item] }))
            },

            quitarReserva: (productoId) => {
                set((state) => ({
                    reservas: state.reservas.filter(r => r.productoId !== productoId)
                }))
            },

            agregarCompra: (item) => {
                set((state) => {
                    const existente = state.compras.find(c => c.productoId === item.productoId)
                    if (existente) {
                        return {
                            compras: state.compras.map(c =>
                                c.productoId === item.productoId
                                    ? { ...c, cantidad: c.cantidad + (item.cantidad ?? 1) }
                                    : c
                            )
                        }
                    }
                    return { compras: [...state.compras, { ...item, cantidad: item.cantidad ?? 1 }] }
                })
            },

            quitarCompra: (productoId) => {
                set((state) => ({
                    compras: state.compras.filter(c => c.productoId !== productoId)
                }))
            },

            vaciarCarrito: () => set({ reservas: [], compras: [] }),

            totalItems: () => get().reservas.length + get().compras.reduce((acc, c) => acc + c.cantidad, 0)
        }),
        { name: "carrito-storage" }
    )
)

export default storeCarrito