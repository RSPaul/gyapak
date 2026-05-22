import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        {/* Style background directly for robust loading in Vite */}
        <style dangerouslySetInnerHTML={{__html: `
          .hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(90deg, rgba(17, 19, 17, 0.76), rgba(17, 19, 17, 0.38) 48%, rgba(17, 19, 17, 0.12)),
              url("/public/assets/images/gyapak-living-room.png");
            background-size: cover;
            background-position: center;
            z-index: -2;
          }
        `}} />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Interior design for homes that work beautifully</p>
            <h1>Gyapak <em>Interiors</em></h1>
            <p className="lead">Design the space around how you <em>live</em>, gather, rest, cook, work, and <em>dream</em>.</p>
            <div className="hero-actions">
              <Link className="btn primary" to="/design-yourself">Try Design Yourself</Link>
              <Link className="btn ghost" to="/portfolio">View Portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Gyapak highlights">
        <div className="container">
          <div className="stats-grid">
            <div className="stat"><strong>42+</strong><span>spaces conceptualized</span></div>
            <div className="stat"><strong>6</strong><span>room categories</span></div>
            <div className="stat"><strong>3D</strong><span>visual planning support</span></div>
            <div className="stat"><strong>1:1</strong><span>designer consultation</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="copy-stack">
            <p className="eyebrow">What we do</p>
            <h2>Thoughtful interiors, from first sketch to final styling.</h2>
            <p className="body-copy">Gyapak brings together space planning, material selection, mood boards, furniture direction, and execution guidance so every room feels intentional without becoming impractical.</p>
            <div className="button-row">
              <Link className="btn dark" to="/about">Meet Gyapak</Link>
              <Link className="btn outline" to="/contact">Book a consultation</Link>
            </div>
          </div>
          <div className="media-frame">
            <img src="/public/assets/images/gyapak-bedroom.png" alt="Elegant bedroom designed by Gyapak" />
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2>Designed for real rooms.</h2>
            </div>
            <p>Choose only what you need or bring us in for the complete design journey.</p>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <strong>Residential Interiors</strong>
              <p>Living rooms, bedrooms, kitchens, and family spaces planned around daily comfort.</p>
            </article>
            <article className="service-card">
              <strong>Concept and 3D Views</strong>
              <p>Mood boards, layouts, finishes, and visual direction before any major commitment.</p>
            </article>
            <article className="service-card">
              <strong>Styling and Refresh</strong>
              <p>Color, lighting, decor, furniture placement, and finishing touches for existing spaces.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured portfolio</p>
              <h2>Spaces with personality and purpose.</h2>
            </div>
            <Link className="btn outline" to="/portfolio">See all work</Link>
          </div>
          <div className="portfolio-grid">
            <article className="project-card">
              <img src="/public/assets/images/gyapak-living-room.png" alt="Modern living room by Gyapak" />
              <div className="project-body">
                <div className="tag-row"><span className="tag">Living Room</span><span className="tag">Warm Modern</span></div>
                <h3>Walnut Social Lounge</h3>
                <p>Layered seating, wall detailing, and soft lighting for a family-first living room.</p>
              </div>
            </article>
            <article className="project-card">
              <img src="/public/assets/images/gyapak-kitchen.png" alt="Modern kitchen by Gyapak" />
              <div className="project-body">
                <div className="tag-row"><span className="tag">Kitchen</span><span className="tag">Functional</span></div>
                <h3>Morning Kitchen Studio</h3>
                <p>A practical modular kitchen with storage rhythm, clean counters, and calm materials.</p>
              </div>
            </article>
            <article className="project-card">
              <img src="/public/assets/images/gyapak-office.png" alt="Home office by Gyapak" />
              <div className="project-body">
                <div className="tag-row"><span className="tag">Home Office</span><span className="tag">Compact</span></div>
                <h3>Focus Nook</h3>
                <p>A small work zone shaped for productivity, storage, and visual quiet.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Design Yourself</p>
              <h2>Upload a room. Try ideas before you commit.</h2>
            </div>
            <p>Our interactive 3D tool lets you calibrate a custom room photo perspective, paint walls, test custom 3D furniture models, and dynamic lighting presets.</p>
          </div>
          <div className="process-grid">
            <article className="process-step"><strong>1. Upload</strong><p>Add a room photo from phone or desktop.</p></article>
            <article className="process-step"><strong>2. Calibrate</strong><p>Align the 3D ground plane with your photo's perspective.</p></article>
            <article className="process-step"><strong>3. Customize</strong><p>Draw walls, apply colors, textures, and place 3D furniture.</p></article>
            <article className="process-step"><strong>4. Export</strong><p>Download a high-quality consolidated rendering of your concept.</p></article>
          </div>
          <div className="button-row" style={{ marginTop: '26px' }}>
            <Link className="btn primary" to="/design-yourself">Open the tool</Link>
            <Link className="btn ghost" to="/contact">Talk to a designer</Link>
          </div>
        </div>
      </section>
    </>
  );
}
