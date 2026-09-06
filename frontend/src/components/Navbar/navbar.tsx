import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">Drone<span className="logo-accent">TV</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Services</NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Courses</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink>
        </nav>

        {/* CTA */}
        <Link to="/contact" className="navbar-cta btn-primary" onClick={() => setMenuOpen(false)}>
          Get a Quote
        </Link>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <NavLink to="/" end className="mobile-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/services" className="mobile-link" onClick={() => setMenuOpen(false)}>Services</NavLink>
          <NavLink to="/courses" className="mobile-link" onClick={() => setMenuOpen(false)}>Courses</NavLink>
          <NavLink to="/contact" className="mobile-link" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        </nav>
      )}
    </header>
  )
}
