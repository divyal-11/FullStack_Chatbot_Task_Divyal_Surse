import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span style={{ color: 'var(--accent)' }}>◈</span>
            <span>Drone<span style={{ color: 'var(--accent)' }}>TV</span></span>
          </Link>
          <p className="footer-tagline">
            Professional drone services and DGCA-certified pilot training for the modern aerial era.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/services">Aerial Cinematography</Link>
            <Link to="/services">Industrial Inspection</Link>
            <Link to="/services">Precision Agriculture</Link>
            <Link to="/services">3D Mapping & Survey</Link>
          </div>
          <div className="footer-col">
            <h4>Training</h4>
            <Link to="/courses">DGCA Pilot Course</Link>
            <Link to="/courses">Night Operations</Link>
            <Link to="/courses">Drone Assembly</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/contact">Get a Quote</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} DroneTV. All rights reserved.</p>
          <p>Built for IPAGE Group Full Stack Intern Assessment.</p>
        </div>
      </div>
    </footer>
  )
}
