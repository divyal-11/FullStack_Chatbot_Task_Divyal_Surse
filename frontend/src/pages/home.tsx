import { Link } from 'react-router-dom'
import './home.css'

const SERVICES = [
  { icon: '🎬', title: 'Aerial Cinematography', desc: 'Cinematic footage for films, events, and real-estate with 4K stabilised cameras.' },
  { icon: '🔍', title: 'Industrial Inspection', desc: 'Safe, cost-effective inspection of towers, pipelines, and infrastructure.' },
  { icon: '🌾', title: 'Precision Agriculture', desc: 'NDVI mapping and crop-health analysis to optimise yield and reduce waste.' },
  { icon: '🗺️', title: '3D Mapping & Survey', desc: 'High-accuracy photogrammetry and LiDAR surveys for construction and GIS.' },
]

const COURSES = [
  {
    title: 'DGCA Certified Pilot Course',
    duration: '30 days',
    level: 'Beginner',
    desc: 'Complete ground school and flight training to earn your DGCA Remote Pilot Certificate.',
    badge: 'DGCA Certified',
  },
  {
    title: 'Night Operations & BVLOS',
    duration: '5 days',
    level: 'Advanced',
    desc: 'Specialised training for beyond-visual-line-of-sight and night flight operations.',
    badge: 'Advanced',
  },
  {
    title: 'Drone Assembly & Maintenance',
    duration: '7 days',
    level: 'Intermediate',
    desc: 'Hands-on build, calibrate, and maintain multi-rotor platforms from scratch.',
    badge: 'Hands-on',
  },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-tag">Professional Drone Services</p>
            <h1 className="hero-title">
              The Sky Is Your<br />
              <span className="highlight">Competitive Edge</span>
            </h1>
            <p className="hero-desc">
              DroneTV delivers end-to-end aerial solutions — from cinematic production
              to precision agriculture — backed by DGCA-certified pilots and
              cutting-edge technology.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn-primary">Explore Services</Link>
              <Link to="/contact" className="btn-secondary">Get a Quote</Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="drone-icon-wrap">
              <div className="drone-ring" />
              <div className="drone-ring" />
              <div className="drone-ring" />
              <div className="drone-center">🚁</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">What We Do</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Our Core Services</h2>
            <p className="section-subtitle">
              From the first survey flight to final deliverable — we cover every aerial need.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn-secondary">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="courses-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-sage">Training</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Pilot Training & Courses</h2>
            <p className="section-subtitle">
              DGCA-recognised programmes designed for aspiring pilots and industry professionals.
            </p>
          </div>
          <div className="courses-grid">
            {COURSES.map(c => (
              <div key={c.title} className="course-card">
                <span className="badge badge-sage">{c.badge}</span>
                <h3>{c.title}</h3>
                <div className="course-meta">
                  <span>⏱ {c.duration}</span>
                  <span>📊 {c.level}</span>
                </div>
                <p>{c.desc}</p>
                <Link to="/courses" className="course-link">Learn more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container">
          <h2>Ready to Take Flight?</h2>
          <p>Speak with our team or chat with our AI assistant to find the right service or course for you.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn-primary">Submit an Enquiry</Link>
            <Link to="/courses" className="btn-secondary">Browse Courses</Link>
          </div>
        </div>
      </section>
    </>
  )
}
