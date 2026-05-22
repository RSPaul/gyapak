import React, { useState } from 'react';

const projects = [
  {
    id: 1,
    title: 'Walnut Social Lounge',
    category: 'living',
    tag: 'Warm Modern',
    description: 'Layered seating, custom walnut wall detailing, and soft lighting for a family-first living room.',
    img: '/assets/images/gyapak-living-room.png'
  },
  {
    id: 2,
    title: 'Morning Kitchen Studio',
    category: 'kitchen',
    tag: 'Functional Modular',
    description: 'A practical modular kitchen with smart storage rhythm, natural stone counters, and calm materials.',
    img: '/assets/images/gyapak-kitchen.png'
  },
  {
    id: 3,
    title: 'Focus Nook',
    category: 'office',
    tag: 'Compact Utility',
    description: 'A custom work zone shaped for optimal remote productivity, vertical storage, and visual quiet.',
    img: '/assets/images/gyapak-office.png'
  },
  {
    id: 4,
    title: 'Minimalist Sand Bedroom',
    category: 'bedroom',
    tag: 'Serene Rest',
    description: 'A calm bedroom utilizing earthy textured wall lime plaster, linen upholstery, and concealed ambient lights.',
    img: '/assets/images/gyapak-bedroom.png'
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Our Work</p>
          <h1>Spaces with <em>personality</em> and purpose.</h1>
          <p>Explore a collection of residential and creative workspaces designed by Gyapak, showcasing organic materials, structured lighting, and thoughtful spacing.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filter-bar">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => setFilter('all')}
            >
              All projects
            </button>
            <button 
              className={`filter-btn ${filter === 'living' ? 'active' : ''}`} 
              onClick={() => setFilter('living')}
            >
              Living Rooms
            </button>
            <button 
              className={`filter-btn ${filter === 'kitchen' ? 'active' : ''}`} 
              onClick={() => setFilter('kitchen')}
            >
              Kitchens
            </button>
            <button 
              className={`filter-btn ${filter === 'office' ? 'active' : ''}`} 
              onClick={() => setFilter('office')}
            >
              Offices
            </button>
            <button 
              className={`filter-btn ${filter === 'bedroom' ? 'active' : ''}`} 
              onClick={() => setFilter('bedroom')}
            >
              Bedrooms
            </button>
          </div>

          <div className="portfolio-grid">
            {filteredProjects.map(project => (
              <article key={project.id} className="project-card">
                <img src={project.img} alt={project.title} />
                <div className="project-body">
                  <div className="tag-row">
                    <span className="tag">{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</span>
                    <span className="tag">{project.tag}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
