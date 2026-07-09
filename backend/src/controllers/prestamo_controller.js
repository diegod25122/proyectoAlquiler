import Prestamo from '../models/Prestamo.js'
import Usuario from '../models/Usuario.js'
import mongoose from 'mongoose'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY)

const registrarPrestamo = async (req, res) => {
    try {
        const { herramienta, usuario } = req.body
        if (Object.values(req.body).includes(''))
            return res.status(400).json({ msg: 'Debes llenar todos los campos' })

        if (!mongoose.Types.ObjectId.isValid(herramienta))
            return res.status(404).json({ msg: `No existe la herramienta con ID ${herramienta}` })

        if (!mongoose.Types.ObjectId.isValid(usuario))
            return res.status(404).json({ msg: `No existe el usuario con ID ${usuario}` })

        await Prestamo.create(req.body)
        res.status(201).json({ msg: 'Préstamo registrado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarPrestamosPorHerramienta = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ msg: 'ID de herramienta inválido' })

        const prestamos = await Prestamo.find({ herramienta: id })
            .populate('usuario', 'nombre apellido email cedula')
            .populate('herramienta', 'nombre codigoInventario')
            .select('-__v')

        res.status(200).json(prestamos)
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const eliminarPrestamo = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).json({ msg: `No existe el préstamo con ID ${id}` })

        await Prestamo.findByIdAndDelete(id)
        res.status(200).json({ msg: 'Préstamo eliminado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const pagarPrestamo = async (req, res) => {
    try {
        const { paymentMethodId, prestamoId, cantidad, motivo } = req.body

        if (Object.values(req.body).includes(''))
            return res.status(400).json({ msg: 'Debes llenar todos los campos' })

        const prestamo = await Prestamo.findById(prestamoId)
        if (!prestamo)
            return res.status(404).json({ msg: `No existe el préstamo con ID ${prestamoId}` })

        if (prestamo.estadoPago === 'Pagado')
            return res.status(400).json({ msg: 'El préstamo ya se encuentra pagado' })

        if (!paymentMethodId)
            return res.status(400).json({ msg: 'Debes ingresar un método de pago' })

        const usuario = await Usuario.findById(prestamo.usuario)

        const clienteStripe = await stripe.customers.create({
            name: `${usuario.nombre} ${usuario.apellido}`,
            email: usuario.email
        })

        const paymentIntent = await stripe.paymentIntents.create({
            amount: cantidad,
            currency: 'usd',
            description: motivo,
            payment_method: paymentMethodId,
            confirm: true,
            customer: clienteStripe.id,
            receipt_email: usuario.email,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        })

        if (paymentIntent.status === 'succeeded') {
            await Prestamo.findByIdAndUpdate(prestamoId, { estadoPago: 'Pagado' })
            return res.status(200).json({ msg: 'Pago realizado correctamente :D' })
        } else {
            return res.status(400).json({ msg: 'El pago no se realizó correctamente', paymentIntent })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export { registrarPrestamo, listarPrestamosPorHerramienta, eliminarPrestamo, pagarPrestamo }
