import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAILTRAP,      // smtp-relay.brevo.com ✅
  port: Number(process.env.PORT_MAILTRAP), // 465
  secure: true,                          // obligatorio con 465
  auth: {
    user: process.env.USER_MAILTRAP,    // verificar que sea el email real de Brevo
    pass: process.env.PASS_MAILTRAP,    // la API key de Brevo
  }
})
const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"POLI - RENT" <acdad0001@smtp-brevo.com>',
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