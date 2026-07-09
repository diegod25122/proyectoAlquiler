import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import {
  FiUser, FiCreditCard, FiMail, FiPhone, FiBookOpen,
  FiEdit2, FiZap, FiCalendar, FiDollarSign, FiBell,
  FiHelpCircle, FiShield, FiLock, FiClock, FiChevronRight,
  FiClipboard, FiX, FiCamera,
} from "react-icons/fi"
import storeProfile from "../../context/storeProfile"
import FormProfile from "./FormProfile"
import CardPassword from "./CardPassword"
import "./PerfilUsuario.css"

export default function PerfilUsuario() {
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false)
  const { user, updateProfile } = storeProfile()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const nombreCompleto = `${user?.nombre || ""} ${user?.apellido || ""}`.trim()
  const primerNombre = user?.nombre || "Usuario"

  const resumen = [
    { icono: <FiCalendar />, valor: 0,      label: "Reservas activas",     sub: "Actualmente", color: "morado"  },
    { icono: <FiClipboard />, valor: 0,     label: "Reservas completadas", sub: "Histórico",   color: "verde"   },
    { icono: <FiDollarSign />, valor: "$0,00", label: "Total pagado",      sub: "Este mes",    color: "naranja" },
    { icono: <FiClock />,     valor: "0 h", label: "Horas reservadas",     sub: "Este mes",    color: "azul"    },
  ]

  const accionesRapidas = [
    { icono: <FiCalendar />,   titulo: "Mis reservas",   desc: "Ver y gestionar tus reservas",     color: "morado",  accion: () => navigate("/dashboard/list") },
    { icono: <FiDollarSign />, titulo: "Mis pagos",      desc: "Historial y comprobantes de pago", color: "verde",   accion: () => {} },
    { icono: <FiBell />,       titulo: "Notificaciones", desc: "Ver tus mensajes y alertas",       color: "naranja", accion: () => {} },
    { icono: <FiHelpCircle />, titulo: "Ayuda",          desc: "Preguntas frecuentes y soporte",   color: "azul",    accion: () => {} },
  ]

  const handleFotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("imagen", file)
    const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/perfil`
    await updateProfile(url, formData)
  }

  return (
    <div className="perfil-page">

      {/* Bienvenida */}
      <section className="tarjeta bienvenida">
        <div>
          <h1>¡Hola, {primerNombre}! 👋</h1>
          <p>Bienvenido a Poli Rent. Aquí tienes un resumen de tu cuenta.</p>
        </div>
        <div className="bienvenida-ilustracion" aria-hidden="true">
          <svg width="140" height="90" viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">
            <circle cx="105" cy="30" r="16" fill="#fbbf24" opacity="0.4" />
            <circle cx="125" cy="55" r="6" fill="#ffffff" opacity="0.5" />
            <circle cx="20" cy="15" r="4" fill="#ffffff" opacity="0.4" />
            <rect x="10" y="18" width="34" height="22" rx="6" fill="#ffffff" opacity="0.9" />
            <polygon points="20,40 26,40 20,48" fill="#ffffff" opacity="0.9" />
            <circle cx="19" cy="29" r="2.4" fill="#7c3aed" />
            <circle cx="27" cy="29" r="2.4" fill="#7c3aed" />
            <circle cx="35" cy="29" r="2.4" fill="#7c3aed" />
            <circle cx="80" cy="24" r="12" fill="#fcd9b8" />
            <path d="M68 24a12 12 0 0 1 24 0" fill="#3b2a20" />
            <rect x="63" y="38" width="34" height="40" rx="14" fill="#6d5bd0" />
            <rect x="63" y="38" width="34" height="16" rx="8" fill="#5a48c0" />
            <path d="M95 46 Q112 40 110 24" stroke="#fcd9b8" strokeWidth="7" strokeLinecap="round" fill="none" />
            <circle cx="110" cy="22" r="6" fill="#fcd9b8" />
          </svg>
        </div>
      </section>

      <div className="grid-dos-columnas">

        {/* Información personal */}
        <section className="tarjeta">
          <h2><FiUser className="icono-titulo" /> Información personal</h2>
          <div className="info-personal">
            <div className="avatar-wrapper">
              <div className="avatar">
                {user?.foto
                  ? <img src={user.foto} alt="Foto de perfil" className="avatar-img" />
                  : <FiUser size={48} />
                }
              </div>
              <button
                className="btn-editar-avatar"
                aria-label="Cambiar foto"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiCamera size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFotoChange}
              />
            </div>

            <div className="info-lista">
              <div className="info-fila">
                <FiUser className="icono-fila" />
                <div>
                  <span className="label">Nombre completo</span>
                  <p>{nombreCompleto}</p>
                </div>
              </div>
              <div className="info-fila">
                <FiCreditCard className="icono-fila" />
                <div>
                  <span className="label">Cédula</span>
                  <p>{user?.cedula}</p>
                </div>
              </div>
              <div className="info-fila">
                <FiMail className="icono-fila" />
                <div>
                  <span className="label">Correo electrónico</span>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="info-fila">
                <FiPhone className="icono-fila" />
                <div>
                  <span className="label">Celular</span>
                  <p>{user?.telefono}</p>
                </div>
              </div>
              <div className="info-fila">
                <FiBookOpen className="icono-fila" />
                <div>
                  <span className="label">Facultad / Escuela</span>
                  <p>{user?.facultad}</p>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primario" onClick={() => setMostrarModalEdicion(true)}>
            <FiEdit2 /> Editar información
          </button>
        </section>

        {/* Acciones rápidas */}
        <section className="tarjeta">
          <h2><FiZap className="icono-titulo" /> Acciones rápidas</h2>
          <div className="grid-acciones">
            {accionesRapidas.map((a) => (
              <button key={a.titulo} className={`accion-card color-${a.color}`} onClick={a.accion}>
                <span className="accion-icono">{a.icono}</span>
                <span className="accion-texto">
                  <strong>{a.titulo}</strong>
                  <small>{a.desc}</small>
                </span>
                <FiChevronRight className="accion-flecha" />
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Resumen de actividad */}
      <section className="tarjeta">
        <h2>📊 Resumen de actividad</h2>
        <div className="grid-resumen">
          {resumen.map((r) => (
            <div key={r.label} className={`resumen-item color-${r.color}`}>
              <span className="resumen-icono">{r.icono}</span>
              <div>
                <strong>{r.valor}</strong>
                <p>{r.label}</p>
                <small>{r.sub}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mis pagos */}
      <section className="tarjeta">
        <h2><FiDollarSign className="icono-titulo" /> Mis pagos</h2>
        <div className="tabla-wrapper">
          <table className="tabla-pagos">
            <thead>
              <tr>
                <th>Herramienta</th>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="tabla-vacia">No tienes pagos registrados aún.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Seguridad de la cuenta */}
      <section className="tarjeta">
        <h2><FiShield className="icono-titulo" /> Seguridad de la cuenta</h2>
        <div className="seguridad-fila">
          <span><FiLock /> Contraseña</span>
          <span className="valor-secreto">••••••••</span>
          <button className="btn-secundario" onClick={() => setMostrarModalEdicion(true)}>
            Cambiar
          </button>
        </div>
        <div className="seguridad-fila">
          <span><FiClock /> Rol en el sistema</span>
          <span>{user?.rol}</span>
          <span className="badge-exito">Activo</span>
        </div>
      </section>

      {/* Modal de edición de perfil */}
      {mostrarModalEdicion && (
        <div className="modal-overlay" onClick={() => setMostrarModalEdicion(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-cabecera">
              <h3>Editar perfil</h3>
              <button className="modal-cerrar" onClick={() => setMostrarModalEdicion(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal-cuerpo">
              <FormProfile />
              <CardPassword />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
