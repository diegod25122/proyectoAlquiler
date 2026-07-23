import { Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Modelos3D
 *     description: Generación de modelos 3D a partir de Texto o Imagen usando Tripo3D v3
 */

/**
 * @swagger
 * /generate-3d:
 *   post:
 *     summary: Generar un modelo 3D a partir de un prompt o la URL de una imagen
 *     tags: [Modelos3D]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Martillo de construcción industrial"
 *               imageUrl:
 *                 type: string
 *                 example: "https://res.cloudinary.com/demo/image/upload/v12345/martillo.jpg"
 *               nombre:
 *                 type: string
 *                 example: "Martillo"
 *     responses:
 *       200:
 *         description: Modelo 3D generado exitosamente
 *       400:
 *         description: Parámetros faltantes o inválidos
 *       500:
 *         description: Error de servidor o API Key no configurada
 *       504:
 *         description: Tiempo de espera agotado
 */
router.post('/generate-3d', async (req, res) => {
  const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

  if (!TRIPO_API_KEY) {
    return res.status(500).json({ error: 'La API Key de Tripo3D no está configurada en el .env' });
  }

  const { prompt, imageUrl, nombre } = req.body || {};

  // Validar que exista al menos un parámetro para construir la tarea
  if (!prompt && !imageUrl && !nombre) {
    return res.status(400).json({ 
      error: 'Debes proporcionar al menos un "prompt", una "imageUrl" o el "nombre" del producto.' 
    });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TRIPO_API_KEY}`
  };

  try {
    let endpoint = '';
    let payload = {};

    // 1. Determinar el flujo de generación (Image-to-Model o Text-to-Model)
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      endpoint = 'https://openapi.tripo3d.ai/v3/generation/image-to-model';
      payload = {
        file: {
          type: 'jpg',
          url: imageUrl
        },
        model: 'v3.1-20260211'
      };
    } else {
      endpoint = 'https://openapi.tripo3d.ai/v3/generation/text-to-model';
      const promptFinal = prompt || `A realistic 3D asset of a workshop tool named ${nombre || 'tool'}, high quality`;
      payload = {
        prompt: promptFinal,
        model: 'v3.1-20260211'
      };
    }

    // 2. Iniciar la tarea en Tripo v3
    const initResponse = await axios.post(endpoint, payload, { headers });

    if (initResponse.data.code !== 0) {
      return res.status(400).json({ 
        error: 'Error al iniciar la tarea en Tripo3D',
        detalles: initResponse.data 
      });
    }

    const taskId = initResponse.data.data.task_id;

    // 3. Polling para verificar el estado de la tarea
    let modelUrl = null;
    let renderedImageUrl = null;
    let intentos = 0;
    const maxIntentos = 60; // Hasta 2 minutos (60 x 2s)

    while (intentos < maxIntentos) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await axios.get(
        `https://openapi.tripo3d.ai/v3/tasks/${taskId}`,
        { headers }
      );

      const taskData = statusResponse.data.data;

      if (taskData.status === 'success') {
        modelUrl = taskData.output?.model_url || taskData.output?.model;
        renderedImageUrl = taskData.output?.rendered_image_url;
        break;
      } else if (taskData.status === 'failed') {
        return res.status(500).json({ error: 'La generación del modelo 3D falló en Tripo3D' });
      }

      intentos++;
    }

    if (modelUrl) {
      return res.json({ 
        status: 'success', 
        modelUrl, 
        renderedImageUrl 
      });
    } else {
      return res.status(504).json({ error: 'Tiempo de espera agotado al generar el modelo 3D' });
    }

  } catch (error) {
    console.error('Error en servicio 3D:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Error interno del servidor al procesar 3D',
      detalles: error.response?.data || error.message 
    });
  }
});

export default router;