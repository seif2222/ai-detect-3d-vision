
import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-morphism py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gradient-primary">AI Image Authenticator</h3>
            <p className="text-sm text-muted-foreground mt-1">Detect AI-generated images with advanced 3D visualization</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-neon-purple transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-neon-purple transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AI Image Authenticator Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
