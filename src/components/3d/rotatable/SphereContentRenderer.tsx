import React, { useMemo, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  SphereContentItem,
  PositionedContent,
  LODLevel,
} from '../../../types/rotatable';
import { getSphericalCoordinates, getLODLevel } from '../../../utils/sphereMath';
import { ContentBillboard } from './ContentBillboard';

interface SphereContentRendererProps {
  items: SphereContentItem[];
  sphereRadius: number;
  onItemSelect: (item: SphereContentItem) => void;
  theme?: 'dark' | 'light';
}

/**
 * Renders content items positioned on sphere surface
 */
export function SphereContentRenderer({
  items,
  sphereRadius,
  onItemSelect,
  theme = 'dark',
}: SphereContentRendererProps) {
  const { camera } = useThree();

  // Position items on sphere using spherical coordinates
  const positionedItems = useMemo(() => {
    return items.map((item, index) => {
      const position = getSphericalCoordinates(index, items.length, sphereRadius);
      const distance = position.distanceTo(
        camera.position as THREE.Vector3
      );
      const lodLevel = getLODLevel(distance, 5, 15);

      return {
        ...item,
        position,
        distanceFromCamera: distance,
        lodLevel,
        isVisible: true,
      } as PositionedContent;
    });
  }, [items, sphereRadius, camera.position]);

  // Sort by distance for rendering order
  const sortedItems = useMemo(() => {
    return [...positionedItems].sort(
      (a, b) => b.distanceFromCamera - a.distanceFromCamera
    );
  }, [positionedItems]);

  return (
    <>
      {sortedItems.map((item) => (
        <ContentBillboard
          key={item.id}
          item={item}
          lodLevel={item.lodLevel}
          onSelect={() => onItemSelect(item)}
          theme={theme}
        />
      ))}
    </>
  );
}

export default SphereContentRenderer;
