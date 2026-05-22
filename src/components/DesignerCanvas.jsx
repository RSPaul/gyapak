import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ContactShadows, Html, RoundedBox } from '@react-three/drei';
import { Sofa, Bed, Table, Lamp, Plant, Art, Chair, TV, Laptop } from './FurnitureModels';
import PerspectiveGrid from './PerspectiveGrid';

// Real-world reference dimensions in millimeters (at 100% scale)
const FURNITURE_SPECS = {
  sofa: { w: 2.22, d: 0.92, h: 0.72, wMm: 2200, dMm: 920, hMm: 720 },
  bed: { w: 2.0, d: 2.1, h: 1.1, wMm: 2000, dMm: 2100, hMm: 1100 },
  table: { w: 1.3, d: 1.3, h: 0.75, wMm: 1300, dMm: 1300, hMm: 750 }, // Square table spec
  chair: { w: 0.65, d: 0.65, h: 0.95, wMm: 650, dMm: 650, hMm: 950 },
  tv: { w: 1.2, d: 0.22, h: 0.8, wMm: 1200, dMm: 220, hMm: 800 },
  laptop: { w: 0.35, d: 0.25, h: 0.22, wMm: 350, dMm: 250, hMm: 220 },
  lamp: { w: 0.45, d: 0.45, h: 1.8, wMm: 450, dMm: 450, hMm: 1800 },
  plant: { w: 0.6, d: 0.6, h: 1.4, wMm: 600, dMm: 600, hMm: 1400 },
  art: { w: 0.9, d: 0.04, h: 1.2, wMm: 900, dMm: 40, hMm: 1200 }
};

// Champagne Gold CAD-Style Dimension Overlay Component
function DimensionOverlay({ type, itemScale }) {
  const spec = FURNITURE_SPECS[type];
  if (!spec) return null;

  const { w, d, h, wMm, dMm, hMm } = spec;

  // Projection offsets for clean CAD styling
  const offset = 0.22; // Distance of dimension lines from the furniture boundary (22cm)
  const extLen = 0.28; // Length of thin extension lines (28cm)
  
  // Real-time scaled dimensions in millimeters
  const currentWidth = Math.round(wMm * itemScale);
  const currentDepth = Math.round(dMm * itemScale);
  const currentHeight = Math.round(hMm * itemScale);

  return (
    <group>
      {/* 1. WIDTH OVERLAY (Front bottom along X-axis) */}
      <group position={[0, 0.01, d / 2 + offset]}>
        {/* Main Dimension Line */}
        <mesh>
          <boxGeometry args={[w, 0.005, 0.005]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        
        {/* End Tick Marks (45-degree CAD ticks) */}
        <mesh position={[-w / 2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.008, 0.008]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <mesh position={[w / 2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.008, 0.008]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>

        {/* Floating Millimeter Label */}
        <Html position={[0, 0.12, 0.04]} center distanceFactor={6}>
          <div style={{
            background: 'rgba(15, 15, 15, 0.92)',
            border: '1px solid #c5a880',
            color: '#fdfdfd',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: '600',
            fontFamily: '"Outfit", "Inter", sans-serif',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#c5a880', fontSize: '9px', fontWeight: '400' }}>W:</span>
            {currentWidth}mm
          </div>
        </Html>
      </group>
      
      {/* Width Extension Lines */}
      <mesh position={[-w / 2, 0.01, d / 2 + extLen / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.003, 0.003, extLen]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.5} />
      </mesh>
      <mesh position={[w / 2, 0.01, d / 2 + extLen / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.003, 0.003, extLen]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.5} />
      </mesh>

      {/* 2. DEPTH OVERLAY (Right bottom along Z-axis) */}
      <group position={[w / 2 + offset, 0.01, 0]}>
        {/* Main Dimension Line */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[d, 0.005, 0.005]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        
        {/* End Tick Marks (45-degree CAD ticks) */}
        <mesh position={[0, 0, -d / 2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.008, 0.008]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <mesh position={[0, 0, d / 2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.008, 0.008]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>

        {/* Floating Millimeter Label */}
        <Html position={[0.04, 0.12, 0]} center distanceFactor={6}>
          <div style={{
            background: 'rgba(15, 15, 15, 0.92)',
            border: '1px solid #c5a880',
            color: '#fdfdfd',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: '600',
            fontFamily: '"Outfit", "Inter", sans-serif',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#c5a880', fontSize: '9px', fontWeight: '400' }}>D:</span>
            {currentDepth}mm
          </div>
        </Html>
      </group>

      {/* Depth Extension Lines */}
      <mesh position={[w / 2 + extLen / 2, 0.01, -d / 2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.003, 0.003, extLen]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.5} />
      </mesh>
      <mesh position={[w / 2 + extLen / 2, 0.01, d / 2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.003, 0.003, extLen]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.5} />
      </mesh>

      {/* 3. HEIGHT OVERLAY (Vertical along Y-axis, placed at back-left corner) */}
      <group position={[-w / 2 - offset, h / 2, -d / 2]}>
        {/* Main Dimension Line */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[h, 0.005, 0.005]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        
        {/* End Tick Marks (45-degree CAD ticks) */}
        <mesh position={[0, -h / 2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.008, 0.008]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <mesh position={[0, h / 2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.008, 0.008]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>

        {/* Floating Millimeter Label */}
        <Html position={[-0.04, 0, 0]} center distanceFactor={6}>
          <div style={{
            background: 'rgba(15, 15, 15, 0.92)',
            border: '1px solid #c5a880',
            color: '#fdfdfd',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: '600',
            fontFamily: '"Outfit", "Inter", sans-serif',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#c5a880', fontSize: '9px', fontWeight: '400' }}>H:</span>
            {currentHeight}mm
          </div>
        </Html>
      </group>

      {/* Height Extension Lines */}
      <mesh position={[-w / 2 - extLen / 2, 0, -d / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[extLen, 0.003, 0.003]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-w / 2 - extLen / 2, h, -d / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[extLen, 0.003, 0.003]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

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
  
  // Get furniture specs for bounds sizing
  const spec = FURNITURE_SPECS[item.type];
  const boundingWidth = spec ? spec.w : 2.0;
  const boundingDepth = spec ? spec.d : 1.0;

  return (
    <group
      ref={meshRef}
      position={[item.x, item.y || 0, item.z]}
      rotation={[((item.rotationX || 0) * Math.PI) / 180, ((item.rotation || 0) * Math.PI) / 180, 0]}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Furniture visual component */}
      {item.type === 'sofa' && <Sofa color={item.color} material={item.material} />}
      {item.type === 'bed' && <Bed color={item.color} material={item.material} />}
      {item.type === 'table' && <Table color={item.color} material={item.material} />}
      {item.type === 'chair' && <Chair color={item.color} material={item.material} />}
      {item.type === 'tv' && <TV color={item.color} material={item.material} />}
      {item.type === 'laptop' && <Laptop color={item.color} material={item.material} />}
      {item.type === 'lamp' && <Lamp color={item.color} material={item.material} />}
      {item.type === 'plant' && <Plant />}
      {item.type === 'art' && <Art color={item.color} />}

      {/* Selected Indicator Outline Ring (scaled to fit bounding bounds!) */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[boundingWidth / 2 + 0.05, boundingWidth / 2 + 0.08, 32]} />
          <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Selected Indicator Depth Outline Ring (for double-cross overlay) */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.01, 0]}>
          <ringGeometry args={[boundingDepth / 2 + 0.05, boundingDepth / 2 + 0.08, 32]} />
          <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* CAD-Style Dimension Overlay */}
      {isSelected && <DimensionOverlay type={item.type} itemScale={scale} />}
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
    
    // We want to project each 2D point (x, y) on the canvas to the 3D plane at Z = -4.0.
    // Normalized Device Coordinates (NDC) for a 1200x760 canvas:
    const points3D = wallPoints.map(pt => {
      const ndcX = (pt.x / 1200) * 2 - 1;
      const ndcY = -(pt.y / 760) * 2 + 1;
      
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
      vec.unproject(camera);
      
      // Ray from camera to unprojected point:
      const camPos = camera.position;
      const dir = vec.sub(camPos).normalize();
      
      // We want to find t where Z = -4.0: camPos.z + t * dir.z = -4.0
      // To avoid division by zero or weird math if dir.z is close to 0:
      const targetZ = -4.0;
      if (Math.abs(dir.z) < 0.0001) {
        return new THREE.Vector3(0, 0, targetZ);
      }
      
      const t = (targetZ - camPos.z) / dir.z;
      const x3D = camPos.x + t * dir.x;
      const y3D = camPos.y + t * dir.y;
      
      return new THREE.Vector3(x3D, y3D, targetZ);
    });

    const firstPt = points3D[0];
    shape.moveTo(firstPt.x, firstPt.y);
    for (let i = 1; i < points3D.length; i++) {
      shape.lineTo(points3D[i].x, points3D[i].y);
    }
    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [wallPoints, camera, calibration]);

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
