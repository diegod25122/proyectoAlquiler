import {Schema, model} from 'mongoose';
import bycrypt from 'bcryptjs';

const UsuarioSchema= new Schema({
    nombre:{
        type:String,
        required:true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },
    facultad:{
        type: String,
        required: true,
        trim: true
    },
    telefono:{
        type: Number,
        required: true,
        trim: true
    },
    cedula:{
        type: Number,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
        token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    rol:{
        type:String,
        default:"veterinario"
    }

},{
    timestamps:true
})
//Método para cifrar el password
veterinarioSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


// Método para verificar si el password es el mismo de la BDD
veterinarioSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para crear un token 
veterinarioSchema.methods.createToken= function(){
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}


export default model('Usuario', UsuarioSchema)