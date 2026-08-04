/**
 * PortalContent.tsx
 * Renders portal window content to a texture for display on glass
 * Implements render-to-texture for efficient content display
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PortalContentType } from '../../hooks/usePortalManager';

export interface PortalContentProps {
  id: string;
  type: PortalContentType;
  isLoading: boolean;
  content: React.ReactNode | null;
  isVisible: boolean;
}

const CONTENT_TEXTURE_WIDTH = 512;
const CONTENT_TEXTURE_HEIGHT = 680;

/**
 * Generate content for different portal types
 */
function getPortalContent(type: PortalContentType): string {
  const contentMap: Record<PortalContentType, string> = {
    portfolio: 'Portfolio\n\nView our recent projects and case studies.',
    services: 'Services\n\nWeb Development, Mobile Apps, 3D Design.',
    about: 'About Us\n\nByte Brothers - Innovative Tech Solutions.',
    contact: 'Contact\n\nGet in touch with our team today!',
  };
  return contentMap[type];
}

/**
 * Canvas element for rendering content to texture
 * Used with OffscreenCanvas for performance
 */
class ContentRenderer {
  private canvas: OffscreenCanvas | HTMLCanvasElement;
  private ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null;
  private texture: THREE.CanvasTexture | null = null;

  constructor(width: number, height: number) {
    try {
      // Try OffscreenCanvas for better performance
      this.canvas = new OffscreenCanvas(width, height);
    } catch {
      // Fallback to HTMLCanvas for older browsers
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      throw new Error('Failed to get canvas context');
    }
  }

  /**
   * Render content to canvas and return as texture
   */
  public renderContent(
    type: PortalContentType,
    isLoading: boolean
  ): THREE.CanvasTexture {
    if (!this.ctx) {
      throw new Error('Canvas context not initialized');
    }

    const width = this.canvas.width as number;
    const height = this.canvas.height as number;

    // Clear canvas with gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1f26');
    gradient.addColorStop(1, '#0d1117');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Draw border
    this.ctx.strokeStyle = '#c9a876';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(2, 2, width - 4, height - 4);

    // Setup text rendering
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 28px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    const padding = 40;
    const contentX = width / 2;
    const contentY = padding;

    // Draw content
    if (isLoading) {
      this.ctx.font = 'bold 20px Arial, sans-serif';
      this.ctx.fillText('Loading...', contentX, contentY);

      // Draw loading spinner
      this.drawSpinner(width / 2, height / 2 + 50, 30);
    } else {
      const content = getPortalContent(type);
      const lines = content.split('\n');

      let y = contentY;
      for (const line of lines) {
        if (line === '') {
          y += 30;
          continue;
        }

        if (lines.indexOf(line) === 0) {
          // Title
          this.ctx.font = 'bold 32px Arial, sans-serif';
          this.ctx.fillStyle = '#c9a876';
        } else {
          // Body text
          this.ctx.font = '16px Arial, sans-serif';
          this.ctx.fillStyle = '#b0b5ba';
        }

        // Wrap long text
        const wrappedLines = this.wrapText(line, width - padding * 2);
        for (const wrappedLine of wrappedLines) {
          this.ctx.fillText(wrappedLine, contentX, y);
          y += 24;
        }
      }
    }

    // Create texture from canvas
    if (this.texture) {
      this.texture.dispose();
    }

    const canvasImage = (this.canvas instanceof OffscreenCanvas)
      ? this.canvas as any // OffscreenCanvas can be used as CanvasImageSource
      : (this.canvas as HTMLCanvasElement);

    this.texture = new THREE.CanvasTexture(canvasImage);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.needsUpdate = true;

    return this.texture;
  }

  /**
   * Wrap text to fit width
   */
  private wrapText(text: string, maxWidth: number): string[] {
    if (!this.ctx) return [text];

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Draw simple loading spinner
   */
  private drawSpinner(x: number, y: number, radius: number) {
    if (!this.ctx) return;

    this.ctx.strokeStyle = '#c9a876';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 1.5);
    this.ctx.stroke();
  }

  /**
   * Cleanup
   */
  public dispose() {
    if (this.texture) {
      this.texture.dispose();
    }
  }
}

/**
 * PortalContent - Renders and manages portal window content texture
 * Efficiently renders content to a texture that can be applied to portal glass
 */
export const PortalContent = React.memo(
  ({
    id,
    type,
    isLoading,
    content,
    isVisible,
  }: PortalContentProps) => {
    const renderer = useMemo(
      () => new ContentRenderer(CONTENT_TEXTURE_WIDTH, CONTENT_TEXTURE_HEIGHT),
      []
    );

    useEffect(() => {
      return () => {
        renderer.dispose();
      };
    }, [renderer]);

    // Render content to texture on update
    const texture = useMemo(() => {
      return renderer.renderContent(type, isLoading);
    }, [renderer, type, isLoading]);

    return null; // This component is used via hook for texture management
  }
);

PortalContent.displayName = 'PortalContent';

/**
 * Hook for managing portal content rendering
 */
export function usePortalContentTexture(
  type: PortalContentType,
  isLoading: boolean
): THREE.CanvasTexture {
  const renderer = useRef<ContentRenderer | null>(null);

  if (!renderer.current) {
    renderer.current = new ContentRenderer(
      CONTENT_TEXTURE_WIDTH,
      CONTENT_TEXTURE_HEIGHT
    );
  }

  return useMemo(() => {
    if (!renderer.current) {
      throw new Error('Renderer not initialized');
    }
    return renderer.current.renderContent(type, isLoading);
  }, [type, isLoading]);
}
