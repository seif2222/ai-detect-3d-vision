
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TeamCard3D from './three/TeamCard3D';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRound, Code, Camera, Palette } from 'lucide-react';

const teamMembers = [
  {
    name: "سيف محمد أبوزيد خلف الله",
    nameEn: "Seif Mohammed Abouzeid",
    id: "4231474",
    role: "Backend & AI Model Engineer",
    animation: "spin" as const,
    position: [-3, 0, 0] as [number, number, number],
    icon: <Code className="h-5 w-5" />
  },
  {
    name: "يوسف عمرو محمد",
    nameEn: "Youssef Amr Mohammed",
    id: "4231263",
    role: "3D Frontend & WebGL Developer",
    animation: "float" as const,
    position: [-1, 0, 0] as [number, number, number],
    icon: <UserRound className="h-5 w-5" />
  },
  {
    name: "عبدالرحمن وائل الجمل",
    nameEn: "Abdelrahman Wael El-Gamal",
    id: "4231032",
    role: "IoT/Camera Integration Specialist",
    animation: "pulse" as const,
    position: [1, 0, 0] as [number, number, number],
    icon: <Camera className="h-5 w-5" />
  },
  {
    name: "بدير أحمد الحناوي",
    nameEn: "Bodair Ahmed El-Hennawy",
    id: "4231607",
    role: "UI/UX Designer & Tester",
    animation: "hover" as const,
    position: [3, 0, 0] as [number, number, number],
    icon: <Palette className="h-5 w-5" />
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
        
        {/* 3D Team Cards (Hidden on Mobile) */}
        <div className="h-[400px] rounded-xl glass-morphism overflow-hidden hidden lg:block">
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
        
        {/* Responsive 2D Cards for All Devices */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="glass-morphism border-white/10 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-neon-purple/20 flex items-center justify-center">
                    {member.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg mb-1 text-white">{member.name}</h3>
                      <h4 className="text-sm text-white/80 mb-2">{member.nameEn}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-neon-purple/20 text-neon-purple border-neon-purple/50">
                          ID: {member.id}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{member.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
