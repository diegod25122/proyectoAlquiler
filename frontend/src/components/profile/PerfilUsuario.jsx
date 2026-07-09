import { useState } from "react"
import { useNavigate } from "react-router"
import {
  FiUser, FiCreditCard, FiMail, FiPhone, FiBookOpen,
  FiEdit2, FiZap, FiCalendar, FiDollarSign, FiBell,
  FiHelpCircle, FiShield, FiLock, FiClock, FiChevronRight,
  FiClipboard,
} from "react-icons/fi"
import storeProfile from "../../context/storeProfile"
import FormProfile from "./FormProfile"
import CardPassword from "./CardPassword"
import "./PerfilUsuario.css"

export default function PerfilUsuario() {
  const [mostrarEdicion, setMostrarEdicion] = useState(false)
  const { user } = storeProfile()
  const navigate = useNavigate()

  const nombreCompleto = `${user?.nombre || ""} ${user?.apellido || ""}`.trim()
  const primerNombre = user?.nombre || "Usuario"

  const resumen = [
    { icono: <FiCalendar />, valor: 0, label: "Reservas activas",     sub: "Actualmente",  color: "morado"  },
    { icono: <FiClipboard />, valor: 0, label: "Reservas completadas", sub: "Histórico",     color: "verde"   },
    { icono: <FiDollarSign />, valor: "$0,00", label: "Total pagado",  sub: "Este mes",      color: "naranja" },
    { icono: <FiClock />,     valor: "0 h",  label: "Horas reservadas", sub: "Este mes",    color: "azul"    },
  ]

  const accionesRapidas = [
    { icono: <FiCalendar />,   titulo: "Mis reservas",    desc: "Ver y gestionar tus reservas",        color: "morado",  accion: () => navigate("/dashboard/list")    },
    { icono: <FiDollarSign />, titulo: "Mis pagos",       desc: "Historial y comprobantes de pago",    color: "verde",   accion: () => {}                             },
    { icono: <FiBell />,       titulo: "Notificaciones",  desc: "Ver tus mensajes y alertas",          color: "naranja", accion: () => {}                             },
    { icono: <FiHelpCircle />, titulo: "Ayuda",           desc: "Preguntas frecuentes y soporte",      color: "azul",    accion: () => {}                             },
  ]

  return (
    <div className="perfil-page">

      {/* Bienvenida */}
      <section className="tarjeta bienvenida">
        <div>
          <h1>¡Hola, {primerNombre}! 👋</h1>
          <p>Bienvenido a tu espacio personal. Aquí puedes gestionar tu información y preferencias.</p>
        </div>
      </section>

      <div className="grid-dos-columnas">

        {/* Información personal */}
        <section className="tarjeta">
          <h2><FiUser className="icono-titulo" /> Información personal</h2>
          <div className="info-personal">
            <div className="avatar-wrapper">
              <div className="avatar">
                <FiUser size={48} />
              </div>
              <button
                className="btn-editar-avatar"
                aria-label="Editar"
                onClick={() => setMostrarEdicion(!mostrarEdicion)}
              >
                <FiEdit2 size={14} />
              </button>
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

          <button className="btn-primario" onClick={() => setMostrarEdicion(!mostrarEdicion)}>
            <FiEdit2 /> {mostrarEdicion ? "Cerrar edición" : "Editar información"}
          </button>

          {mostrarEdicion && (
            <div className="panel-edicion">
              <FormProfile />
              <CardPassword />
            </div>
          )}
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

      {/* Seguridad de la cuenta */}
      <section className="tarjeta">
        <h2><FiShield className="icono-titulo" /> Seguridad de la cuenta</h2>
        <div className="seguridad-fila">
          <span><FiLock /> Contraseña</span>
          <span className="valor-secreto">••••••••</span>
          <button className="btn-secundario" onClick={() => setMostrarEdicion(true)}>
            Cambiar
          </button>
        </div>
        <div className="seguridad-fila">
          <span><FiClock /> Rol en el sistema</span>
          <span>{user?.rol}</span>
          <span className="badge-exito">Activo</span>
        </div>
      </section>

    </div>
  )
}
