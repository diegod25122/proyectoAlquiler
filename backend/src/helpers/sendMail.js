import sendMail from "../config/nodemailer.js";

const sendMailToRegister = async (userMail, token) => {
    const frontendUrl = process.env.URL_FRONTEND || process.env.PROD_URL_FRONTEND
    return await sendMail(
        userMail,
        "Bienvenido a POLI - RENT 🛠️👨‍🎓",
        `
            <h1>Confirma tu cuenta</h1>
            <p>Hola, haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${frontendUrl}/confirm/${token}">
            Confirmar cuenta
            </a>
            <hr>
            <footer>El equipo de POLI - RENT te da la más cordial bienvenida.</footer>
        `
    );
};

const sendMailToRecoveryPassword = async(userMail, token) => {
    const frontendUrl = process.env.URL_FRONTEND || process.env.PROD_URL_FRONTEND
    return await sendMail(
        userMail,
        "Recupera tu contraseña",
        `
            <h1>POLI - RENT 🛠️👨‍🎓</h1>
            <p>Has solicitado restablecer tu contraseña.</p>
            <a href="${frontendUrl}/reset/${token}">
            Clic para restablecer tu contraseña
            </a>
            <hr>
            <footer>El equipo de POLI - RENT te da la más cordial bienvenida.</footer>
        `
    );
};

export {
    sendMailToRegister,
    sendMailToRecoveryPassword
};