import sendMail from "../config/nodemailer.js"


const sendMailToRegister = (userMail, token) => {

    return sendMail(
        userMail,
        "Bienvenido a POLI - RENT 🛠️👨‍🎓",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.URL_FRONTEND}/confirm/${token}">
            Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de POLI - RENT te da la más cordial bienvenida.</footer>
        `
    )
}

const sendMailToRecoveryPassword = (userMail, token) => {

    return sendMail(
        userMail,
        "Recupera tu contraseña",
        `
            <h1>POLI - RENT 🛠️👨‍🎓</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <a href="${process.env.URL_FRONTEND}/reset/${token}">
            Clic para restablecer tu contraseña
            </a>
            <hr>
            <footer>El equipo de POLI - RENT te da la más cordial bienvenida.</footer>
        `
        )
}



export {
    sendMailToRegister,
    sendMailToRecoveryPassword
}
