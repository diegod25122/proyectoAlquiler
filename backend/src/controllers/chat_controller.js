const SISTEMA = `Eres PoliBot, el asistente virtual de Poli Rent, sistema de alquiler de herramientas de la ESFOT (Escuela de Formación de Tecnólogos) de la EPN. Ayuda a los usuarios con preguntas sobre alquiler de herramientas, reservas, pagos y uso del sistema. Responde en español de forma amigable y concisa.`

const chatIA = async (req, res) => {
  try {
    const { mensajes } = req.body
    if (!mensajes || !Array.isArray(mensajes) || mensajes.length === 0) {
      return res.status(400).json({ msg: 'Debes enviar un array de mensajes' })
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return res.status(503).json({ msg: 'Servicio de IA no configurado' })
    }

    // Construir prompt en formato Mistral Instruct
    let prompt = `<s>[INST] ${SISTEMA}\n`
    for (let i = 0; i < mensajes.length; i++) {
      const m = mensajes[i]
      if (m.role === 'user') {
        prompt += i === 0 ? `${m.content} [/INST]` : ` [INST] ${m.content} [/INST]`
      } else if (m.role === 'assistant') {
        prompt += ` ${m.content} </s>`
      }
    }

    const respuesta = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 400, temperature: 0.7, return_full_text: false },
        }),
        signal: AbortSignal.timeout(30000),
      }
    )

    const data = await respuesta.json()

    if (data.error) {
      if (data.error.includes('loading') || data.estimated_time) {
        return res.status(503).json({ msg: 'El modelo IA está iniciando, intenta en unos segundos...' })
      }
      return res.status(500).json({ msg: data.error })
    }

    const texto = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
    res.status(200).json({ respuesta: (texto || '').trim() })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ msg: 'Error al comunicarse con el servicio de IA' })
  }
}

export { chatIA }
