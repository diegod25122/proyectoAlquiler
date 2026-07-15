import React, { useRef } from "react";

/*
  POLIRENT — Hero + Catálogo tipo carrusel
  Basado en el diseño de referencia (imágenes generadas).
  Paleta: navy #0B1A3A -> azul #1E5FD9 (gradiente hero), acentos por categoría en badges.
  Reemplaza las rutas de imagen (heroImg) por tus assets reales.
*/

const stats = [
  { icon: "ti-briefcase", value: "100+", label: "HERRAMIENTAS", bg: "bg-[#2E4CDB]" },
  { icon: "ti-clock", value: "24/7", label: "DISPONIBLE", bg: "bg-[#0E9F6E]" },
  { icon: "ti-building-bank", value: "ESFOT", label: "EPN", bg: "bg-[#C77D1E]" },
];

const products = [
  { code: "ESFOT-D12", name: "Multímetro Digital", category: "Tecnológicas", price: 25.0, status: "Disponible", icon: "ti-device-analytics" },
  { code: "ESFOT-05", name: "Gafas de Seguridad", category: "Ópticas", price: 4.2, status: "Pocas unidades", icon: "ti-glasses" },
  { code: "ESFOT-C8", name: "Estaño para Soldar", category: "Consumibles", price: 2.1, status: "Disponible", icon: "ti-circle-dot" },
  { code: "ESFOT-T3", name: "Taladro Inalámbrico", category: "Tecnológicas", price: 75.0, status: "Disponible", icon: "ti-bolt" },
  { code: "ESFOT-M7", name: "Destornillador Plano", category: "Manuales", price: 1.8, status: "Disponible", icon: "ti-screwdriver" },
  { code: "ESFOT-P4", name: "Pinza de Corte", category: "Manuales", price: 6.5, status: "Disponible", icon: "ti-cut" },
];

const statusStyle = {
  "Disponible": "bg-green-50 text-green-700",
  "Pocas unidades": "bg-amber-50 text-amber-700",
  "Agotado": "bg-gray-100 text-gray-400",
};

function ProductCard({ p }) {
  return (
    <div className="min-w-[220px] max-w-[220px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] text-gray-400">{p.code}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle[p.status]}`}>
          {p.status}
        </span>
      </div>
      <div className="h-16 flex items-center justify-center mb-2 text-[#1E5FD9]">
        <i className={`ti ${p.icon} text-3xl`} aria-hidden="true" />
      </div>
      <h3 className="text-sm font-medium text-gray-900">{p.name}</h3>
      <p className="text-xs text-gray-400 mb-2">{p.category}</p>
      <p className="text-sm font-semibold text-[#1E5FD9] mb-3">${p.price.toFixed(2)}</p>
      <button className="mt-auto w-full py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition flex items-center justify-center gap-1.5">
        <i className="ti ti-shopping-cart text-sm" aria-hidden="true" />
        Añadir
      </button>
    </div>
  );
}

export default function PoliRentHeroCarousel() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 240, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-['Inter']">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css"
      />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 font-semibold text-lg text-gray-900">
          <div className="w-8 h-8 rounded bg-[#1E5FD9] flex items-center justify-center text-white text-sm font-bold">
            P
          </div>
          PoliRent
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">Inicio</span>
          <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
          <div className="relative">
            <i className="ti ti-shopping-cart text-lg" aria-hidden="true" />
            <span className="absolute -top-2 -right-2 bg-[#1E5FD9] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
          </div>
          <span className="flex items-center gap-1 cursor-pointer">
            <i className="ti ti-user text-base" aria-hidden="true" /> Login
          </span>
          <button className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
            <i className="ti ti-moon text-sm" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B1A3A]">
        <img
          src="/assets/hero-tools.png"
          alt="Caja de herramientas, multímetro y kit de soldadura del taller ESFOT"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A3A] via-[#0B1A3A]/85 to-transparent" />

        <div className="relative grid grid-cols-2 gap-8 px-10 py-16 max-w-7xl mx-auto items-center">
          <div>
            <span className="inline-block text-[11px] font-medium tracking-wide text-white bg-white/10 px-3 py-1 rounded-full mb-4">
              ESFOT · TALLER ESTUDIANTIL
            </span>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Herramientas y consumibles,<br />
              <span className="text-[#4FA6FF]">sin planillas de papel</span>
            </h1>
            <p className="text-white/70 text-base max-w-md mb-6">
              Préstamos de equipo y compra de componentes electrónicos, todo desde una sola plataforma académica.
            </p>
            <div className="flex gap-3 mb-8">
              <button className="px-5 py-2.5 rounded-lg bg-[#1E5FD9] text-white text-sm font-medium hover:bg-[#1A50BA] transition flex items-center gap-2">
                Ver catálogo <i className="ti ti-arrow-right text-sm" aria-hidden="true" />
              </button>
              <button className="px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition flex items-center gap-2">
                Crear cuenta <i className="ti ti-user-plus text-sm" aria-hidden="true" />
              </button>
            </div>
            <div className="flex gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <div className={`w-8 h-8 rounded-md ${s.bg} flex items-center justify-center text-white text-sm`}>
                    <i className={`ti ${s.icon}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">{s.value}</p>
                    <p className="text-white/50 text-[10px] mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div />
        </div>
      </section>

      {/* SOBRE EL SISTEMA */}
      <section className="max-w-7xl mx-auto px-10 py-14 grid grid-cols-2 gap-10">
        <div>
          <span className="text-xs font-medium text-[#1E5FD9] tracking-wide">SOBRE EL SISTEMA</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
            Un solo lugar para préstamos e insumos del taller
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            PoliRent centraliza el control de los activos físicos de la ESFOT — equipos de laboratorio, herramientas manuales y tecnológicas — eliminando las planillas en papel y dando trazabilidad real a cada préstamo.
          </p>
          <p className="text-sm text-gray-600 mb-5">
            Resuelve también la venta ágil de consumibles de electrónica para que estudiantes y docentes avancen sin fricciones administrativas.
          </p>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <i className="ti ti-shield-check text-[#1E5FD9] text-lg mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-gray-900">Seguridad, trazabilidad y control total</p>
              <p className="text-xs text-gray-500">Cada préstamo registrado, cada equipo cuidado.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900">ESFOT</h3>
          <p className="text-xs font-medium text-[#1E5FD9] tracking-wide mb-6">ESCUELA POLITÉCNICA NACIONAL</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "ti-briefcase", label: "Préstamos", sub: "de herramientas" },
              { icon: "ti-package", label: "Consumibles", sub: "con Stripe" },
              { icon: "ti-robot", label: "Chat IA", sub: "PoliBot" },
            ].map((f) => (
              <div key={f.label} className="border border-gray-100 rounded-lg p-3">
                <i className={`ti ${f.icon} text-xl text-[#1E5FD9]`} aria-hidden="true" />
                <p className="text-xs font-medium text-gray-900 mt-2">{f.label}</p>
                <p className="text-[10px] text-gray-400">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOGO CARRUSEL */}
      <section className="max-w-7xl mx-auto px-10 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E5FD9]/10 flex items-center justify-center text-[#1E5FD9]">
              <i className="ti ti-shopping-bag text-lg" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Catálogo destacado</h2>
              <p className="text-xs text-gray-500">Explora las herramientas y componentes más solicitados del taller.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Anterior"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <i className="ti ti-chevron-left text-sm" aria-hidden="true" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Siguiente"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <i className="ti ti-chevron-right text-sm" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p) => (
            <ProductCard key={p.code} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
