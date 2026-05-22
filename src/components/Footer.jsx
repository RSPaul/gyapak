import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>Gyapak</strong> &copy; {currentYear}. Design the Space.
        </div>
        <div className="mini-links">
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/design-yourself">Design Yourself</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
