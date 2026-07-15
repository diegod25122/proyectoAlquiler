const generarModelo3D = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ msg: 'El nombre de la herramienta es requerido' })
    if (!process.env.MESHY_API_KEY) return res.status(503).json({ msg: 'API de Meshy no configurada. Agrega MESHY_API_KEY en las variables de entorno.' })

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
      const err = await crearRes.json()
      return res.status(400).json({ msg: err.message || 'Error al crear tarea en Meshy' })
    }

    const { result: taskId } = await crearRes.json()

    // Polling cada 3 segundos, máximo 120 segundos
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000))
      const estadoRes = await fetch(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, {
        headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY}` },
      })
      const estado = await estadoRes.json()

      if (estado.status === 'SUCCEEDED') {
        return res.status(200).json({
          modelUrl: estado.model_urls?.glb || null,
          thumbnailUrl: estado.thumbnail_url || null,
          taskId,
        })
      }
      if (estado.status === 'FAILED') {
        return res.status(500).json({ msg: 'La generación del modelo 3D falló en Meshy' })
      }
    }

    res.status(408).json({ msg: 'Tiempo agotado esperando el modelo 3D. Intenta de nuevo.' })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'Error al generar el modelo 3D' })
  }
}

export { generarModelo3D }
