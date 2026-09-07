import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import './Footer.css'

export default function Footer() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
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
        </div>
      </div>
    </motion.footer>
  )
}
