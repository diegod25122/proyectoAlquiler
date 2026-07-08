import Reserva from '../models/Reserva.js';
import mongoose from 'mongoose';

const registrarReserva= async (req, res) => {
    try{
    const {usuario,producto} = req.body;

    //validar la existencia de campos vacios
    if(Object.values(req.body).includes("")) 
        return res.status(400).json({msg:"Debes llenar todos los campos"})

    //validar el id del usuario
    if(!mongoose.Types.ObjectId.isValid(usuario))
        return res.status(404).json({ msg: `No existe el Usuario ${usuario}` });

    //validar el id del producto
    if(!mongoose.Types.ObjectId.isValid(producto))
        return res.status(404).json({ msg: `No existe el producto ${producto}` });

    // registrar la reserva

    const reserva =  await Reserva.create(req.body);
    res.status(201).json({msg:"Reserva registrada correctamente", reserva})
    }catch(error){
        console.error(error);
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
};export {
    registrarReserva
};