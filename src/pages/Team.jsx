import React from 'react';

export default function Team() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Meet the Team</p>
          <h1>The designers behind the <em>vision</em>.</h1>
          <p>Gyapak's multidisciplinary team combines architectural training, furniture design, color theory, and digital rendering technology to deliver cohesive, custom interior spaces.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="team-grid">
            <article className="team-card">
              <div className="portrait" style={{ backgroundImage: 'url("/public/assets/images/gyapak-office.png")' }}>
                <span>AG</span>
              </div>
              <div className="team-body">
                <span className="role">Principal Designer</span>
                <h3>Anya Gupta</h3>
                <p>Leading spatial planning and material directions. Anya has over a decade of residential design experience.</p>
              </div>
            </article>

            <article className="team-card">
              <div className="portrait alt-1" style={{ backgroundImage: 'url("/public/assets/images/gyapak-bedroom.png")' }}>
                <span>RK</span>
              </div>
              <div className="team-body">
                <span className="role">Lead 3D Visualizer</span>
                <h3>Rohan Kapoor</h3>
                <p>Specializing in realistic perspective mapping and architectural rendering to bring concepts to life.</p>
              </div>
            </article>

            <article className="team-card">
              <div className="portrait alt-2" style={{ backgroundImage: 'url("/public/assets/images/gyapak-kitchen.png")' }}>
                <span>MS</span>
              </div>
              <div className="team-body">
                <span className="role">Styling and Sourcing</span>
                <h3>Meera Sen</h3>
                <p>Curating custom furniture selections, artisanal fabrics, lighting fixtures, and final room staging.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
