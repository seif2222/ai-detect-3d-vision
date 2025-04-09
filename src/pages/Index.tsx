
import React, { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TeamSection from '@/components/TeamSection';
import DemoSection from '@/components/DemoSection';

// Lazy load the 3D background for better performance
const Background3D = lazy(() => import('@/components/three/Background3D'));

const Index = () => {
  return (
    <Layout>
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-[#0a0b10]"></div>}>
        <Background3D />
      </Suspense>
      
      <HeroSection />
      <FeaturesSection />
      <TeamSection />
      <DemoSection />
    </Layout>
  );
};

export default Index;
