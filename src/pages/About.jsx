import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About Gyapak</p>
          <h1>Thoughtful interiors, designed for <em>real life</em>.</h1>
          <p>Gyapak is an interior design agency focused on balancing visual poetry with spatial function. We collaborate with clients to build personal, expressive, and resilient spaces.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="media-frame">
            <img src="/public/assets/images/gyapak-office.png" alt="Collaborative design studio space" />
          </div>
          <div className="copy-stack">
            <p className="eyebrow">Our Philosophy</p>
            <h2>We believe that design should <em>listen first</em>, then create.</h2>
            <p className="body-copy">
              A home or workspace shouldn't look like a standard catalog mockup. It should reflect the unique personalities, habits, and pathways of the people who inhabit it. We emphasize raw materials, layered lighting, responsive layouts, and textured warmth to build spaces that mature beautifully over time.
            </p>
            <p className="body-copy">
              Our 3D room-staging environment allows you to take control of the first conceptual step—testing color directions, furniture dimensions, and orientation directly in your own space before any material decisions are finalized.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Core Values</p>
              <h2>The foundations of Gyapak.</h2>
            </div>
            <p>Every conceptual sketch, rendering, and final installation is guided by three principles.</p>
          </div>
          <div className="values-grid">
            <article className="value-card">
              <strong>Honesty of Materials</strong>
              <p>We prioritize materials that feel organic and solid—linen, local hardwoods, brushed metals, lime plasters, and hand-cast terrazzo.</p>
            </article>
            <article className="value-card">
              <strong>Spatial Intelligence</strong>
              <p>Every piece of furniture, partition wall, or task light is positioned based on traffic flow, ergonomics, and daily ritual.</p>
            </article>
            <article className="value-card">
              <strong>Dynamic Vision</strong>
              <p>We equip you with visualizer tools and detailed layouts so you always feel confident and informed throughout the journey.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
