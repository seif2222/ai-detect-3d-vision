import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image as ImageIcon, AlertTriangle, Wifi, ChevronDown } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CameraDevice {
  deviceId: string;
  label: string;
}

const DemoSection: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConnectingCamera, setIsConnectingCamera] = useState(false);
  const [cameraConnected, setCameraConnected] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(null);
  const [result, setResult] = useState<{
    isAI: boolean;
    confidence: number;
    areas: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if camera was previously connected
    const savedCameraStatus = localStorage.getItem('cameraConnected');
    if (savedCameraStatus === 'true') {
      setCameraConnected(true);
      
      // Load saved camera if available
      const savedCamera = localStorage.getItem('selectedCamera');
      if (savedCamera) {
        setSelectedCamera(JSON.parse(savedCamera));
      }
    }
    
    // Get available cameras
    listAvailableCameras();
  }, []);
  
  const listAvailableCameras = async () => {
    try {
      // Check if browser supports mediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        toast.error("Your browser doesn't support camera access");
        return;
      }
      
      // Request camera permissions first
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Get all media devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Filter for video input devices (cameras)
      const cameras = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`
        }));
      
      setAvailableCameras(cameras);
      
      // If we have cameras and none selected, select the first one
      if (cameras.length > 0 && !selectedCamera) {
        const savedCamera = localStorage.getItem('selectedCamera');
        if (savedCamera) {
          setSelectedCamera(JSON.parse(savedCamera));
        } else {
          setSelectedCamera(cameras[0]);
        }
      }
    } catch (error) {
      console.error("Error listing cameras:", error);
      toast.error("Failed to list available cameras");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      toast.success("Image uploaded successfully!");
    }
  };

  const connectToWifiCamera = async () => {
    if (!selectedCamera) {
      toast.error("Please select a camera first");
      return;
    }
    
    setIsConnectingCamera(true);
    
    try {
      // Request access to the specific camera
      await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedCamera.deviceId }
        }
      });
      
      // Log the connection attempt to Supabase
      await supabase
        .from('image_analysis_logs')
        .insert({
          analyzed_at: new Date().toISOString(),
          source_type: 'wifi-camera'
        });
      
      // Save the camera selection and connection status
      localStorage.setItem('selectedCamera', JSON.stringify(selectedCamera));
      localStorage.setItem('cameraConnected', 'true');
      
      // Dispatch event for Navbar to update
      window.dispatchEvent(new Event('cameraStatusChanged'));
      
      setCameraConnected(true);
      setIsConnectingCamera(false);
      toast.success(`Connected to ${selectedCamera.label}`);
    } catch (error) {
      console.error("Camera connection error:", error);
      setIsConnectingCamera(false);
      toast.error("Failed to connect to camera");
    }
  };

  const disconnectCamera = () => {
    setCameraConnected(false);
    localStorage.removeItem('cameraConnected');
    
    // Dispatch event for Navbar to update
    window.dispatchEvent(new Event('cameraStatusChanged'));
    
    toast.info("Camera disconnected");
  };

  const handleCameraCapture = () => {
    if (!cameraConnected) {
      toast.error("Please connect to a camera first");
      return;
    }
    
    // Simulate capturing image from connected camera
    const dummyImages = [
      '/placeholder.svg',
      'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9'
    ];
    
    const randomImage = dummyImages[Math.floor(Math.random() * dummyImages.length)];
    setImagePreview(randomImage);
    setResult(null);
    toast.success("Image captured from camera!");
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      toast.error("Please upload an image first");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Log the analysis attempt to Supabase
      await supabase
        .from('image_analysis_logs')
        .insert({
          analyzed_at: new Date().toISOString(),
          source_type: 'upload'
        });
      
      // Simulate AI analysis (for demo purposes)
      setTimeout(() => {
        const isAIGenerated = Math.random() > 0.5; // Random result for demo
        const confidenceScore = 70 + Math.floor(Math.random() * 25);
        
        // Update the analysis result
        setIsAnalyzing(false);
        setResult({
          isAI: isAIGenerated,
          confidence: confidenceScore,
          areas: ['Face features', 'Background inconsistency', 'Lighting artifacts']
        });
        
        // Also log the result to Supabase
        supabase
          .from('image_analysis_logs')
          .update({
            is_ai: isAIGenerated,
            confidence: confidenceScore
          })
          .eq('analyzed_at', new Date().toISOString())
          .then(({ error }) => {
            if (error) console.error("Error updating analysis result:", error);
          });
        
        toast.success("Analysis complete!");
      }, 2000);
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      toast.error("There was an error analyzing the image");
    }
  };

  const handleCameraSelection = (camera: CameraDevice) => {
    setSelectedCamera(camera);
    localStorage.setItem('selectedCamera', JSON.stringify(camera));
    
    // If already connected, disconnect first
    if (cameraConnected) {
      disconnectCamera();
    }
  };

  return (
    <section id="demo" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gradient-primary mb-2">Try It Yourself</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload an image to see our AI detection in action. We'll analyze it and show you if it was generated by AI.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto glass-morphism rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div 
                className="h-80 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                style={{
                  backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={handleUploadClick}
              >
                {!imagePreview && (
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Click here to upload an image</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  className="bg-neon-purple hover:bg-neon-purple/80 transition-colors flex-1 gap-2"
                  onClick={handleUploadClick}
                >
                  <Upload size={18} />
                  Select Image
                </Button>
                <input
                  type="file"
                  id="image-upload"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                <Button 
                  variant="outline" 
                  className="border-neon-blue text-neon-blue hover:bg-neon-blue/10 flex-1 gap-2"
                  onClick={handleCameraCapture}
                  disabled={!cameraConnected}
                >
                  <Camera size={18} />
                  Use Camera
                </Button>
                
                {!cameraConnected ? (
                  <div className="flex-1 flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 border-neon-green text-neon-green hover:bg-neon-green/10">
                          {selectedCamera ? selectedCamera.label : "Select Camera"}
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {availableCameras.length > 0 ? (
                          availableCameras.map((camera) => (
                            <DropdownMenuItem 
                              key={camera.deviceId}
                              onClick={() => handleCameraSelection(camera)}
                              className="cursor-pointer"
                            >
                              {camera.label}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>No cameras found</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button 
                      className="bg-neon-green hover:bg-neon-green/80 transition-colors gap-2"
                      onClick={connectToWifiCamera}
                      disabled={isConnectingCamera || !selectedCamera}
                    >
                      {isConnectingCamera ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Wifi size={18} />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10 flex-1 gap-2"
                    onClick={disconnectCamera}
                  >
                    <Wifi size={18} />
                    Disconnect Camera
                  </Button>
                )}
              </div>
              
              {cameraConnected && (
                <div className="mt-3 flex items-center gap-2 text-neon-green">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                  <span className="text-sm">
                    {selectedCamera ? `Connected to ${selectedCamera.label}` : "Wi-Fi Camera Connected"}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              
              {!imagePreview && (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Upload an image to see the results</p>
                </div>
              )}
              
              {imagePreview && !result && !isAnalyzing && (
                <div className="flex-1 flex items-center justify-center flex-col">
                  <p className="text-muted-foreground mb-4">Ready to analyze</p>
                  <Button 
                    onClick={handleAnalyze} 
                    className="bg-neon-blue hover:bg-neon-blue/80 transition-colors"
                  >
                    Analyze Now
                  </Button>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="flex-1 flex items-center justify-center flex-col">
                  <div className="w-12 h-12 rounded-full border-4 border-neon-purple border-t-transparent animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Analyzing image...</p>
                </div>
              )}
              
              {result && (
                <div className="flex-1 flex flex-col">
                  <div className={`p-4 rounded-lg mb-4 ${result.isAI ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                    <div className="flex items-center">
                      {result.isAI ? (
                        <AlertTriangle className="text-red-400 mr-2" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-green-500 mr-2"></div>
                      )}
                      <h4 className="font-semibold">
                        {result.isAI ? 'AI-Generated Image Detected' : 'Authentic Image'}
                      </h4>
                    </div>
                    <p className="mt-2 text-sm">
                      Confidence: <span className="font-semibold">{result.confidence}%</span>
                    </p>
                  </div>
                  
                  {result.isAI && (
                    <div>
                      <h4 className="font-semibold mb-2">Suspicious Areas:</h4>
                      <ul className="space-y-2">
                        {result.areas.map((area, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
