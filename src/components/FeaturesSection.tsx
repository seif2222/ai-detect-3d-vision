
import React from 'react';
import { Brain, Camera, Layers, Eye, Cpu, Wifi } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI Image Analysis",
    description: "Analyze uploaded images or live camera feeds to detect AI-generated content using deep learning models.",
  },
  {
    icon: Layers,
    title: "3D Interactive Interface",
    description: "Experience our platform through a beautiful 3D interface with animations and interactive elements.",
  },
  {
    icon: Camera,
    title: "Camera Integration",
    description: "Connect smart glasses or cameras via Wi-Fi/QR code for real-time analysis on the go.",
  },
  {
    icon: Eye,
    title: "Visual Heatmaps",
    description: "View detailed heatmaps highlighting areas of the image most likely to be AI-generated.",
  },
  {
    icon: Cpu,
    title: "Advanced AI Model",
    description: "Powered by state-of-the-art neural networks trained specifically to detect AI artifacts.",
  },
  {
    icon: Wifi,
    title: "IoT Connectivity",
    description: "Seamlessly connect with AR glasses and smart devices for extended capabilities.",
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gradient-primary mb-2">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with 3D visualization to bring you the most accurate image authentication.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-morphism p-6 rounded-lg card-glow transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4">
                <feature.icon className="text-neon-purple" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
