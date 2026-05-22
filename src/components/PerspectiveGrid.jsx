import React from 'react';

export default function PerspectiveGrid({ visible = true }) {
  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Expanded Ground Grid Helper to cover the entire perspective viewport */}
      <gridHelper 
        args={[100, 100, '#22332e', '#c3a67d']} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]}
      />

      {/* Subtle central crosshair indicator for floor coordinates */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#af5b44" transparent opacity={0.6} />
      </mesh>

      {/* Axis guidelines expanded to cover large ground plane */}
      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[100, 0.002, 0.012]} />
        <meshBasicMaterial color="#af5b44" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[0.012, 0.002, 100]} />
        <meshBasicMaterial color="#22332e" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
