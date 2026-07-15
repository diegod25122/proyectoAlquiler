const provincias = {
  '01': 'Azuay', '02': 'Bolívar', '03': 'Cañar', '04': 'Carchi',
  '05': 'Cotopaxi', '06': 'Chimborazo', '07': 'El Oro', '08': 'Esmeraldas',
  '09': 'Guayas', '10': 'Imbabura', '11': 'Loja', '12': 'Los Ríos',
  '13': 'Manabí', '14': 'Morona Santiago', '15': 'Napo', '16': 'Pastaza',
  '17': 'Pichincha', '18': 'Tungurahua', '19': 'Zamora Chinchipe',
  '20': 'Galápagos', '21': 'Sucumbíos', '22': 'Orellana',
  '23': 'Santo Domingo', '24': 'Santa Elena', '30': 'Exterior'
}

const validarAlgoritmo = (cedula) => {
  if (!/^\d{10}$/.test(cedula)) return false
  const prov = parseInt(cedula.substring(0, 2))
  if ((prov < 1 || prov > 24) && prov !== 30) return false
  if (parseInt(cedula[2]) >= 6) return false

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let suma = 0
  for (let i = 0; i < 9; i++) {
    let val = parseInt(cedula[i]) * coeficientes[i]
    if (val >= 10) val -= 9
    suma += val
  }
  const verificador = suma % 10 === 0 ? 0 : 10 - (suma % 10)
  return verificador === parseInt(cedula[9])
}

const consultarCedula = async (req, res) => {
  try {
    const { numero } = req.params
    const esValida = validarAlgoritmo(numero)

    if (!esValida) {
      return res.status(400).json({ valida: false, msg: 'Cédula ecuatoriana inválida' })
    }

    const codigoProvincia = numero.substring(0, 2)
    const provincia = provincias[codigoProvincia] || 'Desconocida'

    if (process.env.ECUADOR_CEDULA_KEY) {
      try {
        const respuesta = await fetch(
          `https://api.migo.me/api/v1/cedula/datos/${numero}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.ECUADOR_CEDULA_KEY}`,
              Accept: 'application/json',
            },
            signal: AbortSignal.timeout(5000),
          }
        )
        if (respuesta.ok) {
          const data = await respuesta.json()
          return res.status(200).json({
            valida: true,
            provincia,
            fuente: 'api-ecuador',
            nombres: data.nombres || null,
            apellidos: data.apellidos || null,
          })
        }
      } catch (_) {
        // Fallback al algoritmo si la API externa falla
      }
    }

    return res.status(200).json({ valida: true, provincia, fuente: 'algoritmo' })
  } catch (error) {
    res.status(500).json({ msg: `Error: ${error.message}` })
  }
}

export { consultarCedula }
