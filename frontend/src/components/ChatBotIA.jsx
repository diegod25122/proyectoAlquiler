import React, { useState } from 'react';
import axios from 'axios';
import { MdSmartToy, MdClose, MdSend, MdAnalytics } from 'react-icons/md';

const ChatbotIA = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [historial, setHistorial] = useState([
        { sender: 'bot', text: '¡Hola! Soy la IA asistente de PoliRent. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [metrica, setMetrica] = useState(null);
    const [intent, setIntent] = useState(null);
    const [loading, setLoading] = useState(false);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        if (!mensaje.trim()) return;

        const userText = mensaje;
        setHistorial(prev => [...prev, { sender: 'user', text: userText }]);
        setMensaje("");
        setLoading(true);

        try {
         const res = await axios.post(`${API_URL}/api/chat`, { message: userText });
            
            setHistorial(prev => [...prev, { sender: 'bot', text: res.data.response }]);
            
            // Guardamos las métricas que exige el PDF de la materia
            setMetrica(res.data.metric_accuracy);
            setIntent(res.data.intent_detected);
        } catch (error) {
            console.error("Error al conectar con el backend de IA:", error);
            setHistorial(prev => [...prev, { sender: 'bot', text: 'Lo siento, no pude conectarme con mi cerebro de IA en este momento.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Botón flotante para abrir el chat */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all duration-200 active:scale-95"
                >
                    <MdSmartToy className="h-7 w-7 animate-pulse" />
                </button>
            )}

            {/* Ventana de Chat */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 h-[450px] rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                    
                    {/* Cabecera del Chat */}
                    <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-purple-600 p-1.5 rounded-xl">
                                <MdSmartToy className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Asistente PoliRent IA</h4>
                                <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                                    ● En línea (Modelo Propio)
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                            <MdClose className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Panel de Métricas Exigidas por el PDF */}
                    <div className="bg-purple-50 border-b border-purple-100 p-2 px-4 flex items-center justify-between text-[11px] text-purple-700 font-medium">
                        <span className="flex items-center gap-1">
                            <MdAnalytics className="h-3.5 w-3.5" /> 
                            Precisión: {metrica !== null ? `${(metrica * 100).toFixed(1)}%` : 'Esperando entrenamiento...'}
                        </span>
                        <span>
                            Intento: <span className="bg-purple-200 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">{intent || 'Ninguno'}</span>
                        </span>
                    </div>

                    {/* Cuerpo de los Mensajes */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
                        {historial.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium shadow-sm ${
                                    msg.sender === 'user' 
                                        ? 'bg-purple-600 text-white rounded-br-none' 
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 text-gray-400 p-3 rounded-2xl rounded-bl-none text-xs italic animate-pulse">
                                    IA pensando...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Formulario de Entrada */}
                    <form onSubmit={enviarMensaje} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input 
                            type="text" 
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            placeholder="Ej. ¿Cuáles son los requisitos de alquiler?"
                            className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-purple-500 focus:bg-white transition-all text-gray-800"
                        />
                        <button 
                            type="submit" 
                            className="bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-xl flex items-center justify-center transition-all active:scale-95"
                        >
                            <MdSend className="h-4 w-4" />
                        </button>
                    </form>

                </div>
            )}
        </div>
    );
};
export default ChatbotIA;