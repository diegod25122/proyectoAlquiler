import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import useDarkMode from "../hooks/useDarkMode"; // Asegúrate de usar la ruta correcta a tu archivo de Zustand

export default function SpaceBackground() {
  const [init, setInit] = useState(false);
  
  // 1. Escuchamos el estado global del modo oscuro de tu Zustand store
  const isDarkMode = useDarkMode((state) => state.isDarkMode);

  // 2. Inicializamos el motor de tsParticles una sola vez
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 3. Configuración del cielo estrellado
  const starOptions = {
    fpsLimit: 60,
    background: {
      // Dejamos el fondo transparente para que use el color de fondo de tu CSS/Tailwind
      color: { value: "transparent" }, 
    },
    particles: {
      number: {
        value: 120, // Cantidad de estrellas en pantalla
        density: { enable: true, area: 800 },
      },
      color: { value: "#ffffff" }, // Estrellas blancas
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.2, max: 0.9 }, // Variación para simular brillo titilante
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 }, // Tamaños pequeños para que parezcan estrellas reales
      },
      move: {
        enable: true,
        speed: 0.3, // Movimiento casi imperceptible (estilo espacio profundo)
        direction: "none",
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  };

  // 4. Si el motor no está listo, o si el usuario está en MODO CLARO, no renderizamos nada
  if (!init || !isDarkMode) return null;

  return (
    <Particles
      id="tsparticles-stars"
      options={starOptions}
    />
  );
}
