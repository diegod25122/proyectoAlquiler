import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/generate-3d', async (req, res) => {
  const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

  if (!TRIPO_API_KEY) {
    return res.status(500).json({ error: 'La API Key de Tripo3D no está configurada en el .env' });
  }

  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: 'El campo "prompt" es requerido en el body JSON' });
  }

  const { prompt } = req.body;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TRIPO_API_KEY}`
  };

  try {
    // 1. Iniciar la tarea en el endpoint exacto que indica tu captura
    const initResponse = await axios.post(
      'https://openapi.tripo3d.ai/v3/generation/text-to-model',
      {
        prompt: prompt,
        model: 'v3.1-20260211'
      },
      { headers }
    );

    if (initResponse.data.code !== 0) {
      return res.status(400).json({ 
        error: 'Error al iniciar la tarea en Tripo',
        detalles: initResponse.data 
      });
    }

    const taskId = initResponse.data.data.task_id;

    // 2. Polling para verificar el estado de la tarea
    let modelUrl = null;
    let renderedImageUrl = null;
    let intentos = 0;
    const maxIntentos = 60; // Hasta 2 minutos

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
        return res.status(500).json({ error: 'La generación del modelo 3D falló en Tripo' });
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