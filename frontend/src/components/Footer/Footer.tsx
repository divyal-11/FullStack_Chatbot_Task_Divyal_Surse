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

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/services">Services</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </motion.footer>
  )
}
