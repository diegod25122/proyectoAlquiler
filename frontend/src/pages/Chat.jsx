import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { FiSend, FiMessageCircle, FiUser, FiCpu } from "react-icons/fi"

const getHeaders = () => {
  const storedUser = JSON.parse(localStorage.getItem("auth-token"))
  return { Authorization: `Bearer ${storedUser?.state?.token}` }
}

const Chat = () => {
  const [mensajes, setMensajes] = useState([
    { role: "assistant", content: "¡Hola! Soy PoliBot 🤖, el asistente virtual de Poli Rent. Puedo ayudarte con preguntas sobre el alquiler de herramientas, reservas y pagos. ¿En qué puedo ayudarte?" }
  ])
  const [input, setInput] = useState("")
  const [cargando, setCargando] = useState(false)
  const finRef = useRef(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, cargando])

  const enviarMensaje = async (e) => {
    e.preventDefault()
    const texto = input.trim()
    if (!texto || cargando) return

    const nuevos = [...mensajes, { role: "user", content: texto }]
    setMensajes(nuevos)
    setInput("")
    setCargando(true)

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chat`,
        { mensajes: nuevos },
        { headers: getHeaders(), timeout: 35000 }
      )
      setMensajes(prev => [...prev, { role: "assistant", content: data.respuesta }])
    } catch (error) {
      const msg = error.response?.data?.msg || "No se pudo conectar con PoliBot. Intenta de nuevo."
      setMensajes(prev => [...prev, { role: "assistant", content: `⚠️ ${msg}` }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>

      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="font-black text-4xl text-gray-500 dark:text-gray-300">Asistente IA</h1>
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 text-sm">
          <FiMessageCircle /> PoliBot — Asistente virtual powered by Mistral AI
        </p>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-4 min-h-0">
        {mensajes.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
              ${m.role === "user" ? "bg-purple-700" : "bg-indigo-600"}`}>
              {m.role === "user" ? <FiUser size={14} /> : <FiCpu size={14} />}
            </div>
            {/* Burbuja */}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
              ${m.role === "user"
                ? "bg-purple-700 text-white rounded-tr-sm"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-tl-sm shadow-sm"
              }`}>
              {m.content}
            </div>
          </div>
        ))}

        {cargando && (
          <div className="flex gap-3 flex-row">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <FiCpu size={14} />
            </div>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm">
              <span className="flex gap-1 items-center text-gray-500 dark:text-gray-400">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
              </span>
            </div>
          </div>
        )}

        <div ref={finRef} />
      </div>

      {/* Input */}
      <form onSubmit={enviarMensaje} className="flex gap-3 mt-4 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escribe tu pregunta sobre Poli Rent..."
          disabled={cargando}
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
            text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600
            py-3 px-4 text-sm transition-all"
        />
        <button
          type="submit"
          disabled={cargando || !input.trim()}
          className="bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed
            text-white rounded-xl px-5 py-3 transition-colors flex items-center gap-2 font-medium"
        >
          <FiSend size={18} />
        </button>
      </form>
    </div>
  )
}

export default Chat
