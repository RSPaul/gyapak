import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'residential',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request
    setSubmitted(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'residential',
      message: ''
    });
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact Us</p>
          <h1>Let's design your <em>space together</em>.</h1>
          <p>Whether you have a fully formed room concept from our designer tool or just some initial ideas, we would love to collaborate on your next design project.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-list">
            <article className="contact-card">
              <strong>Studio Location</strong>
              <p>18 Walnut Grove Crescent,<br />Creative Quarter, Suite 4A</p>
            </article>

            <article className="contact-card">
              <strong>Email & Support</strong>
              <p>design@gyapak.com<br />consultation@gyapak.com</p>
            </article>

            <article className="contact-card">
              <strong>Phone Hours</strong>
              <p>+1 (555) 438-9272<br />Mon–Fri, 9am–5pm EST</p>
            </article>
          </div>

          <div>
            {submitted ? (
              <div className="form" style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: 'var(--deep)', marginBottom: '14px' }}>Thank you!</h3>
                <p style={{ color: 'var(--muted)' }}>Your design consultation request has been received. One of our lead designers will contact you within 24–48 hours.</p>
                <button 
                  className="btn primary" 
                  style={{ marginTop: '20px' }} 
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="e.g. Sarah Jenkins" 
                      required 
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="e.g. sarah@example.com" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="e.g. +1 (555) 000-0000" 
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="service">Design Service</label>
                    <select 
                      id="service" 
                      name="service" 
                      value={formData.service} 
                      onChange={handleChange}
                    >
                      <option value="residential">Residential Design</option>
                      <option value="concept3d">Concept & 3D Views</option>
                      <option value="styling">Styling Refresh</option>
                      <option value="consultation">One-on-One Advice</option>
                    </select>
                  </div>
                </div>

                <div className="field full">
                  <label htmlFor="message">Project Description</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell us about the room, dimensions, preferred colors, and any concepts you have downloaded..." 
                    required
                  ></textarea>
                </div>

                <button className="btn primary full" type="submit">Submit Request</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
