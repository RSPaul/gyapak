import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCcw, Download, Eye, EyeOff, Sparkles } from 'lucide-react';
import DesignerCanvas from '../components/DesignerCanvas';

// Default room background options
const templates = [
  { id: 'living', name: 'Living Room', url: '/assets/images/gyapak-living-room.png' },
  { id: 'bedroom', name: 'Bedroom', url: '/assets/images/gyapak-bedroom.png' },
  { id: 'kitchen', name: 'Kitchen', url: '/assets/images/gyapak-kitchen.png' },
  { id: 'office', name: 'Home Office', url: '/assets/images/gyapak-office.png' }
];

// Color Swatches
const swatches = [
  { label: 'Warm Clay', hex: '#d8c7ad' },
  { label: 'Soft Sage', hex: '#cfd8cf' },
  { label: 'Ivory Wall', hex: '#e8e3d8' },
  { label: 'Muted Blue', hex: '#315f73' },
  { label: 'Terracotta', hex: '#a94f36' },
  { label: 'Charcoal', hex: '#2d332f' }
];

// Default dimensions for furniture shapes
const furnitureDefaults = {
  sofa: { color: '#315f73', scale: 100, rotation: 0, material: 'linen' },
  bed: { color: '#d9cab8', scale: 100, rotation: 0, material: 'linen' },
  table: { color: '#8b5b3d', scale: 100, rotation: 0, material: 'marble' },
  lamp: { color: '#b88a44', scale: 100, rotation: 0, material: 'travertine' },
  plant: { color: '#28634f', scale: 100, rotation: 0, material: 'none' },
  art: { color: '#a94f36', scale: 100, rotation: 0, material: 'none' }
};

// Premium Fabrics Specification
const premiumFabrics = [
  { id: 'boucle', name: 'Belgian Bouclé', desc: 'Tactile, cozy loopy wool texture' },
  { id: 'leather', name: 'Saddle Leather', desc: 'Premium distressed pore leather' },
  { id: 'corduroy', name: 'Ribbed Corduroy', desc: 'Parallel ribbed soft wales' },
  { id: 'linen', name: 'Slub Linen', desc: 'Crisp organic raw fiber weave' }
];

// Premium Stones & Hard Surfaces Specification
const premiumStones = [
  { id: 'marble', name: 'Carrara Marble', desc: 'Polished grey-veined luxury marble' },
  { id: 'travertine', name: 'Travertine Stone', desc: 'Porous warm organic volcanic rock' },
  { id: 'bronze', name: 'Brushed Bronze', desc: 'Horizontal brushed metal texture' },
  { id: 'wood', name: 'Walnut Wood', desc: 'Rich walnut relief relief grain' }
];

// Luxury Color Palettes
const fabricColors = [
  { label: 'Oatmeal Bouclé', hex: '#d9d0c1' },
  { label: 'Saddle Tan', hex: '#9c6644' },
  { label: 'Desert Terracotta', hex: '#a94f36' },
  { label: 'Forest Moss', hex: '#2e3d30' },
  { label: 'Midnight Indigo', hex: '#1e2d42' }
];

const surfaceColors = [
  { label: 'Carrara White', hex: '#faf9f6' },
  { label: 'Travertine Ochre', hex: '#ebe0d0' },
  { label: 'Brushed Bronze', hex: '#b08d57' },
  { label: 'Espresso Walnut', hex: '#5c3a21' }
];

const artColors = [
  { label: 'Minimalist Ivory', hex: '#e8e3d8' },
  { label: 'Muted Clay', hex: '#a94f36' },
  { label: 'Teal Lagoon', hex: '#315f73' },
  { label: 'Warm Ochre', hex: '#cfbfa3' },
  { label: 'Carbon Black', hex: '#1c1c1c' }
];

export default function DesignYourself() {
  // Room state
  const [bgImage, setBgImage] = useState(templates[0].url);
  const [selectingWall, setSelectingWall] = useState(false);
  const [wallDraft, setWallDraft] = useState([]);
  const [wallShape, setWallShape] = useState([]);
  const [wallColor, setWallColor] = useState(swatches[0].hex);
  const [wallTexture, setWallTexture] = useState('none');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  
  // 3D Staged objects state
  const [objects, setObjects] = useState([]);
  const [selectedId, setSelectedId] = useState(-1);
  
  // Lighting and Calibration states
  const [lighting, setLighting] = useState('warm');
  const [gridVisible, setGridVisible] = useState(true);
  const [calibration, setCalibration] = useState({
    pitch: 20,
    roll: 0,
    height: 3.2,
    fov: 46
  });

  const [statusMsg, setStatusMsg] = useState('Upload a room or select a template. Calibrate the grid to begin.');

  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);

  // Set status helper
  const setStatus = (msg) => {
    setStatusMsg(msg);
  };

  // Upload room photo handler
  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setBgImage(reader.result);
      setStatus('Room uploaded. Adjust the perspective grid to match your floor.');
    };
    reader.readAsDataURL(file);
  };

  // Add 3D furniture item
  const handleAddObject = (type) => {
    const defaults = furnitureDefaults[type];
    
    // Placed at the center of the 3D ground plane
    const newItem = {
      type,
      x: 0,
      z: 0,
      color: defaults.color,
      scale: defaults.scale,
      rotation: defaults.rotation,
      material: defaults.material
    };

    setObjects(prev => [...prev, newItem]);
    setSelectedId(objects.length); // Select newly added item
    setStatus(`${type.charAt(0).toUpperCase() + type.slice(1)} placed. Drag to slide along the floor.`);
  };

  // Selected item scaling & rotation updates
  const handleScaleChange = (val) => {
    if (selectedId < 0) return;
    setObjects(prev => prev.map((item, idx) => 
      idx === selectedId ? { ...item, scale: Number(val) } : item
    ));
  };

  const handleRotationChange = (val) => {
    if (selectedId < 0) return;
    setObjects(prev => prev.map((item, idx) => 
      idx === selectedId ? { ...item, rotation: Number(val) } : item
    ));
  };

  const handleMaterialChange = (val) => {
    if (selectedId < 0) return;
    setObjects(prev => prev.map((item, idx) => 
      idx === selectedId ? { ...item, material: val } : item
    ));
    setStatus(`Premium material updated to: ${val}.`);
  };

  const handleColorChange = (val) => {
    if (selectedId < 0) return;
    setObjects(prev => prev.map((item, idx) => 
      idx === selectedId ? { ...item, color: val } : item
    ));
    setStatus(`Custom material color preset applied.`);
  };

  // Dragging objects on ground plane handler
  const handleMoveObject = (idx, newX, newZ) => {
    setObjects(prev => prev.map((item, id) => 
      id === idx ? { ...item, x: newX, z: newZ } : item
    ));
  };

  // Helper to extract relative coordinates matching the 1200x760 canvas bounds
  const getCanvasCoords = (clientX, clientY) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1200, ((clientX - rect.left) / rect.width) * 1200));
    const y = Math.max(0, Math.min(760, ((clientY - rect.top) / rect.height) * 760));
    return { x, y };
  };

  // Drag selection mouse handlers
  const handleMouseDown = (e) => {
    if (!selectingWall) return;
    e.preventDefault();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setIsDragging(true);
    setDragStart(coords);
    setWallDraft([
      { x: coords.x, y: coords.y },
      { x: coords.x, y: coords.y },
      { x: coords.x, y: coords.y },
      { x: coords.x, y: coords.y }
    ]);
    setStatus('Dragging to select wall area...');
  };

  const handleMouseMove = (e) => {
    if (!selectingWall || !isDragging || !dragStart) return;
    e.preventDefault();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    
    const x1 = Math.min(dragStart.x, coords.x);
    const x2 = Math.max(dragStart.x, coords.x);
    const y1 = Math.min(dragStart.y, coords.y);
    const y2 = Math.max(dragStart.y, coords.y);

    setWallDraft([
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 }
    ]);
  };

  const handleMouseUp = (e) => {
    if (!selectingWall || !isDragging || !dragStart) return;
    e.preventDefault();
    setIsDragging(false);

    let clientX, clientY;
    if (e.clientX !== undefined) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = dragStart.x;
      clientY = dragStart.y;
    }

    const coords = getCanvasCoords(clientX, clientY);
    const x1 = Math.min(dragStart.x, coords.x);
    const x2 = Math.max(dragStart.x, coords.x);
    const y1 = Math.min(dragStart.y, coords.y);
    const y2 = Math.max(dragStart.y, coords.y);

    const w = x2 - x1;
    const h = y2 - y1;

    if (w > 15 && h > 15) {
      const finalShape = [
        { x: x1, y: y1 },
        { x: x2, y: y1 },
        { x: x2, y: y2 },
        { x: x1, y: y2 }
      ];
      setWallShape(finalShape);
      setWallDraft([]);
      setSelectingWall(false);
      setStatus('3D Painted Wall updated via drag selection!');
    } else {
      setWallDraft([]);
      setStatus('Selection too small. Drag a larger box to mark the wall.');
    }
    setDragStart(null);
  };

  // Drag selection touch handlers for mobile devices
  const handleTouchStart = (e) => {
    if (!selectingWall) return;
    const touch = e.touches[0];
    const coords = getCanvasCoords(touch.clientX, touch.clientY);
    setIsDragging(true);
    setDragStart(coords);
    setWallDraft([
      { x: coords.x, y: coords.y },
      { x: coords.x, y: coords.y },
      { x: coords.x, y: coords.y },
      { x: coords.x, y: coords.y }
    ]);
    setStatus('Dragging to select wall area...');
  };

  const handleTouchMove = (e) => {
    if (!selectingWall || !isDragging || !dragStart) return;
    const touch = e.touches[0];
    const coords = getCanvasCoords(touch.clientX, touch.clientY);
    
    const x1 = Math.min(dragStart.x, coords.x);
    const x2 = Math.max(dragStart.x, coords.x);
    const y1 = Math.min(dragStart.y, coords.y);
    const y2 = Math.max(dragStart.y, coords.y);

    setWallDraft([
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 }
    ]);
  };

  const handleTouchEnd = (e) => {
    handleMouseUp(e);
  };

  const handleClearWall = () => {
    setWallShape([]);
    setWallDraft([]);
    setStatus('Wall area cleared.');
  };

  const handleReset = () => {
    setObjects([]);
    setSelectedId(-1);
    setWallShape([]);
    setWallDraft([]);
    setSelectingWall(false);
    setLighting('warm');
    setCalibration({
      pitch: 20,
      roll: 0,
      height: 3.2,
      fov: 46
    });
    setGridVisible(true);
    setStatus('Workspace reset.');
  };

  // Merging backgrounds, wall rendering, and Three.js layers into one consolidated high-res PNG
  const handleDownload = () => {
    setStatus('Generating concept download...');
    
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');

    // 1. Draw background image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1200, 760);

      // 2. Fetch Three.js Canvas layer and composite it on top
      const glCanvas = document.querySelector('.designer-webgl-layer canvas');
      if (glCanvas) {
        ctx.drawImage(glCanvas, 0, 0, 1200, 760);
      }

      // 3. Trigger standard file download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'gyapak-3d-room-concept.png';
      link.href = dataUrl;
      link.click();
      setStatus('Concept downloaded successfully!');
    };
    img.src = bgImage;
  };

  const activeItem = selectedId >= 0 ? objects[selectedId] : null;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Design Yourself 3D</p>
          <h1>Interactive 3D <em>Staging Studio</em></h1>
          <p>Upload a photo of your room, calibrate the grid to align perspective, mark wall dimensions in 3D, and stage modern parametric furniture with real shadow casting.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '24px' }}>
        <div className="container designer-shell">
          {/* Left Control Sidebar */}
          <aside className="tool-panel" aria-label="Room design tools">
            {/* Template & Upload group */}
            <div className="tool-group">
              <h3>1. Room Background</h3>
              <div className="tool-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {templates.map(tpl => (
                  <button 
                    key={tpl.id} 
                    className={`tool-button ${bgImage === tpl.url ? 'active' : ''}`}
                    onClick={() => {
                      setBgImage(tpl.url);
                      setStatus(`Template loaded: ${tpl.name}.`);
                    }}
                    style={{ minWidth: '0' }}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleUploadChange} 
                style={{ display: 'none' }} 
              />
              <button 
                className="btn outline" 
                onClick={() => fileInputRef.current.click()}
                style={{ width: '100%', minHeight: '38px', fontSize: '13px', padding: '8px' }}
              >
                <Upload size={16} /> Upload Custom Photo
              </button>
            </div>

            {/* Grid Calibration group */}
            <div className="tool-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>2. Floor Calibration</h3>
                <button 
                  className="tool-button" 
                  onClick={() => setGridVisible(!gridVisible)}
                  style={{ minHeight: '32px', padding: '4px 8px', fontSize: '11px', flex: 'none', width: 'auto' }}
                >
                  {gridVisible ? <EyeOff size={14} /> : <Eye size={14} />} Grid
                </button>
              </div>

              <div className="range">
                <label className="range-label">
                  <span>Horizon Pitch</span>
                  <span>{calibration.pitch}°</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="45" 
                  value={calibration.pitch} 
                  onChange={(e) => setCalibration(prev => ({ ...prev, pitch: Number(e.target.value) }))}
                />
              </div>

              <div className="range">
                <label className="range-label">
                  <span>Tilt Roll</span>
                  <span>{calibration.roll}°</span>
                </label>
                <input 
                  type="range" 
                  min="-15" 
                  max="15" 
                  value={calibration.roll} 
                  onChange={(e) => setCalibration(prev => ({ ...prev, roll: Number(e.target.value) }))}
                />
              </div>

              <div className="range">
                <label className="range-label">
                  <span>Floor Level (Height)</span>
                  <span>{calibration.height}m</span>
                </label>
                <input 
                  type="range" 
                  min="1.0" 
                  max="6.0" 
                  step="0.1" 
                  value={calibration.height} 
                  onChange={(e) => setCalibration(prev => ({ ...prev, height: Number(e.target.value) }))}
                />
              </div>

              <div className="range">
                <label className="range-label">
                  <span>Camera Focal Length</span>
                  <span>{calibration.fov}mm</span>
                </label>
                <input 
                  type="range" 
                  min="24" 
                  max="70" 
                  value={calibration.fov} 
                  onChange={(e) => setCalibration(prev => ({ ...prev, fov: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Wall marking group */}
            <div className="tool-group">
              <h3>3. Wall Staging (3D)</h3>
              <div className="tool-row">
                <button 
                  className={`tool-button ${selectingWall ? 'active' : ''}`}
                  onClick={() => {
                    const nextMode = !selectingWall;
                    setSelectingWall(nextMode);
                    setWallDraft([]);
                    setSelectedId(-1); // Deselect items
                    setStatus(nextMode ? 'Drag a box over the wall area in the preview above.' : 'Wall selection cancelled.');
                  }}
                  style={{ flex: '1 1 100%' }}
                >
                  {selectingWall ? 'Drag to select wall...' : 'Mark Wall Area'}
                </button>
                {selectingWall && (
                  <button className="tool-button" onClick={handleClearWall} style={{ flex: '1 1 100%' }}>Clear Selection</button>
                )}
                {!selectingWall && wallShape.length > 0 && (
                  <button className="tool-button" onClick={handleClearWall} style={{ flex: '1 1 100%' }}>Reset Wall</button>
                )}
              </div>

              {/* Swatches */}
              <div style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)' }}>WALL COLOR swatches</span>
                <div className="swatches" aria-label="Wall color swatches">
                  {swatches.map(swatch => (
                    <button 
                      key={swatch.hex}
                      className={`swatch ${wallColor === swatch.hex ? 'active' : ''}`} 
                      type="button" 
                      onClick={() => {
                        setWallColor(swatch.hex);
                        setStatus(`Wall color updated to ${swatch.label}.`);
                      }}
                      style={{ background: swatch.hex }}
                      aria-label={`${swatch.label} wall color`}
                    ></button>
                  ))}
                </div>
              </div>

              {/* Texture select */}
              <div style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)' }}>3D RELIEF TEXTURES</span>
                <select 
                  id="wallTexture" 
                  value={wallTexture} 
                  onChange={(e) => {
                    setWallTexture(e.target.value);
                    setStatus(`Wall relief pattern set to: ${e.target.value}.`);
                  }}
                  style={{ padding: '8px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fbfaf7' }}
                >
                  <option value="none">Smooth Plaster</option>
                  <option value="limewash">Limewash Plaster</option>
                  <option value="wood">Vertical Oak Wood Panel</option>
                  <option value="terrazzo">Terrazzo Fleck Plaster</option>
                </select>
              </div>
            </div>

            {/* Furniture placement group */}
            <div className="tool-group">
              <h3>4. Staging Catalog (3D)</h3>
              <div className="furniture-catalog">
                {[
                  { id: 'sofa', name: 'Emerald Sofa', desc: 'Mid-Century Tufted', thumb: '/assets/images/thumb-sofa.png' },
                  { id: 'bed', name: 'Deluxe Bed', desc: 'Hotel Wingback Platform', thumb: '/assets/images/thumb-bed.png' },
                  { id: 'table', name: 'Carrara Table', desc: 'Polished Marble Top', thumb: '/assets/images/thumb-table.png' },
                  { id: 'lamp', name: 'Arc Lamp', desc: 'Travertine & Brass', thumb: '/assets/images/thumb-lamp.png' },
                  { id: 'plant', name: 'Fiddle Leaf Fig', desc: 'Fluted Ceramic Pot', thumb: '/assets/images/thumb-plant.png' },
                  { id: 'art', name: 'Floating Art', desc: 'Canvas in Walnut Frame', thumb: '/assets/images/thumb-art.png' }
                ].map(item => (
                  <div 
                    key={item.id} 
                    className="furniture-card"
                    onClick={() => handleAddObject(item.id)}
                  >
                    <div className="furniture-thumb-wrap">
                      <img src={item.thumb} alt={item.name} className="furniture-thumb" />
                      <div className="furniture-card-overlay">
                        <span>+ Stage 3D</span>
                      </div>
                    </div>
                    <div className="furniture-card-info">
                      <h4>{item.name}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Spec & Customization Studio Sidebar */}
              {activeItem && (
                <div style={{
                  display: 'grid',
                  gap: '16px',
                  background: 'rgba(252, 251, 247, 0.85)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  marginTop: '12px',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  {/* Studio Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--rust)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>Spec & Customization Studio</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--dark)', fontFamily: '"Outfit", sans-serif', textTransform: 'capitalize' }}>{activeItem.type} Customizer</span>
                    </div>
                    <button 
                      className="tool-button" 
                      onClick={() => {
                        setObjects(prev => prev.filter((_, idx) => idx !== selectedId));
                        setSelectedId(-1);
                        setStatus('Furniture item removed.');
                      }}
                      style={{
                        minHeight: '28px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '600',
                        flex: 'none',
                        background: 'rgba(255, 240, 240, 0.8)',
                        color: '#cc0000',
                        borderColor: 'rgba(255, 204, 204, 0.6)',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Delete Item
                    </button>
                  </div>
                  
                  {/* 1. Dimension & Scale Controls */}
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>1. Physical Blueprint Controls</span>
                    
                    <div className="range">
                      <label className="range-label">
                        <span style={{ fontSize: '12px', color: 'var(--dark)' }}>Scale Modifier</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--rust)' }}>{activeItem.scale}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="50" 
                        max="180" 
                        value={activeItem.scale} 
                        onChange={(e) => handleScaleChange(e.target.value)}
                        style={{ height: '4px' }}
                      />
                    </div>

                    <div className="range">
                      <label className="range-label">
                        <span style={{ fontSize: '12px', color: 'var(--dark)' }}>Y-Rotation (Angle)</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--rust)' }}>{activeItem.rotation}°</span>
                      </label>
                      <input 
                        type="range" 
                        min="-180" 
                        max="180" 
                        value={activeItem.rotation} 
                        onChange={(e) => handleRotationChange(e.target.value)}
                        style={{ height: '4px' }}
                      />
                    </div>
                  </div>

                  {/* 2. Premium Tactile Finishes & Customizer */}
                  {(activeItem.type === 'sofa' || activeItem.type === 'bed') && (
                    <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>2. Select Upholstery Fabric</span>
                      
                      {/* Fabric Selection Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {premiumFabrics.map(fab => {
                          const isActive = activeItem.material === fab.id;
                          return (
                            <button
                              key={fab.id}
                              onClick={() => handleMaterialChange(fab.id)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: '8px 10px',
                                background: isActive ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                                border: isActive ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isActive ? '0 4px 12px rgba(212,175,55,0.15)' : 'none'
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: isActive ? 'var(--dark)' : 'var(--muted)' }}>{fab.name}</span>
                                {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)' }} />}
                              </span>
                              <span style={{ fontSize: '9px', color: '#777', marginTop: '2px', lineHeight: '1.2' }}>{fab.desc}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Fabric Color Swatches */}
                      <div style={{ display: 'grid', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase' }}>3. Designer Drapery Color</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {fabricColors.map(color => {
                            const isActive = activeItem.color === color.hex;
                            return (
                              <button
                                key={color.hex}
                                onClick={() => handleColorChange(color.hex)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: color.hex,
                                  border: isActive ? '2px solid var(--dark)' : '1px solid rgba(0,0,0,0.15)',
                                  outline: isActive ? '2px solid var(--gold)' : 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  transition: 'transform 0.15s ease',
                                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={color.label}
                                aria-label={color.label}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {(activeItem.type === 'table' || activeItem.type === 'lamp') && (
                    <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>2. Select Hard Surface Material</span>
                      
                      {/* Stone/Metal Selection Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {premiumStones.map(stone => {
                          const isActive = activeItem.material === stone.id;
                          return (
                            <button
                              key={stone.id}
                              onClick={() => handleMaterialChange(stone.id)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: '8px 10px',
                                background: isActive ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.6)',
                                border: isActive ? '1.5px solid var(--gold)' : '1px solid var(--line)',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isActive ? '0 4px 12px rgba(212,175,55,0.15)' : 'none'
                              }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: isActive ? 'var(--dark)' : 'var(--muted)' }}>{stone.name}</span>
                                {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)' }} />}
                              </span>
                              <span style={{ fontSize: '9px', color: '#777', marginTop: '2px', lineHeight: '1.2' }}>{stone.desc}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Surface Finish Swatches - dynamically customizable */}
                      <div style={{ display: 'grid', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--muted)', textTransform: 'uppercase' }}>3. Material Shade & Finish Variation</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {surfaceColors.map(color => {
                            const isActive = activeItem.color === color.hex;
                            return (
                              <button
                                key={color.hex}
                                onClick={() => handleColorChange(color.hex)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: color.hex,
                                  border: isActive ? '2px solid var(--dark)' : '1px solid rgba(0,0,0,0.15)',
                                  outline: isActive ? '2px solid var(--gold)' : 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  transition: 'transform 0.15s ease',
                                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={color.label}
                                aria-label={color.label}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeItem.type === 'art' && (
                    <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>2. Fine Art Canvas & Palette</span>
                      
                      <div style={{ display: 'grid', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#666', lineHeight: '1.4' }}>Select a curated agency art frame palette. Adjusts the key contrast tone inside the floating gallery canvas.</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {artColors.map(color => {
                            const isActive = activeItem.color === color.hex;
                            return (
                              <button
                                key={color.hex}
                                onClick={() => handleColorChange(color.hex)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: color.hex,
                                  border: isActive ? '2px solid var(--dark)' : '1px solid rgba(0,0,0,0.15)',
                                  outline: isActive ? '2px solid var(--gold)' : 'none',
                                  cursor: 'pointer',
                                  padding: 0,
                                  transition: 'transform 0.15s ease',
                                  transform: isActive ? 'scale(1.1)' : 'scale(1)'
                                }}
                                title={color.label}
                                aria-label={color.label}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeItem.type === 'plant' && (
                    <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>2. Biophilic Accent Details</span>
                      <div style={{ padding: '10px', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', border: '1px solid var(--line)' }}>
                        <h5 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--dark)', margin: '0 0 4px 0' }}>Fiddle Leaf Fig Fig Asset</h5>
                        <p style={{ fontSize: '11px', color: '#666', margin: 0, lineHeight: '1.4' }}>
                          Presented in a premium fluted ceramic planter pot filled with damp potting soil and boasting broad, organic glossy green leaves. A fixed luxury visual asset.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Lighting group */}
            <div className="tool-group">
              <h3>5. Lighting mood</h3>
              <select 
                id="lightingMode" 
                value={lighting} 
                onChange={(e) => {
                  setLighting(e.target.value);
                  setStatus(`Lighting presets updated to ${e.target.value} mood.`);
                }}
                style={{ padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: '#fbfaf7' }}
              >
                <option value="warm">Warm Afternoon (Sunlight Shadows)</option>
                <option value="cool">Cool Daylight (Diffused Nordics)</option>
                <option value="bright">Bright Studio (Full Highlights)</option>
                <option value="moody">Moody Lounge (Dusk Ambient)</option>
                <option value="none">Original Background Flat</option>
              </select>
            </div>
          </aside>

          {/* Right Preview Panel */}
          <section className="canvas-panel" aria-label="Room preview">
            <div className="canvas-toolbar">
              <span className="status-pill" id="toolStatus">
                <Sparkles size={14} style={{ marginRight: '6px', color: 'var(--rust)' }} />
                {statusMsg}
              </span>
              <div className="tool-row">
                <button className="tool-button" onClick={handleReset} type="button" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={14} /> Reset
                </button>
                <button className="btn dark" onClick={handleDownload} type="button" style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '38px', padding: '8px 16px', fontSize: '13px' }}>
                  <Download size={14} /> Download concept
                </button>
              </div>
            </div>
            
            <div className="canvas-wrap">
              {/* Aspect Ratio Container for room preview layout */}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                
                {/* 1. Underlying Room Photo */}
                <img 
                  src={bgImage} 
                  alt="Gyapak interactive room backdrop" 
                  className="designer-bg-layer"
                />

                {/* 2. Three.js R3F WebGL Layer */}
                <div className={`designer-webgl-layer ${!selectingWall ? 'interactive' : ''}`}>
                  <DesignerCanvas 
                    objects={objects}
                    selectedId={selectedId}
                    onSelectObject={(idx) => {
                      setSelectedId(idx);
                      setStatus(`Selected ${objects[idx].type}. Adjust details or drag to relocate.`);
                    }}
                    onMoveObject={handleMoveObject}
                    calibration={calibration}
                    gridVisible={gridVisible}
                    lighting={lighting}
                    wallPoints={wallShape}
                    wallColor={wallColor}
                    wallTexture={wallTexture}
                  />
                </div>

                {/* 3. Overlaid 2D Drawing/Selection Layer (Active during wall selection) */}
                <div 
                  ref={overlayRef}
                  className={`designer-canvas-layer ${selectingWall ? 'active-wall-draw' : ''}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
                    {/* Drag selection draft box preview */}
                    {wallDraft.length === 4 && (
                      <polygon
                        points={wallDraft.map(p => `${(p.x/1200)*100}%,${(p.y/760)*100}%`).join(' ')}
                        fill="var(--rust)"
                        fillOpacity="0.15"
                        stroke="var(--rust)"
                        strokeWidth="2.5"
                        strokeDasharray="6,6"
                        style={{ vectorEffect: 'non-scaling-stroke' }}
                      />
                    )}

                    {/* Finalized wall outline visualization */}
                    {wallShape.length > 0 && (
                      <polygon
                        points={wallShape.map(p => `${(p.x/1200)*100}%,${(p.y/760)*100}%`).join(' ')}
                        fill={wallColor}
                        fillOpacity="0.34"
                        stroke="var(--gold)"
                        strokeWidth="2.5"
                        style={{ vectorEffect: 'non-scaling-stroke' }}
                      />
                    )}
                  </svg>
                </div>

              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
