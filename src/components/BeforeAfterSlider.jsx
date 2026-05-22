import React, { useState, useRef, useEffect } from 'react';

export default function BeforeAfterSlider({ beforeImg, afterImg, alt }) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(500);
  const containerRef = useRef(null);

  // ResizeObserver to track responsive width changes dynamically
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="before-after-slider"
      onMouseMove={(e) => { if (isDragging) handleMove(e.clientX); }}
      onTouchMove={(e) => { if (isDragging) handleTouchMove(e); }}
      onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
      onTouchStart={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/10',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'ew-resize',
        borderRadius: '12px',
        border: '1px solid rgba(176, 141, 87, 0.15)',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.04)',
        background: '#ece9e4'
      }}
    >
      {/* After Staged (Base Layer) */}
      <img 
        src={afterImg} 
        alt={`${alt} - After Staged`} 
        className="slider-image-after"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none'
        }}
      />
      <span 
        className="slider-badge after"
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(26, 26, 26, 0.65)',
          backdropFilter: 'blur(4px)',
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          pointerEvents: 'none',
          zIndex: 5
        }}
      >
        After Staged
      </span>

      {/* Before Raw (Overlay Layer) */}
      <div 
        className="slider-before-wrapper"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${sliderPosition}%`,
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <img 
          src={beforeImg} 
          alt={`${alt} - Before Raw`} 
          className="slider-image-before"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${containerWidth}px`,
            height: '100%',
            objectFit: 'cover',
            maxWidth: 'none',
            pointerEvents: 'none'
          }}
        />
        <span 
          className="slider-badge before"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(26, 26, 26, 0.65)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            pointerEvents: 'none',
            zIndex: 5
          }}
        >
          Before Raw
        </span>
      </div>

      {/* Slide Handle Line & Central Gold Circle */}
      <div 
        className="slider-handle-line"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '2px',
          background: 'var(--gold)',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <div 
          className="slider-handle-button"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--paper)',
            border: '2.5px solid var(--gold)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'ew-resize'
          }}
        >
          {/* Inner small rust dot */}
          <div 
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--rust)',
              transition: 'transform 0.15s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
}
