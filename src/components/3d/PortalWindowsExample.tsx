/**
 * PortalWindowsExample.tsx
 * Example implementation showing how to integrate portal windows
 * with a corridor scene
 */

import React, { useCallback } from 'react';
import { PortalSystem, usePortalSystem } from './PortalSystem';
import { WindowMesh } from './WindowMesh';
import { PortalContentType } from '../../hooks/usePortalManager';

// Example window configuration
const PORTAL_WINDOWS = [
  {
    id: 'w-portfolio',
    type: 'portfolio' as const,
    position: [-2.5, 2.0, -15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    label: 'Portfolio',
  },
  {
    id: 'w-services',
    type: 'services' as const,
    position: [0, 2.0, -15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    label: 'Services',
  },
  {
    id: 'w-about',
    type: 'about' as const,
    position: [2.5, 2.0, -15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    label: 'About',
  },
  {
    id: 'w-contact',
    type: 'contact' as const,
    position: [-2.5, 2.0, -35] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    label: 'Contact',
  },
];

/**
 * PortalWindowsExample - Demonstrates portal window integration
 * This can be imported and rendered directly or used as a reference
 */
const PortalWindowsContent = () => {
  const { openPortal } = usePortalSystem();

  const handleWindowClick = useCallback(
    (windowId: string, type: PortalContentType) => {
      const window = PORTAL_WINDOWS.find((w) => w.id === windowId);
      if (window) {
        openPortal(type, window.position);
      }
    },
    [openPortal]
  );

  return (
    <group name="portal-windows-example">
      {PORTAL_WINDOWS.map((window) => (
        <WindowMesh
          key={window.id}
          id={window.id}
          type={window.type}
          position={window.position}
          rotation={window.rotation}
          scale={1}
          frameColor={0xc9a876} // Brass
          glassColor={0x4a8fd8} // Blue
          onClickWindow={handleWindowClick}
          isActive={false}
          animationProgress={0}
        />
      ))}
    </group>
  );
};

/**
 * Example wrapper showing full integration
 * Usage:
 * ```tsx
 * <Canvas>
 *   <PortalWindowsExampleScene />
 * </Canvas>
 * ```
 */
export const PortalWindowsExampleScene = () => {
  return (
    <PortalSystem
      maxPortals={3}
      frameColor={0xc9a876}
      glassColor={0x4a8fd8}
      autoCloseDelay={10000}
    >
      <PortalWindowsContent />
      {/* Add your existing corridor scene here */}
    </PortalSystem>
  );
};

/**
 * Alternative: Use as wrapper for existing scene
 * Usage:
 * ```tsx
 * <PortalSystemWrapper>
 *   <YourExistingScene />
 * </PortalSystemWrapper>
 * ```
 */
export const PortalSystemWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PortalSystem
      maxPortals={3}
      frameColor={0xc9a876}
      glassColor={0x4a8fd8}
      autoCloseDelay={10000}
    >
      {children}
      <PortalWindowsContent />
    </PortalSystem>
  );
};

export default PortalWindowsExampleScene;
