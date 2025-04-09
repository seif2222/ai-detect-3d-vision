
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TeamCard3D from './three/TeamCard3D';

const teamMembers = [
  {
    name: "سيف محمد أبوزيد خلف الله",
    id: "4231474",
    role: "Backend & AI Model Engineer",
    animation: "spin" as const,
    position: [-3, 0, 0] as [number, number, number]
  },
  {
    name: "يوسف عمرو محمد",
    id: "4231263",
    role: "3D Frontend & WebGL Developer",
    animation: "float" as const,
    position: [-1, 0, 0] as [number, number, number]
  },
  {
    name: "عبدالرحمن وائل الجمل",
    id: "4231032",
    role: "IoT/Camera Integration Specialist",
    animation: "pulse" as const,
    position: [1, 0, 0] as [number, number, number]
  },
  {
    name: "بدير أحمد الحناوي",
    id: "4231607",
    role: "UI/UX Designer & Tester",
    animation: "hover" as const,
    position: [3, 0, 0] as [number, number, number]
  }
];

const TeamSection: React.FC = () => {
  return (
    <section id="team" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gradient-primary mb-2">Development Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our talented team members who are bringing this AI image authentication platform to life.
          </p>
        </div>
        
        {/* 3D Team Cards */}
        <div className="h-[400px] rounded-xl glass-morphism overflow-hidden">
          <Suspense fallback={<div className="h-full flex items-center justify-center">Loading 3D Team...</div>}>
            <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              {teamMembers.map((member, index) => (
                <TeamCard3D
                  key={index}
                  name={member.name}
                  id={member.id}
                  role={member.role}
                  position={member.position}
                  animation={member.animation}
                />
              ))}
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </Suspense>
        </div>
        
        {/* Fallback 2D Cards for Mobile */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="glass-morphism p-6 rounded-lg card-glow animate-pulse-glow">
              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-neon-purple mb-2">ID: {member.id}</p>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
