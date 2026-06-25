const API_URL = "https://router.huggingface.co/nscale/v1/images/generations"
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY


async function generateAvatar(promptFormUser) {
	
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "stabilityai/stable-diffusion-xl-base-1.0",
            prompt: promptFormUser
        }),
    })
	
	
    const data = await response.json()

    if (!data?.data?.[0]?.b64_json) {
        console.error("API ERROR:", data)
    }
	// 1
    const base64 = data.data[0].b64_json
	// 2
    const byteCharacters = atob(base64)
	// 3
    const byteArray = Uint8Array.from(byteCharacters, c => c.charCodeAt(0))
	// 4
    const blob = new Blob([byteArray], { type: "image/png" })
	
    return blob
}

export default generateAvatar 


/* 
 Imagen de la API  => 🐕 "b64_json": "iVBORw0KGgoAAAANSUhEUgAA..."
   ↓
1)Base64  => "iVBORw0KGgoAAAANSUhEUgAA..."
   ↓
2) atob()  => Datos decodificados de la imagen
   ↓
3) Bytes   => [137,80,78,71,13,10,26,10,...]
   ↓
4) Blob    => 🐕 Imagen PNG en memoria {🐕,type:image/png}
   ↓
Imagen utilizable en React


*/


/* 
Prompt
  ↓
API
  ↓
🐕 (Base64)
  ↓
generateAvatar()
  ↓
Blob
  ↓
File("avatar.png")
  ↓
URL.createObjectURL(blob)
  ↓
blob:http://localhost:5173/abc123
  ↓
<img src={imageUrl}>
  ↓
🐕 Imagen visible

*/