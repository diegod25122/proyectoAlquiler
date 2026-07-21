import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, Html } from '@react-three/drei';

function Modelo({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function VisorHerramienta3D({ modelUrl }) {
  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-900 text-gray-400 rounded-lg">
        Selecciona o genera una herramienta para ver en 3D
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={<Html center><span className="text-white font-semibold">Cargando modelo 3D...</span></Html>}>
          <Stage environment="city" intensity={0.6}>
            <Modelo url={modelUrl} />
          </Stage>
        </Suspense>

        {/* Permite rotar con el clic del mouse y hacer zoom */}
        <OrbitControls autoRotate enableZoom={true} />
      </Canvas>
    </div>
  );
}