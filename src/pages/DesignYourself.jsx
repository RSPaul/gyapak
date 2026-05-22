import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCcw, Download, Eye, EyeOff, Sparkles } from 'lucide-react';
import DesignerCanvas from '../components/DesignerCanvas';

// Default room background options
const templates = [
  { id: 'living', name: 'Living Room', url: '/public/assets/images/gyapak-living-room.png' },
  { id: 'bedroom', name: 'Bedroom', url: '/public/assets/images/gyapak-bedroom.png' },
  { id: 'kitchen', name: 'Kitchen', url: '/public/assets/images/gyapak-kitchen.png' },
  { id: 'office', name: 'Home Office', url: '/public/assets/images/gyapak-office.png' }
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
  sofa: { color: '#315f73', scale: 100, rotation: 0 },
  bed: { color: '#d9cab8', scale: 100, rotation: 0 },
  table: { color: '#8b5b3d', scale: 100, rotation: 0 },
  lamp: { color: '#b88a44', scale: 100, rotation: 0 },
  plant: { color: '#28634f', scale: 100, rotation: 0 },
  art: { color: '#a94f36', scale: 100, rotation: 0 }
};

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
      rotation: defaults.rotation
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
                  { id: 'sofa', name: 'Emerald Sofa', desc: 'Mid-Century Tufted', thumb: '/public/assets/images/thumb-sofa.png' },
                  { id: 'bed', name: 'Deluxe Bed', desc: 'Hotel Wingback Platform', thumb: '/public/assets/images/thumb-bed.png' },
                  { id: 'table', name: 'Carrara Table', desc: 'Polished Marble Top', thumb: '/public/assets/images/thumb-table.png' },
                  { id: 'lamp', name: 'Arc Lamp', desc: 'Travertine & Brass', thumb: '/public/assets/images/thumb-lamp.png' },
                  { id: 'plant', name: 'Fiddle Leaf Fig', desc: 'Fluted Ceramic Pot', thumb: '/public/assets/images/thumb-plant.png' },
                  { id: 'art', name: 'Floating Art', desc: 'Canvas in Walnut Frame', thumb: '/public/assets/images/thumb-art.png' }
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

              {/* Selected object translation */}
              {activeItem && (
                <div style={{ display: 'grid', gap: '8px', background: '#fcfbf7', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--rust)', textTransform: 'uppercase' }}>Active: {activeItem.type}</span>
                    <button 
                      className="tool-button" 
                      onClick={() => {
                        setObjects(prev => prev.filter((_, idx) => idx !== selectedId));
                        setSelectedId(-1);
                        setStatus('Furniture item removed.');
                      }}
                      style={{ minHeight: '26px', padding: '2px 6px', fontSize: '10px', flex: 'none', background: '#fff0f0', color: '#cc0000', borderColor: '#ffcccc' }}
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="range">
                    <label className="range-label">
                      <span>Proportional Size</span>
                      <span>{activeItem.scale}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="50" 
                      max="180" 
                      value={activeItem.scale} 
                      onChange={(e) => handleScaleChange(e.target.value)}
                    />
                  </div>

                  <div className="range">
                    <label className="range-label">
                      <span>Y-Axis Rotation</span>
                      <span>{activeItem.rotation}°</span>
                    </label>
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      value={activeItem.rotation} 
                      onChange={(e) => handleRotationChange(e.target.value)}
                    />
                  </div>
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
