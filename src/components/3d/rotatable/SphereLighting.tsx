import React from 'react';
import * as THREE from 'three';
import { LightingConfig } from '../../../types/rotatable';

interface SphereLightingProps {
  config: LightingConfig;
}

/**
 * Lighting setup for sphere environment
 */
export function SphereLighting({ config }: SphereLightingProps) {
  return (
    <>
      {/* Ambient light - provides base illumination */}
      <ambientLight
        color={config.ambient.color}
        intensity={config.ambient.intensity}
      />

      {/* Directional light - simulates sun */}
      <directionalLight
        color={config.directional.color}
        intensity={config.directional.intensity}
        position={[
          config.directional.position.x,
          config.directional.position.y,
          config.directional.position.z,
        ]}
        castShadow
      />

      {/* Point light - focus highlight */}
      <pointLight
        color={config.point.color}
        intensity={config.point.intensity}
        distance={config.point.distance}
        position={[
          config.point.position.x,
          config.point.position.y,
          config.point.position.z,
        ]}
      />
    </>
  );
}

export default SphereLighting;
