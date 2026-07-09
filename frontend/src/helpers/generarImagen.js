const API_URL = 'https://router.huggingface.co/nscale/v1/images/generations'
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY

const generarImagenHerramienta = async (promptDelUsuario) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            prompt: promptDelUsuario
        })
    })

    const data = await response.json()
    const base64 = data.data[0].b64_json
    const byteCharacters = atob(base64)
    const byteArray = Uint8Array.from(byteCharacters, c => c.charCodeAt(0))
    const blob = new Blob([byteArray], { type: 'image/png' })
    return blob
}

export default generarImagenHerramienta
