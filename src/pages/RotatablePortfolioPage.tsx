import React, { useMemo } from 'react';
import { RotatablePortfolioSphere } from '../components/3d/rotatable';
import { SphereContentItem, SphereType } from '../types/rotatable';
import { Project } from '../data/studioData';

interface RotatablePortfolioPageProps {
  onSelectProject?: (project: Project) => void;
  sphereType?: SphereType;
}

/**
 * Main rotatable portfolio page component
 * Displays 360-degree rotating sphere with portfolio content
 */
export function RotatablePortfolioPage({
  onSelectProject,
  sphereType = 'portfolio',
}: RotatablePortfolioPageProps) {
  
  // Convert project data to sphere content items
  const sphereContent = useMemo(() => {
    // This would typically come from studioData.ts
    // For now, creating placeholder content
    const content: SphereContentItem[] = [
      {
        id: 'project-1',
        title: 'Interactive Portal Windows',
        description: 'Advanced 3D portal system with raycasting',
        type: 'project',
        position: { x: 10, y: 5, z: 0 } as any,
      },
      {
        id: 'project-2',
        title: 'Enhanced Corridor Gallery',
        description: 'Scroll-driven 3D gallery with dynamic content',
        type: 'project',
        position: { x: -10, y: 5, z: 0 } as any,
      },
      {
        id: 'project-3',
        title: 'Rotatable Portfolio',
        description: '360-degree immersive 3D experience',
        type: 'project',
        position: { x: 5, y: -8, z: 5 } as any,
      },
      {
        id: 'service-1',
        title: 'Web Development',
        description: 'Full-stack web solutions',
        type: 'service',
        position: { x: -5, y: -8, z: 5 } as any,
      },
      {
        id: 'service-2',
        title: '3D Design',
        description: 'Interactive 3D experiences',
        type: 'service',
        position: { x: 0, y: 10, z: 0 } as any,
      },
    ];
    
    return content;
  }, []);

  const handleContentSelect = (item: SphereContentItem) => {
    console.log('Selected content:', item);
    // You can handle the selection here
  };

  return (
    <div className="w-full h-screen bg-white">
      <RotatablePortfolioSphere
        sphereType={sphereType}
        content={sphereContent}
        onContentSelect={handleContentSelect}
        autoRotate={false}
        theme="light"
        reducedMotion={false}
      />
    </div>
  );
}

export default RotatablePortfolioPage;
