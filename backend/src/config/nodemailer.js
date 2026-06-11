import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAILTRAP,
  port: Number(process.env.PORT_MAILTRAP),
  secure: true, // ← true para 465
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
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