import dotenv from "dotenv"
dotenv.config()

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"

const sendMail = async (to, subject, html) => {
    try {
        const response = await fetch(BREVO_API_URL, {
            method: "POST",
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                sender: { name: "POLI - RENT", email: process.env.USER_MAILTRAP },
                to: [{ email: to }],
                subject,
                htmlContent: html,
            }),
        })

        if (!response.ok) {
            const errorBody = await response.text()
            throw new Error(`Brevo API respondió ${response.status}: ${errorBody}`)
        }

        const data = await response.json()
        console.log("✅ Email enviado:", data.messageId)
        return data
    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
        throw error
    }
}

export default sendMail
