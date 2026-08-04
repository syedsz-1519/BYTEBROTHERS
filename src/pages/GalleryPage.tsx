import React, { useEffect } from 'react';
import GalleryScene from '../components/gallery/GalleryScene';
import ScrollPanels from '../components/gallery/ScrollPanels';

export const GalleryPage: React.FC = () => {
  useEffect(() => {
    // Reset scroll position to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="gallery-container min-h-screen bg-[#05070a] overflow-x-hidden">
      {/* 3D Gallery Canvas - Fixed Background */}
      <GalleryScene
        baydepth={14}
        numBays={5}
        halfWidth={5.2}
        height={6.5}
        frameColors={[0xc9a876, 0x4a6fa5, 0xc9a876]}
      />

      {/* Scroll-driven Text Panels & HUD */}
      <ScrollPanels />
    </div>
  );
};

export default GalleryPage;
