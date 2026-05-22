import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';
import { Sofa, Bed, Table, Lamp, Plant, Art } from './FurnitureModels';
import PerspectiveGrid from './PerspectiveGrid';

// Camera Manager updates the Three.js camera based on perspective calibration parameters
function CameraManager({ calibration }) {
  const { camera } = useThree();

  useEffect(() => {
    const { pitch, roll, height, fov } = calibration;
    
    // Set camera projection Field Of View
    camera.fov = fov;
    camera.updateProjectionMatrix();

    // Position camera
    // Standard position is back-offset, elevated by height
    const radPitch = (pitch * Math.PI) / 180;
    const radRoll = (roll * Math.PI) / 180;

    // Position camera at a distance, looking at center
    const distance = 8.0;
    
    // Calculate position based on pitch angle
    const cameraZ = distance * Math.cos(radPitch);
    const cameraY = height + distance * Math.sin(radPitch);
    
    camera.position.set(0, cameraY, cameraZ);
    camera.rotation.set(-radPitch, 0, radRoll, 'YXZ');
    
  }, [calibration, camera]);

  return null;
}

// Draggable 3D Item wrapper
function DraggableItem({ item, index, isSelected, onSelect, onMove, scaleRange }) {
  const meshRef = useRef();
  const { camera, raycaster } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // Ground plane floor
  const intersectionVec = new THREE.Vector3();

  // Handle pointer down
  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect(index);
    setIsDragging(true);
    // Capture pointer
    e.target.setPointerCapture(e.pointerId);
  };

  // Handle pointer move
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.stopPropagation();

    // Raycast onto the ground plane (Y = 0)
    raycaster.setFromCamera(e.pointer, camera);
    if (raycaster.ray.intersectPlane(planeRef.current, intersectionVec)) {
      // Calculate coordinates relative to grid center
      onMove(index, intersectionVec.x, intersectionVec.z);
    }
  };

  // Handle pointer up
  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  // Scale calculations
  const scale = (item.scale || 100) / 100;

  return (
    <group
      ref={meshRef}
      position={[item.x, item.y || 0, item.z]}
      rotation={[0, (item.rotation * Math.PI) / 180, 0]}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Furniture visual component */}
      {item.type === 'sofa' && <Sofa color={item.color} />}
      {item.type === 'bed' && <Bed color={item.color} />}
      {item.type === 'table' && <Table color={item.color} />}
      {item.type === 'lamp' && <Lamp color={item.color} />}
      {item.type === 'plant' && <Plant />}
      {item.type === 'art' && <Art color={item.color} />}

      {/* Selected Indicator Outline Ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.0, 1.05, 32]} />
          <meshBasicMaterial color="#a94f36" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// 3D Custom Wall Mesh unprojects 2D corner marks onto a vertical plane
function WallMesh({ wallPoints, wallColor, texture, calibration }) {
  const { camera } = useThree();

  const geometry = useMemo(() => {
    if (wallPoints.length < 3) return null;

    // Create a 2D shape from the points
    const shape = new THREE.Shape();
    
    // To construct the shape on our back-wall plane (Z = -4.0),
    // we map 2D canvas coordinates into 3D space by calculating their proportional positioning.
    // Normalized proportions: screen bounds are [1200, 760]. We scale to a 3D backwall size of [8.0, 5.0]
    const scaleX = (x) => ((x - 600) / 600) * 5.0;
    const scaleY = (y) => (-(y - 380) / 380) * 3.2 + (calibration.height * 0.4);

    const firstPt = wallPoints[0];
    shape.moveTo(scaleX(firstPt.x), scaleY(firstPt.y));
    for (let i = 1; i < wallPoints.length; i++) {
      const pt = wallPoints[i];
      shape.lineTo(scaleX(pt.x), scaleY(pt.y));
    }
    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [wallPoints, calibration.height]);

  // Procedural Canvas Textures for standard rendering
  const materialProps = useMemo(() => {
    const props = {
      color: wallColor,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    };

    if (texture === 'none') return props;

    // Draw procedural bump texture onto a dynamic CanvasTexture
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 128, 128);

    if (texture === 'limewash') {
      // Lime plaster soft mottling
      for (let i = 0; i < 800; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#999999' : '#777777';
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.arc(Math.random() * 128, Math.random() * 128, 8 + Math.random() * 16, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (texture === 'wood') {
      // Parallel vertical oak panels bump
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      for (let x = 0; x < 128; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 8, 64, x, 128);
        ctx.stroke();
      }
    } else if (texture === 'terrazzo') {
      // Fine terrazzo normal spots
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#aaaaaa' : '#555555';
        ctx.beginPath();
        ctx.arc(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const bumpMap = new THREE.CanvasTexture(canvas);
    bumpMap.wrapS = THREE.RepeatWrapping;
    bumpMap.wrapT = THREE.RepeatWrapping;
    bumpMap.repeat.set(3, 3);

    props.bumpMap = bumpMap;
    props.bumpScale = texture === 'wood' ? 0.04 : 0.015;

    return props;
  }, [wallColor, texture]);

  if (!geometry) return null;

  return (
    <mesh 
      geometry={geometry} 
      position={[0, 0, -4.0]} // Placed at the back wall depth
      receiveShadow
      castShadow
    >
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}

// Designer Canvas implementation
export default function DesignerCanvas({ 
  objects, 
  selectedId, 
  onSelectObject, 
  onMoveObject, 
  calibration, 
  gridVisible, 
  lighting,
  wallPoints,
  wallColor,
  wallTexture
}) {

  // Dynamic Lighting parameters matching UI moods
  const lightConfig = useMemo(() => {
    switch (lighting) {
      case 'warm':
        return {
          ambientColor: '#ffeedb',
          ambientInt: 1.4,
          dirColor: '#ffddb8',
          dirInt: 1.2,
          dirPos: [4, 6, 3]
        };
      case 'cool':
        return {
          ambientColor: '#d6ebff',
          ambientInt: 1.2,
          dirColor: '#b8dcff',
          dirInt: 1.0,
          dirPos: [-4, 6, 2]
        };
      case 'bright':
        return {
          ambientColor: '#ffffff',
          ambientInt: 2.2,
          dirColor: '#fffaed',
          dirInt: 1.8,
          dirPos: [2, 8, 4]
        };
      case 'moody':
        return {
          ambientColor: '#18241e',
          ambientInt: 0.6,
          dirColor: '#8ba498',
          dirInt: 0.8,
          dirPos: [3, 4, -1]
        };
      case 'none':
      default:
        return {
          ambientColor: '#ffffff',
          ambientInt: 1.6,
          dirColor: '#ffffff',
          dirInt: 0.8,
          dirPos: [0, 8, 0]
        };
    }
  }, [lighting]);

  return (
    <div className="designer-3d-container">
      <Canvas
        shadows
        gl={{ alpha: true, preserveDrawingBuffer: true }} // preserveDrawingBuffer enables clean screenshots
        style={{ width: '100%', height: '100%' }}
      >
        {/* Dynamic camera management */}
        <CameraManager calibration={calibration} />

        {/* Core Lighting System */}
        <ambientLight color={lightConfig.ambientColor} intensity={lightConfig.ambientInt} />
        
        {/* Dynamic Directional Shadow-casting Light */}
        <directionalLight
          color={lightConfig.dirColor}
          intensity={lightConfig.dirInt}
          position={lightConfig.dirPos}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        >
          <orthographicCamera attach="shadow-camera" args={[-6, 6, 6, -6, 0.1, 20]} />
        </directionalLight>

        {/* Perspective Calibration floor grid */}
        <PerspectiveGrid visible={gridVisible} />

        {/* 3D Custom Painted Wall Shape */}
        <WallMesh 
          wallPoints={wallPoints} 
          wallColor={wallColor} 
          texture={wallTexture} 
          calibration={calibration}
        />

        {/* Transparent floor plane to catch cast 3D shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 24]} />
          <shadowMaterial opacity={0.22} />
        </mesh>

        {/* High-fidelity Soft Contact Shadows underneath furniture */}
        <ContactShadows 
          position={[0, 0.002, 0]} 
          opacity={0.65} 
          scale={12} 
          blur={1.6} 
          far={3.0} 
        />

        {/* Staged 3D Furniture Items */}
        {objects.map((item, index) => (
          <DraggableItem
            key={index}
            item={item}
            index={index}
            isSelected={index === selectedId}
            onSelect={onSelectObject}
            onMove={onMoveObject}
          />
        ))}
      </Canvas>
    </div>
  );
}
