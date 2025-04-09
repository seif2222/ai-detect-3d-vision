
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 15;
    positions[i3 + 1] = (Math.random() - 0.5) * 15;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;
    
    const colorIndex = Math.floor(Math.random() * 3);
    
    if (colorIndex === 0) {
      // Purple
      colors[i3] = 139/255;
      colors[i3 + 1] = 92/255;
      colors[i3 + 2] = 246/255;
    } else if (colorIndex === 1) {
      // Blue
      colors[i3] = 30/255;
      colors[i3 + 1] = 174/255;
      colors[i3 + 2] = 219/255;
    } else {
      // Pink
      colors[i3] = 236/255;
      colors[i3 + 1] = 72/255;
      colors[i3 + 2] = 153/255;
    }
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <color attach="background" args={["#0a0b10"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <FloatingParticles />
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} />
      </Canvas>
    </div>
  );
};

export default Background3D;
