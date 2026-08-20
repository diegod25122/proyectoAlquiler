// 1. POST /api/generate-3d -> Inicia la generación y retorna el taskId inmediatamente
const generarModelo3D = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ msg: 'El nombre de la herramienta es requerido' })
    if (!process.env.MESHY_API_KEY) return res.status(503).json({ msg: 'API de Meshy no configurada.' })

    const prompt = `${nombre}${descripcion ? ', ' + descripcion : ''}, herramienta industrial, objeto realista, fondo blanco`

    const crearRes = await fetch('https://api.meshy.ai/v2/text-to-3d', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'preview',
        prompt,
        art_style: 'realistic',
        negative_prompt: 'cartoon, low quality, anime, blurry',
      }),
    })

    if (!crearRes.ok) {
      const err = await crearRes.json().catch(() => ({}))
      return res.status(400).json({ msg: err.message || 'Error al crear tarea en Meshy' })
    }

    const data = await crearRes.json()
    // Retornar taskId de inmediato (Respuesta en < 1 segundo)
    return res.status(202).json({ 
      msg: 'Tarea de generación 3D iniciada', 
      taskId: data.result 
    })

  } catch (error) {
    return res.status(500).json({ msg: 'Error al solicitar el modelo 3D', error: error.message })
  }
}

// 2. GET /api/3d-status/:taskId -> Usado por React o Postman para consultar el avance
const obtenerEstado3D = async (req, res) => {
  try {
    const { taskId } = req.params
    if (!taskId) return res.status(400).json({ msg: 'El taskId es requerido' })

    const statusRes = await fetch(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!statusRes.ok) {
      const err = await statusRes.json().catch(() => ({}))
      return res.status(400).json({ msg: err.message || 'Error al consultar el estado en Meshy' })
    }

    const estado = await statusRes.json()

    // Meshy v2 devuelve los datos del estado en la raíz de la respuesta JSON
    return res.status(200).json({
      status: estado.status, // 'PENDING', 'IN_PROGRESS', 'SUCCEEDED', 'FAILED'
      progress: estado.progress || 0,
      modelUrl: estado.model_urls?.glb || null,
      thumbnailUrl: estado.thumbnail_url || null
    })

  } catch (error) {
    return res.status(500).json({ msg: 'Error al consultar el estado de la tarea 3D', error: error.message })
  }
}

export { generarModelo3D, obtenerEstado3D }