import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
<<<<<<< HEAD
  host: process.env.HOST_MAILTRAP, 
  port: 587,                     
  secure: false,                 
  auth: {
    user: process.env.USER_MAILTRAP, 
    pass: process.env.PASS_MAILTRAP, 
  },
  tls: {
    rejectUnauthorized: false     
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Error de conexión con Gmail:", error);
  } else {
    console.log("✅ Servidor listo para enviar correos desde Gmail");
  }
});
/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
=======
    host: process.env.HOST_MAILTRAP,
    port: Number(process.env.PORT_MAILTRAP),
    secure: false,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
})
>>>>>>> fd82d7fc6b16584fc883651dcfbd637b5db86339

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