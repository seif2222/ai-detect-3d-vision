
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full glass-morphism sticky top-0 z-50">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-neon-purple rounded-lg flex items-center justify-center">
            <Camera className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-gradient-primary">AI Image Authenticator</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="hover:text-neon-purple transition-colors">Features</a></li>
              <li><a href="#team" className="hover:text-neon-purple transition-colors">Team</a></li>
              <li><a href="#demo" className="hover:text-neon-purple transition-colors">Demo</a></li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
          <Button className="bg-neon-purple hover:bg-neon-purple/80 transition-colors">
            Connect Camera
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
