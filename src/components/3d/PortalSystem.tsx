/**
 * PortalSystem.tsx
 * Main portal window system orchestration
 * Manages portal state, animations, and rendering
 */

import React, { useRef, useCallback, useEffect, useContext, createContext, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WindowMesh } from './WindowMesh';
import { usePortalManager, PortalContentType, Portal } from '../../hooks/usePortalManager';

// Context for portal system coordination
interface PortalSystemContextType {
  openPortal: (type: PortalContentType, position: [number, number, number]) => void;
  closePortal: (id: string) => void;
  getPortalState: (id: string) => Portal | undefined;
}

const PortalSystemContext = createContext<PortalSystemContextType | null>(null);

export const usePortalSystem = () => {
  const ctx = useContext(PortalSystemContext);
  if (!ctx) {
    throw new Error('usePortalSystem must be used within PortalSystem');
  }
  return ctx;
};

export interface PortalSystemProps {
  children?: React.ReactNode;
  maxPortals?: number;
  frameColor?: number;
  glassColor?: number;
  autoCloseDelay?: number;
}

/**
 * Portal animation state tracker
 */
interface PortalAnimationState {
  portalId: string;
  targetScale: number;
  targetOpacity: number;
  isClosing: boolean;
}

/**
 * PortalSystem - Main component managing portal windows
 * Features:
 * - Portal lifecycle management
 * - Animation orchestration
 * - Max portal enforcement
 * - Efficient state updates
 * - Context provider for children
 */
export const PortalSystem = React.memo(
  ({
    children,
    maxPortals = 3,
    frameColor = 0xc9a876,
    glassColor = 0x4a8fd8,
    autoCloseDelay = 10000,
  }: PortalSystemProps) => {
    const {
      portals,
      openPortal: managerOpen,
      closePortal: managerClose,
      updatePortal,
      getPortal,
    } = usePortalManager();

    const animationRef = useRef<Map<string, PortalAnimationState>>(new Map());
    const autoCloseTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

    /**
     * Wrapped openPortal with animation setup
     */
    const handleOpenPortal = useCallback(
      (type: PortalContentType, position: [number, number, number]) => {
        // Check if max portals already open
        if (portals.length >= maxPortals) {
          return; // Max reached, ignore
        }

        managerOpen(type, position);
      },
      [portals.length, maxPortals, managerOpen]
    );

    /**
     * Wrapped closePortal with animation cleanup
     */
    const handleClosePortal = useCallback((id: string) => {
      // Cancel auto-close timeout
      if (autoCloseTimeoutsRef.current.has(id)) {
        clearTimeout(autoCloseTimeoutsRef.current.get(id)!);
        autoCloseTimeoutsRef.current.delete(id);
      }

      // Mark as closing and animate out
      const state = animationRef.current.get(id);
      if (state) {
        state.isClosing = true;
        state.targetScale = 0;
        state.targetOpacity = 0;
      }

      // Actually remove after animation completes
      setTimeout(() => {
        managerClose(id);
        animationRef.current.delete(id);
      }, 400); // Match animation duration
    }, [managerClose]);

    /**
     * Handle window click - open portal
     */
    const handleClickWindow = useCallback(
      (windowId: string, type: PortalContentType) => {
        // Get window position from somewhere (passed via context or props)
        // For now, use default positions based on window index
        const positions: Record<string, [number, number, number]> = {
          'window-0': [-2.5, 2, -5],
          'window-1': [0, 2, -5],
          'window-2': [2.5, 2, -5],
          'window-3': [-2.5, 2, -20],
          'window-4': [0, 2, -20],
          'window-5': [2.5, 2, -20],
        };

        const position = positions[windowId] || [0, 2, -5];
        handleOpenPortal(type, position);
      },
      [handleOpenPortal]
    );

    /**
     * Setup animation state for new portals
     */
    useEffect(() => {
      portals.forEach((portal) => {
        if (!animationRef.current.has(portal.id)) {
          animationRef.current.set(portal.id, {
            portalId: portal.id,
            targetScale: 1,
            targetOpacity: 1,
            isClosing: false,
          });

          // Set auto-close timeout
          const timeout = setTimeout(() => {
            handleClosePortal(portal.id);
          }, autoCloseDelay);
          autoCloseTimeoutsRef.current.set(portal.id, timeout);
        }
      });
    }, [portals, autoCloseDelay, handleClosePortal]);

    /**
     * Animation frame - update portal animations
     */
    useFrame(() => {
      animationRef.current.forEach((state) => {
        const portal = getPortal(state.portalId);
        if (!portal) return;

        // Lerp scale toward target
        const newScale = THREE.MathUtils.lerp(
          portal.scale,
          state.targetScale,
          0.15
        );

        // Lerp opacity toward target
        const newOpacity = THREE.MathUtils.lerp(
          portal.opacity,
          state.targetOpacity,
          0.15
        );

        updatePortal(state.portalId, {
          scale: newScale,
          opacity: newOpacity,
        });
      });
    });

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
      return () => {
        autoCloseTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
        autoCloseTimeoutsRef.current.clear();
        animationRef.current.clear();
      };
    }, []);

    const contextValue: PortalSystemContextType = useMemo(
      () => ({
        openPortal: handleOpenPortal,
        closePortal: handleClosePortal,
        getPortalState: getPortal,
      }),
      [handleOpenPortal, handleClosePortal, getPortal]
    );

    return (
      <PortalSystemContext.Provider value={contextValue}>
        {/* Render portal windows */}
        <group name="portal-system">
          {portals.map((portal) => (
            <WindowMesh
              key={portal.id}
              id={portal.id}
              type={portal.type}
              position={portal.position}
              scale={portal.scale}
              frameColor={frameColor}
              glassColor={glassColor}
              onClickWindow={handleClickWindow}
              isActive={!portal.isLoading}
              animationProgress={portal.opacity}
            />
          ))}
        </group>

        {children}
      </PortalSystemContext.Provider>
    );
  }
);

PortalSystem.displayName = 'PortalSystem';
