/**
 * InteractivePortals.tsx
 * High-level component for adding interactive portals to corridor scenes
 * Provides easy integration with existing 3D environments
 */

import React, { useCallback } from 'react';
import { usePortalSystem } from './PortalSystem';
import { PortalContentType } from '../../hooks/usePortalManager';

export interface PortalWindowConfig {
  id: string;
  type: PortalContentType;
  position: [number, number, number];
  rotation?: [number, number, number];
  label: string;
}

export interface InteractivePortalsProps {
  windows: PortalWindowConfig[];
  frameColor?: number;
  glassColor?: number;
  onWindowClick?: (windowId: string, type: PortalContentType) => void;
}

/**
 * InteractivePortals - Renders a set of interactive portal windows
 * Usage:
 * ```tsx
 * const windows = [
 *   { id: 'w1', type: 'portfolio', position: [-2.5, 2, -5], label: 'Portfolio' },
 *   { id: 'w2', type: 'services', position: [0, 2, -5], label: 'Services' },
 *   { id: 'w3', type: 'about', position: [2.5, 2, -5], label: 'About' },
 * ];
 * <InteractivePortals windows={windows} />
 * ```
 */
export const InteractivePortals = React.memo(
  ({
    windows,
    frameColor = 0xc9a876,
    glassColor = 0x4a8fd8,
    onWindowClick,
  }: InteractivePortalsProps) => {
    const { openPortal } = usePortalSystem();

    const handleWindowClick = useCallback(
      (windowId: string, type: PortalContentType) => {
        // Find window config
        const window = windows.find((w) => w.id === windowId);
        if (!window) return;

        // Call user callback if provided
        if (onWindowClick) {
          onWindowClick(windowId, type);
        }

        // Open portal at window position
        openPortal(type, window.position);
      },
      [windows, openPortal, onWindowClick]
    );

    // For now, this component is primarily used as a context consumer
    // The actual window rendering is handled by PortalSystem
    return <></>;
  }
);

InteractivePortals.displayName = 'InteractivePortals';
