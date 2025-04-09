
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Globe, Wifi } from 'lucide-react';

const Navbar: React.FC = () => {
  const [cameraConnected, setCameraConnected] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  useEffect(() => {
    // Check if camera was previously connected
    const savedCameraStatus = localStorage.getItem('cameraConnected');
    if (savedCameraStatus === 'true') {
      setCameraConnected(true);
      
      // Get selected camera name if available
      const savedCamera = localStorage.getItem('selectedCamera');
      if (savedCamera) {
        const camera = JSON.parse(savedCamera);
        setSelectedCamera(camera.label);
      }
    }

    // Listen for camera connection changes
    const handleStorageChange = () => {
      const currentStatus = localStorage.getItem('cameraConnected');
      setCameraConnected(currentStatus === 'true');
      
      // Update selected camera when connection changes
      if (currentStatus === 'true') {
        const savedCamera = localStorage.getItem('selectedCamera');
        if (savedCamera) {
          const camera = JSON.parse(savedCamera);
          setSelectedCamera(camera.label);
        }
      } else {
        setSelectedCamera(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    window.addEventListener('cameraStatusChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cameraStatusChanged', handleStorageChange);
    };
  }, []);

  const handleCameraButtonClick = () => {
    // Scroll to demo section when camera button is clicked
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          <Button 
            className={`${cameraConnected ? 'bg-neon-green' : 'bg-neon-purple'} hover:bg-opacity-80 transition-colors gap-2`}
            onClick={handleCameraButtonClick}
          >
            {cameraConnected ? (
              <>
                <Wifi className="h-5 w-5" />
                {selectedCamera ? `Camera: ${selectedCamera.split(' ')[0]}` : 'Camera Connected'}
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                Connect Camera
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
