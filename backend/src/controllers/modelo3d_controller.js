import axios from "axios";

export const generarModelo3D = async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

        if (!TRIPO_API_KEY) {
            return res.status(500).json({ msg: "Falta la API Key de Tripo AI en las variables de entorno." });
        }

        // 1. Definir payload (Prioriza Image-to-3D si hay imagen, sino Text-to-3D)
        let payload = {};
        if (imagen && (imagen.startsWith("http://") || imagen.startsWith("https://"))) {
            payload = {
                type: "image_to_3d",
                file: {
                    type: "jpg",
                    url: imagen
                }
            };
        } else {
            payload = {
                type: "text_to_3d",
                prompt: `A realistic 3D model of ${nombre || "a workshop tool"}, low poly, 3d asset`
            };
        }

        // 2. Iniciar la tarea en Tripo AI
        const { data: taskResponse } = await axios.post(
            "https://api.tripo3d.ai/v2/openapi/task",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${TRIPO_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const taskId = taskResponse?.data?.task_id;
        if (!taskId) {
            return res.status(400).json({ msg: "No se pudo iniciar la tarea en Tripo AI." });
        }

        // 3. Polling: Esperar la respuesta del modelo .glb
        let modelUrl = null;
        let intentos = 0;
        const maxIntentos = 30; // ~60 segundos tiempo de espera

        while (intentos < maxIntentos) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Esperar 2 segundos

            const { data: statusResponse } = await axios.get(
                `https://api.tripo3d.ai/v2/openapi/task/${taskId}`,
                { headers: { Authorization: `Bearer ${TRIPO_API_KEY}` } }
            );

            const taskData = statusResponse?.data;

            if (taskData?.status === "SUCCESS") {
                modelUrl = taskData.output?.model || taskData.output?.pbr_model;
                break;
            } else if (taskData?.status === "FAILED") {
                return res.status(500).json({ msg: "Tripo AI falló al generar el modelo 3D." });
            }

            intentos++;
        }

        if (!modelUrl) {
            return res.status(408).json({ msg: "Tiempo de espera agotado al generar el modelo 3D." });
        }

        return res.status(200).json({
            msg: "Modelo 3D generado correctamente",
            modelUrl
        });

    } catch (error) {
        console.error("Error en generarModelo3D:", error?.response?.data || error.message);
        return res.status(500).json({ 
            msg: "Error de servidor al generar el modelo 3D", 
            error: error?.response?.data?.message || error.message 
        });
    }
};