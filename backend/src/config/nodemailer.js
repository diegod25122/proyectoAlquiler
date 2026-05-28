import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()



const transporter = nodemailer.createTransport({
 
  host: "74.125.142.108", 
  port: process.env.PORT_MAILTRAP, 
  secure: false,                   
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  },
})
/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */

const sendMail = async (to, subject, html) => {

    try {
        const info = await transporter.sendMail({
            from: '"POLI - RENT" <admin@polirent.com>',
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)

    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
    }
}

export default sendMail