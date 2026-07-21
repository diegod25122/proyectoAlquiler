const express = require('express');
const axios = require('axios');
const router = express.Router();

// 1. Lee la API Key desde las variables de entorno (.env)
const TRIPO_API_KEY = process.env.TRIPO_API_KEY;

router.post('/api/generate-3d', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es requerido' });
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TRIPO_API_KEY}`
  };

  try {
    // Paso A: Iniciar la tarea de generación en Tripo3D
    const initResponse = await axios.post(
      'https://openapi.tripo3d.ai/v2/openapi/task',
      {
        type: 'text_to_model',
        prompt: prompt
      },
      { headers }
    );

    if (initResponse.data.code !== 0) {
      return res.status(400).json({ error: 'Error al iniciar la tarea en Tripo' });
    }

    const taskId = initResponse.data.data.task_id;

    // Paso B: Consultar el estado de la tarea (Polling) hasta que finalice
    let modelUrl = null;
    let intentos = 0;
    const maxIntentos = 30;

    while (intentos < maxIntentos) {
      // Esperar 2 segundos entre cada consulta
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusResponse = await axios.get(
        `https://openapi.tripo3d.ai/v2/openapi/task/${taskId}`,
        { headers }
      );

      const taskData = statusResponse.data.data;

      if (taskData.status === 'success') {
        // Tripo devuelve la URL directa del archivo .glb generado
        modelUrl = taskData.output.model;
        break;
      } else if (taskData.status === 'failed') {
        return res.status(500).json({ error: 'La generación del modelo 3D falló' });
      }

      intentos++;
    }

    if (modelUrl) {
      return res.json({ status: 'success', modelUrl });
    } else {
      return res.status(504).json({ error: 'Tiempo de espera agotado al generar el modelo' });
    }

  } catch (error) {
    console.error('Error en servicio 3D:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Error interno del servidor al procesar 3D' });
  }
});

module.exports = router;
