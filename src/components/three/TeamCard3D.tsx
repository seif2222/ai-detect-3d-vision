
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TeamCardProps {
  name: string;
  id: string;
  role: string;
  position: [number, number, number];
  animation: 'spin' | 'float' | 'pulse' | 'hover';
}

const TeamCard3D: React.FC<TeamCardProps> = ({ name, id, role, position, animation }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    if (animation === 'spin') {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    } else if (animation === 'float') {
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime()) * 0.1;
    } else if (animation === 'pulse') {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (animation === 'hover') {
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
    
    if (hovered) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.8, 2.2, 0.1]} />
        <meshStandardMaterial 
          color={hovered ? "#8B5CF6" : "#1E1E2E"} 
          roughness={0.3}
          metalness={0.7}
          emissive={hovered ? "#8B5CF6" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        
        <Text
          position={[0, 0.7, 0.06]}
          fontSize={0.12}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
          textAlign="center"
          font="/fonts/NotoSansArabic-Bold.ttf"
        >
          {name}
        </Text>
        
        <Text
          position={[0, 0.3, 0.06]}
          fontSize={0.1}
          color="#8B5CF6"
          anchorX="center"
          anchorY="middle"
          font="/fonts/NotoSansArabic-Medium.ttf"
        >
          ID: {id}
        </Text>
        
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.08}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
          textAlign="center"
          font="/fonts/NotoSansArabic-Regular.ttf"
        >
          {role}
        </Text>
      </mesh>
    </group>
  );
};

export default TeamCard3D;
