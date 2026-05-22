import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

// Helper to generate a high-quality organic linen fabric normal/bump canvas texture
function useLinenTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Base gray-white (neutral bump base)
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    
    // Render linen weave with dual thread-passes for thickness
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.28;
    for (let i = 0; i < 256; i += 3) {
      // Horizontal threads
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
      
      // Vertical threads
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
    }

    // Secondary fine weave offset
    ctx.strokeStyle = '#707070';
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.15;
    for (let i = 1; i < 256; i += 3) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 256);
      ctx.stroke();
    }
    
    // Add fine noise to simulate fiber roughness
    ctx.fillStyle = '#666666';
    ctx.globalAlpha = 0.09;
    for (let i = 0; i < 8000; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }, []);
}

// Helper to generate elegant polished white Carrara marble texture for tables
function useMarbleTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Creamy white background
    ctx.fillStyle = '#faf9f6';
    ctx.fillRect(0, 0, 512, 512);
    
    // Clouding / soft gradients
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 300);
    grad.addColorStop(0, '#faf9f6');
    grad.addColorStop(1, '#f0ede6');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Fine organic gray marble veins
    ctx.strokeStyle = '#7e796e';
    for (let j = 0; j < 5; j++) {
      ctx.beginPath();
      ctx.globalAlpha = 0.12 + Math.random() * 0.18;
      ctx.lineWidth = 0.8 + Math.random() * 2.0;
      
      let x = Math.random() * 512;
      let y = 0;
      ctx.moveTo(x, y);
      
      while (y < 512) {
        x += (Math.random() - 0.5) * 32;
        y += 6 + Math.random() * 16;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    
    // Rich deep colored veins
    ctx.strokeStyle = '#4e4a42';
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.bezierCurveTo(200, 120, 60, 280, 380, 512);
    ctx.stroke();

    ctx.strokeStyle = '#6c675c';
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(420, 0);
    ctx.bezierCurveTo(280, 200, 480, 360, 120, 512);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
}

// Helper to generate high-quality organic travertine stone texture for lamps
function useTravertineTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Base warm ivory/travertine cream
    ctx.fillStyle = '#ebdcc8';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add soft horizontal sediment bands
    for (let i = 0; i < 24; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#decbb3' : '#f5e8d8';
      ctx.globalAlpha = 0.45;
      const y = Math.random() * 512;
      const h = 15 + Math.random() * 45;
      ctx.fillRect(0, y, 512, h);
    }
    
    // Add organic porous dark stone pitting/holes
    ctx.fillStyle = '#b8a38a';
    ctx.globalAlpha = 0.28;
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 1.5 + Math.random() * 7;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Horizontal travertine micro-grain banding
    ctx.strokeStyle = '#c9b79f';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const x = Math.random() * 350;
      const y = Math.random() * 512;
      ctx.moveTo(x, y);
      ctx.lineTo(x + 80 + Math.random() * 120, y + (Math.random() - 0.5) * 3);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);
}

// Procedural Sofa - Luxury Mid-Century Modern Tufted Sofa
export function Sofa({ color }) {
  const linenBumpMap = useLinenTexture();

  return (
    <group>
      {/* Plinth Frame / Sofa base wooden plinth */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.22, 0.08, 0.92]} />
        <meshStandardMaterial color="#422a1b" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Main Seat Cushions - Rounded Soft Blocks */}
      {/* Left Cushion */}
      <RoundedBox 
        args={[1.02, 0.22, 0.78]} 
        radius={0.07} 
        smoothness={5} 
        position={[-0.52, 0.22, 0.02]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.016} 
          roughness={0.8} 
        />
      </RoundedBox>
      {/* Right Cushion */}
      <RoundedBox 
        args={[1.02, 0.22, 0.78]} 
        radius={0.07} 
        smoothness={5} 
        position={[0.52, 0.22, 0.02]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.016} 
          roughness={0.8} 
        />
      </RoundedBox>

      {/* Sofa Backrest shell */}
      <RoundedBox 
        args={[2.22, 0.46, 0.18]} 
        radius={0.08} 
        smoothness={5} 
        position={[0, 0.52, -0.37]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.016} 
          roughness={0.8} 
        />
      </RoundedBox>

      {/* Sleek Curved Armrests */}
      {/* Left Armrest */}
      <RoundedBox 
        args={[0.18, 0.38, 0.82]} 
        radius={0.07} 
        smoothness={5} 
        position={[-1.1, 0.32, 0.02]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.016} 
          roughness={0.8} 
        />
      </RoundedBox>
      {/* Right Armrest */}
      <RoundedBox 
        args={[0.18, 0.38, 0.82]} 
        radius={0.07} 
        smoothness={5} 
        position={[1.1, 0.32, 0.02]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.016} 
          roughness={0.8} 
        />
      </RoundedBox>

      {/* Decorative Back Pillows with Realistic Deep 3D Button Tufting */}
      {/* Left Pillow */}
      <group>
        <RoundedBox 
          args={[0.96, 0.36, 0.1]} 
          radius={0.06} 
          smoothness={5} 
          position={[-0.48, 0.54, -0.24]} 
          rotation={[0.06, 0.03, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={color} 
            bumpMap={linenBumpMap} 
            bumpScale={0.02} 
            roughness={0.85} 
          />
        </RoundedBox>
        {/* Recessed Button Tufts - Row 1 & 2 */}
        {[-0.32, -0.12, 0.12, 0.32].map((bx) => 
          [-0.08, 0.08].map((by) => (
            <mesh 
              key={`btn-l-${bx}-${by}`} 
              position={[-0.48 + bx, 0.54 + by, -0.19]} 
              rotation={[0.06, 0.03, 0]}
              castShadow
            >
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          ))
        )}
      </group>

      {/* Right Pillow */}
      <group>
        <RoundedBox 
          args={[0.96, 0.36, 0.1]} 
          radius={0.06} 
          smoothness={5} 
          position={[0.48, 0.54, -0.24]} 
          rotation={[0.06, -0.03, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={color} 
            bumpMap={linenBumpMap} 
            bumpScale={0.02} 
            roughness={0.85} 
          />
        </RoundedBox>
        {/* Recessed Button Tufts - Row 1 & 2 */}
        {[-0.32, -0.12, 0.12, 0.32].map((bx) => 
          [-0.08, 0.08].map((by) => (
            <mesh 
              key={`btn-r-${bx}-${by}`} 
              position={[0.48 + bx, 0.54 + by, -0.19]} 
              rotation={[0.06, -0.03, 0]}
              castShadow
            >
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          ))
        )}
      </group>

      {/* Decorative Accent Throw Pillows at ends (Organic Staging Element) */}
      {/* Left Terracotta Throw Pillow */}
      <RoundedBox 
        args={[0.34, 0.34, 0.14]} 
        radius={0.09} 
        smoothness={4} 
        position={[-0.88, 0.38, 0.15]} 
        rotation={[0.1, 0.5, 0.28]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#a94f36" // Designer Terracotta Accent
          bumpMap={linenBumpMap} 
          bumpScale={0.02} 
          roughness={0.8} 
        />
      </RoundedBox>

      {/* Right Ochre Throw Pillow */}
      <RoundedBox 
        args={[0.34, 0.34, 0.14]} 
        radius={0.09} 
        smoothness={4} 
        position={[0.88, 0.38, 0.15]} 
        rotation={[0.15, -0.45, -0.32]} 
        castShadow
      >
        <meshStandardMaterial 
          color="#b88a44" // Designer Gold Accent
          bumpMap={linenBumpMap} 
          bumpScale={0.02} 
          roughness={0.8} 
        />
      </RoundedBox>

      {/* Slanted Cylindrical Legs with Detailed Gold Foot Caps */}
      {[
        [-1.02, 0.38], [1.02, 0.38],
        [-1.02, -0.38], [1.02, -0.38]
      ].map((pos, idx) => {
        const isBack = pos[1] < 0;
        const rollAngle = (isBack ? -0.12 : 0.12);
        const pitchAngle = (pos[0] < 0 ? -0.1 : 0.1);
        
        return (
          <group 
            key={idx} 
            position={[pos[0], 0.04, pos[1]]}
            rotation={[rollAngle, 0, pitchAngle]}
          >
            {/* Main Dark Stained Wooden Leg */}
            <mesh castShadow>
              <cylinderGeometry args={[0.024, 0.014, 0.08, 16]} />
              <meshStandardMaterial color="#1f140e" roughness={0.5} />
            </mesh>
            {/* Highly Polished Gold Metal Foot Cap */}
            <mesh position={[0, -0.035, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.014, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.12} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Procedural Bed - Luxury Hotel Platform Bed with Channel-Tufted Headboard
export function Bed({ color }) {
  const linenBumpMap = useLinenTexture();

  return (
    <group>
      {/* Wingback Channel-Tufted Headboard Structure */}
      <group position={[0, 0.5, -1.02]}>
        {/* Supporting Walnut Back Frame */}
        <mesh position={[0, 0, -0.04]} castShadow receiveShadow>
          <boxGeometry args={[2.14, 1.0, 0.04]} />
          <meshStandardMaterial color="#422a1b" roughness={0.5} />
        </mesh>
        
        {/* 7 Vertical Plump Tufted Channels (Creates gorgeous 3D grooved light-catchers) */}
        {[-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9].map((xOffset, idx) => (
          <RoundedBox
            key={idx}
            args={[0.26, 0.96, 0.08]}
            radius={0.03}
            smoothness={4}
            position={[xOffset, 0.01, 0.02]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial 
              color="#3c3732" 
              bumpMap={linenBumpMap} 
              bumpScale={0.018} 
              roughness={0.88} 
            />
          </RoundedBox>
        ))}

        {/* Elegant Wingback Side Panels */}
        {[-1.06, 1.06].map((xOffset, idx) => (
          <RoundedBox
            key={`wing-${idx}`}
            args={[0.05, 1.0, 0.22]}
            radius={0.03}
            smoothness={4}
            position={[xOffset, 0, 0.06]}
            castShadow
          >
            <meshStandardMaterial color="#3c3732" roughness={0.88} />
          </RoundedBox>
        ))}
      </group>

      {/* Premium Stained Walnut Platform Bed Frame */}
      <RoundedBox 
        args={[1.96, 0.16, 2.04]} 
        radius={0.03} 
        smoothness={4} 
        position={[0, 0.08, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial color="#422a1b" roughness={0.5} />
      </RoundedBox>

      {/* Deluxe Plump Double Mattress */}
      <RoundedBox 
        args={[1.82, 0.28, 1.88]} 
        radius={0.07} 
        smoothness={5} 
        position={[0, 0.28, 0.05]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial color="#fafaf5" roughness={0.85} />
      </RoundedBox>

      {/* Layered Luxury Pillow Arrangement (Staged organically with slight offsets) */}
      {/* Crisp White Sleeping Pillows (Back row) */}
      <RoundedBox 
        args={[0.7, 0.15, 0.46]} 
        radius={0.06} 
        smoothness={4} 
        position={[-0.42, 0.48, -0.66]} 
        rotation={[0.16, 0.04, -0.02]}
        castShadow
      >
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </RoundedBox>
      <RoundedBox 
        args={[0.7, 0.15, 0.46]} 
        radius={0.06} 
        smoothness={4} 
        position={[0.42, 0.48, -0.66]} 
        rotation={[0.16, -0.04, 0.02]}
        castShadow
      >
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </RoundedBox>

      {/* Accent Staged Pillows (Middle row) */}
      <RoundedBox 
        args={[0.54, 0.14, 0.38]} 
        radius={0.05} 
        smoothness={4} 
        position={[-0.34, 0.48, -0.45]} 
        rotation={[0.24, 0.1, -0.04]}
        castShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.02} 
          roughness={0.8} 
        />
      </RoundedBox>
      <RoundedBox 
        args={[0.54, 0.14, 0.38]} 
        radius={0.05} 
        smoothness={4} 
        position={[0.34, 0.48, -0.45]} 
        rotation={[0.24, -0.1, 0.04]}
        castShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.02} 
          roughness={0.8} 
        />
      </RoundedBox>

      {/* Round Bolster Contrast Pillow (Center Front) */}
      <mesh position={[0, 0.48, -0.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.48, 20]} />
        <meshStandardMaterial color="#a94f36" roughness={0.8} />
      </mesh>

      {/* Layered Folded Blanket/Duvet Cover (Draped at the foot of bed) */}
      <RoundedBox 
        args={[1.84, 0.05, 1.1]} 
        radius={0.025} 
        smoothness={4} 
        position={[0, 0.44, 0.46]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color={color} 
          bumpMap={linenBumpMap} 
          bumpScale={0.025} 
          roughness={0.82} 
        />
      </RoundedBox>

      {/* Organic Blanket creases/folds (3D cylinder ripples catching shadows) */}
      {[-0.3, 0.0, 0.3].map((rx, idx) => (
        <mesh 
          key={idx} 
          position={[rx, 0.455, 0.46]} 
          rotation={[0, 0, Math.PI / 2]} 
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.012, 1.82, 8]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// Procedural Table - Luxury White Carrara Marble Table with Decorative Centerpiece
export function Table({ color }) {
  const marbleTex = useMarbleTexture();

  return (
    <group>
      {/* Solid Luxury Carrara Marble Top with Beveled Edge */}
      <mesh position={[0, 0.73, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.04, 64]} />
        <meshStandardMaterial 
          map={marbleTex}
          roughness={0.04} // Highly reflective specular highlight
          metalness={0.05} 
        />
      </mesh>
      
      {/* Thin Gold Metal Underplate Support */}
      <mesh position={[0, 0.70, 0]} receiveShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.02, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* Sleek Heavy Fluted Pedestal Column Support */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 0.68, 24]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* Flared Gold Pedestal Base Rim */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <cylinderGeometry args={[0.36, 0.38, 0.03, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.12} />
      </mesh>

      {/* ======================================================== */}
      {/* STAGED CENTRAL DECORATION (Adds massive organic realism!) */}
      {/* ======================================================== */}
      
      {/* Minimalist Solid Brass Round Display Tray */}
      <mesh position={[0, 0.752, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.008, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.14} />
      </mesh>

      {/* Modern White Textured Ceramic Stoneware Vase */}
      <mesh position={[-0.04, 0.83, 0.02]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.15, 16]} />
        <meshStandardMaterial color="#efefe9" roughness={0.7} />
      </mesh>

      {/* Dried Branch Stem in Vase */}
      <mesh position={[-0.04, 0.94, 0.02]} rotation={[0.25, 0.1, -0.15]}>
        <cylinderGeometry args={[0.003, 0.003, 0.08, 8]} />
        <meshStandardMaterial color="#403024" roughness={0.9} />
      </mesh>
      
      {/* Organic Sprig of Foliage/Leaves */}
      {[
        { p: [-0.07, 0.97, 0.04], s: [0.035, 0.01, 0.05], r: [0.35, 0.5, 0.2] },
        { p: [-0.02, 0.96, 0.01], s: [0.042, 0.01, 0.06], r: [-0.22, -0.4, -0.32] },
        { p: [-0.05, 0.95, 0.04], s: [0.035, 0.01, 0.048], r: [0.1, 0.25, -0.1] }
      ].map((lf, lIdx) => (
        <mesh key={`foliage-${lIdx}`} position={lf.p} scale={lf.s} rotation={lf.r}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#3b5440" roughness={0.5} />
        </mesh>
      ))}

      {/* Accent Colored Hardcover Design Catalog Book next to vase */}
      <group position={[0.06, 0.758, -0.04]} rotation={[0, -0.25, 0]}>
        {/* Book Cover */}
        <RoundedBox 
          args={[0.18, 0.016, 0.14]} 
          radius={0.003} 
          smoothness={2} 
          castShadow
        >
          <meshStandardMaterial color="#a94f36" roughness={0.65} />
        </RoundedBox>
        {/* Book Paper Core */}
        <mesh position={[0, 0, 0.001]}>
          <boxGeometry args={[0.174, 0.012, 0.134]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// Procedural Floor Lamp - Travertine & Curved Brass Architectural Lamp
export function Lamp({ color }) {
  const travertineTex = useTravertineTexture();

  return (
    <group>
      {/* Solid Travertine Stone Heavy Base */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.16, 24]} />
        <meshStandardMaterial color="#ebe0d0" map={travertineTex} roughness={0.65} />
      </mesh>
      
      {/* Gold Brass Collar Ring on base */}
      <mesh position={[0, 0.165, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.01, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Slender Curved Polished Gold Arch Stem */}
      {/* Lower Vertical Stem column */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 1.3, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.12} />
      </mesh>

      {/* Smooth Multi-Segment Curved Arch (Organic look) */}
      {[
        { pos: [0.03, 1.48, 0], rot: [0, 0, -Math.PI / 24] },
        { pos: [0.12, 1.54, 0], rot: [0, 0, -Math.PI / 10] },
        { pos: [0.24, 1.56, 0], rot: [0, 0, -Math.PI / 6] },
        { pos: [0.35, 1.52, 0], rot: [0, 0, -Math.PI / 4] }
      ].map((seg, idx) => (
        <mesh key={idx} position={seg.pos} rotation={seg.rot} castShadow>
          <cylinderGeometry args={[0.011, 0.011, 0.16, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.12} />
        </mesh>
      ))}

      {/* Polished Dome Shade with interior glowing element */}
      <group position={[0.42, 1.4, 0]}>
        {/* Solid Double-Sided Dome Shade */}
        <mesh castShadow>
          <sphereGeometry args={[0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#d4af37" 
            side={THREE.DoubleSide} 
            metalness={0.92} 
            roughness={0.12} 
          />
        </mesh>
        
        {/* Glowing bulb element */}
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.036, 16, 16]} />
          <meshBasicMaterial color="#fffaeb" />
        </mesh>

        {/* Dynamic Light Source casting soft shadows */}
        <pointLight 
          color="#ffeecc" 
          intensity={14.0} 
          distance={5.5} 
          decay={1.8} 
          castShadow 
          shadow-bias={-0.0008}
          position={[0, -0.04, 0]}
        />
      </group>
    </group>
  );
}

// Procedural Plant - Potted Fiddle Leaf Fig in Modern Ribbed Stoneware Pot
export function Plant() {
  const leafGeometry = useMemo(() => new THREE.SphereGeometry(0.18, 20, 10), []);

  // Compute circumferences coordinates to wrap ribbed columns around pot
  const potRibs = useMemo(() => {
    const ribs = [];
    const radius = 0.201; // Slightly offset from pot base
    const numRibs = 18;
    for (let i = 0; i < numRibs; i++) {
      const theta = (i * Math.PI * 2) / numRibs;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      ribs.push([x, z]);
    }
    return ribs;
  }, []);

  return (
    <group>
      {/* Matte Charcoal Fluted Pot Base */}
      <group>
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.16, 0.36, 24]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.75} />
        </mesh>
        {/* Fluted Vertical Rib columns (Pure 3D geometry adds gorgeous depth!) */}
        {potRibs.map((pt, idx) => (
          <mesh key={idx} position={[pt[0], 0.18, pt[1]]} castShadow>
            <cylinderGeometry args={[0.012, 0.009, 0.36, 6]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.75} />
          </mesh>
        ))}
      </group>

      {/* Dark Soil */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.012, 16]} />
        <meshStandardMaterial color="#3a2b20" roughness={0.95} />
      </mesh>

      {/* Fig Branch Structure */}
      <group position={[0, 0.34, 0]}>
        {/* Slanted organic stems */}
        {[
          { rot: [0.12, 0, 0.15], h: 0.65, pos: [0.03, 0.28, 0.01] },
          { rot: [-0.18, 0, -0.28], h: 0.55, pos: [-0.06, 0.22, 0.05] },
          { rot: [0.24, 0, -0.1], h: 0.6, pos: [-0.02, 0.26, -0.04] }
        ].map((stem, idx) => (
          <group key={idx} rotation={stem.rot} position={[stem.pos[0] * 0.2, 0, stem.pos[2] * 0.2]}>
            {/* Organic Bark Stem */}
            <mesh castShadow>
              <cylinderGeometry args={[0.016, 0.012, stem.h, 8]} />
              <meshStandardMaterial color="#514337" roughness={0.9} />
            </mesh>
            
            {/* Clustered Fiddle Leaves with Organic Rotations & Shading */}
            {[0.25, 0.45, 0.65, 0.85, 1.0].map((t, lIdx) => {
              const yPos = (t - 0.5) * stem.h;
              const leafScale = (1.1 - t * 0.38);
              
              return (
                <group key={lIdx} position={[0, yPos, 0]}>
                  {/* Left Waxy Leaf */}
                  <mesh 
                    geometry={leafGeometry} 
                    position={[0.1, 0.03, 0.04]} 
                    rotation={[0.35, 0.52, -0.42]}
                    scale={[leafScale * 1.5, leafScale * 0.24, leafScale * 1.1]}
                    castShadow
                  >
                    <meshStandardMaterial 
                      color="#274f30" 
                      roughness={0.34} // Glossy waxy leaf highlight
                      side={THREE.DoubleSide} 
                    />
                  </mesh>
                  {/* Right Waxy Leaf */}
                  <mesh 
                    geometry={leafGeometry} 
                    position={[-0.1, 0.03, -0.04]} 
                    rotation={[-0.35, -0.52, 0.42]}
                    scale={[leafScale * 1.5, leafScale * 0.24, leafScale * 1.1]}
                    castShadow
                  >
                    <meshStandardMaterial 
                      color="#214429" 
                      roughness={0.34} 
                      side={THREE.DoubleSide} 
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}

// Procedural Framed Wall Art - Minimalist Floating Abstract Oil Painting
export function Art({ color }) {
  // Generate a premium abstract oil painting texture with textured brushstrokes
  const paintingTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Canvas background paper
    ctx.fillStyle = '#f2ece0';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle background linen weave texture
    ctx.strokeStyle = '#e6dfd1';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.55;
    for (let i = 0; i < 512; i += 5) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    }
    
    // Abstract styled shapes
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(256, 210, 110, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#b88a44';
    ctx.beginPath();
    ctx.moveTo(110, 360);
    ctx.lineTo(390, 360);
    ctx.lineTo(256, 170);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#223b35';
    ctx.beginPath();
    ctx.arc(256, 360, 48, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#8b5b3d';
    ctx.fillRect(360, 200, 26, 80);

    // Add thick oil paint impasto highlights / brush textures
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.arc(x, y, 10 + Math.random() * 30, 0, Math.PI + Math.random() * 2);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, [color]);

  return (
    <group>
      {/* Floating Walnut Box Deep Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 0.08]} />
        <meshStandardMaterial color="#321f14" roughness={0.45} />
      </mesh>

      {/* Floating Recessed Shadow Gap */}
      <mesh position={[0, 0, 0.021]}>
        <boxGeometry args={[1.14, 1.14, 0.05]} />
        <meshStandardMaterial color="#141414" roughness={0.9} />
      </mesh>

      {/* Premium Textured Inner Passepartout Matboard */}
      <mesh position={[0, 0, 0.036]} receiveShadow>
        <boxGeometry args={[1.1, 1.1, 0.03]} />
        <meshStandardMaterial color="#f7f6f0" roughness={0.75} />
      </mesh>

      {/* Elegant Inner Gold Inset Accent Rim */}
      <mesh position={[0, 0, 0.048]}>
        <boxGeometry args={[0.94, 0.94, 0.008]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Textured Oil Paint Canvas */}
      <mesh position={[0, 0, 0.053]}>
        <planeGeometry args={[0.92, 0.92]} />
        <meshStandardMaterial 
          map={paintingTexture} 
          roughness={0.6} // Semi-matte oil canvas reflection
          metalness={0.05} 
        />
      </mesh>
    </group>
  );
}
