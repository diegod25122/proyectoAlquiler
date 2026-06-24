import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  }
})

transporter.verify((error) => {
  if (error) {
    console.error("❌ Conexión SMTP fallida al iniciar:", error.message)
  } else {
    console.log("✅ Conexión SMTP verificada, lista para enviar correos")
  }
})

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"POLI - RENT" <${process.env.USER_MAILTRAP}>`,
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)
        return info
    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
        throw error
    }
}

export default sendMail