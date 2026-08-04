/**
 * usePortalManager.ts
 * Portal state management hook for interactive corridor windows
 * Handles portal lifecycle, animations, and content loading
 */

import { useCallback, useRef, useState, useEffect } from 'react';

export type PortalContentType = 'portfolio' | 'services' | 'about' | 'contact';

export interface Portal {
  id: string;
  type: PortalContentType;
  isOpen: boolean;
  isLoading: boolean;
  content: string | null;
  position: [number, number, number];
  scale: number;
  opacity: number;
  createdAt: number;
}

export interface UsePortalManagerReturn {
  portals: Portal[];
  activeCount: number;
  maxPortals: number;
  openPortal: (type: PortalContentType, position: [number, number, number]) => void;
  closePortal: (id: string) => void;
  closeOldestPortal: () => void;
  getPortal: (id: string) => Portal | undefined;
  updatePortal: (id: string, updates: Partial<Portal>) => void;
}

const MAX_PORTALS = 3;

/**
 * Portal content loaders with lazy loading
 */
const portalLoaders: Record<PortalContentType, () => Promise<string>> = {
  portfolio: async () => {
    // Simulate content loading delay
    await new Promise(r => setTimeout(r, 500));
    return 'Portfolio Content';
  },
  services: async () => {
    await new Promise(r => setTimeout(r, 500));
    return 'Services Content';
  },
  about: async () => {
    await new Promise(r => setTimeout(r, 500));
    return 'About Content';
  },
  contact: async () => {
    await new Promise(r => setTimeout(r, 500));
    return 'Contact Content';
  },
};

/**
 * usePortalManager - Manages portal window state and lifecycle
 * Implements max portal limit, lazy loading, and cleanup
 */
export function usePortalManager(): UsePortalManagerReturn {
  const [portals, setPortals] = useState<Portal[]>([]);
  const portalIdRef = useRef(0);
  const loadingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  /**
   * Generate unique portal ID
   */
  const generatePortalId = useCallback((): string => {
    return `portal-${portalIdRef.current++}`;
  }, []);

  /**
   * Open a new portal with content lazy loading
   */
  const openPortal = useCallback((
    type: PortalContentType,
    position: [number, number, number],
  ) => {
    setPortals((current) => {
      // Check if max portals reached
      if (current.length >= MAX_PORTALS) {
        // Don't add new portal if max reached
        return current;
      }

      const id = generatePortalId();
      const newPortal: Portal = {
        id,
        type,
        isOpen: true,
        isLoading: true,
        content: null,
        position,
        scale: 0,
        opacity: 0,
        createdAt: Date.now(),
      };

      // Lazy load content asynchronously
      const loader = portalLoaders[type];
      if (loader) {
        const timeout = setTimeout(async () => {
          try {
            const content = await loader();
            setPortals((prev) =>
              prev.map((p) =>
                p.id === id
                  ? { ...p, content, isLoading: false }
                  : p
              )
            );
          } catch (error) {
            console.error(`Failed to load portal content for ${type}:`, error);
            setPortals((prev) =>
              prev.map((p) =>
                p.id === id
                  ? { ...p, isLoading: false, content: 'Error loading content' }
                  : p
              )
            );
          }
          delete loadingTimeoutsRef.current[id];
        }, 100);
        loadingTimeoutsRef.current[id] = timeout;
      }

      return [...current, newPortal];
    });
  }, [generatePortalId]);

  /**
   * Close a specific portal
   */
  const closePortal = useCallback((id: string) => {
    // Clear any pending timeout
    if (loadingTimeoutsRef.current[id]) {
      clearTimeout(loadingTimeoutsRef.current[id]);
      delete loadingTimeoutsRef.current[id];
    }

    setPortals((current) =>
      current.filter((p) => p.id !== id)
    );
  }, []);

  /**
   * Close the oldest portal (FIFO)
   */
  const closeOldestPortal = useCallback(() => {
    setPortals((current) => {
      if (current.length === 0) return current;
      const oldest = current.reduce((a, b) =>
        a.createdAt < b.createdAt ? a : b
      );
      return current.filter((p) => p.id !== oldest.id);
    });
  }, []);

  /**
   * Get a portal by ID
   */
  const getPortal = useCallback((id: string): Portal | undefined => {
    return portals.find((p) => p.id === id);
  }, [portals]);

  /**
   * Update portal properties
   */
  const updatePortal = useCallback((id: string, updates: Partial<Portal>) => {
    setPortals((current) =>
      current.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      )
    );
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      Object.values(loadingTimeoutsRef.current).forEach((t) =>
        clearTimeout(t)
      );
    };
  }, []);

  return {
    portals,
    activeCount: portals.length,
    maxPortals: MAX_PORTALS,
    openPortal,
    closePortal,
    closeOldestPortal,
    getPortal,
    updatePortal,
  };
}
