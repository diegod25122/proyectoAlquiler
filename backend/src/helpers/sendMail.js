import sendMail from "../config/brevo.js";

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

const sendMailRechazoReserva = async (userMail, nombreUsuario, nombreProducto, motivo) => {
    return await sendMail(
        userMail,
        "Tu reserva ha sido rechazada — Poli Rent",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="background: linear-gradient(135deg, #6d5bd0, #4c63d2); padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 22px;">🔧 Poli Rent — ESFOT</h1>
            </div>
            <div style="padding: 24px;">
                <p style="color: #374151; font-size: 15px;">Estimado/a <strong>${nombreUsuario}</strong>,</p>
                <p style="color: #374151;">Tu solicitud de reserva para el producto <strong>${nombreProducto}</strong> ha sido <span style="color: #dc2626; font-weight: bold;">rechazada</span>.</p>
                <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px; margin: 20px 0;">
                    <p style="color: #7f1d1d; margin: 0; font-weight: bold;">Motivo del rechazo:</p>
                    <p style="color: #374151; margin: 8px 0 0;">${motivo}</p>
                </div>
                <p style="color: #6b7280; font-size: 13px;">Si tienes dudas, puedes comunicarte con el equipo administrativo de la ESFOT o responder a este correo.</p>
            </div>
            <div style="background: #f9fafb; padding: 16px; border-radius: 0 0 8px 8px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 Poli Rent — ESFOT · EPN</p>
            </div>
        </div>
        `
    )
}

export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailRechazoReserva
};