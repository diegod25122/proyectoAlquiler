import { useEffect, useState } from "react";
// 1. Quitamos initParticlesEngine de aquí:
import Particles from "@tsparticles/react"; 
// 2. Lo importamos desde el motor real de la librería (@tsparticles/engine):
import { initParticlesEngine } from "@tsparticles/engine"; 
import { loadSlim } from "@tsparticles/slim";
import useDarkMode from "../hooks/useDarkMode"; 

export default function SpaceBackground() {
  const [init, setInit] = useState(false);
  const isDarkMode = useDarkMode((state) => state.isDarkMode);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const starOptions = {
    fpsLimit: 60,
    background: {
      color: { value: "transparent" }, 
    },
    particles: {
      number: {
        value: 120, 
        density: { enable: true, area: 800 },
      },
      color: { value: "#ffffff" }, 
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.2, max: 0.9 }, 
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 }, 
      },
      move: {
        enable: true,
        speed: 0.3, 
        direction: "none",
        outModes: { default: "out" },
      },
    },
    detectRetina: true,
  };

  if (!init || !isDarkMode) return null;

  return (
    <Particles
      id="tsparticles-stars"
      options={starOptions}
    />
  );
}
