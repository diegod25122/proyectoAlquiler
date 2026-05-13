import Usuario from "../models/Usuario.js";

const registro = async (req,res)=>{

    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Usuario.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        const nuevoUsuario = new Usuario(req.body)
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
        await nuevoUsuario.save()
      res.status(200).json({msg:"Usuario registrado exitosamente ✅"})

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}


export {
    registro
}