import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <NavLink className="brand" to="/" onClick={() => setIsOpen(false)}>
          <span className="brand-mark">Gyapak</span>
          <span className="brand-line">Design the Space</span>
        </NavLink>

        <button 
          className="nav-toggle" 
          type="button" 
          onClick={toggleMenu}
          aria-label={isOpen ? "Close navigation" : "Open navigation"} 
          aria-expanded={isOpen}
          style={{ display: 'flex' }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
            About
          </NavLink>
          <NavLink to="/team" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Team
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Portfolio
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/design-yourself" className="nav-cta" onClick={() => setIsOpen(false)}>
            Design Yourself
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
