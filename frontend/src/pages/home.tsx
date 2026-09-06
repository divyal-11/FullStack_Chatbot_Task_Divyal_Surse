import { Link } from 'react-router-dom'
import './home.css'

const SERVICES = [
  { 
    icon: '🎬', 
    title: 'Aerial Cinematography', 
    desc: 'Cinematic 4K/6K RAW footage for films, events, and real-estate with gimbal-stabilised platforms.'
  },
  { 
    icon: '🔍', 
    title: 'Industrial Inspection', 
    desc: 'Thermal and high-zoom visual inspection of towers, bridges, pipelines, and industrial infrastructure.'
  },
  { 
    icon: '🌾', 
    title: 'Precision Agriculture', 
    desc: 'NDVI multispectral mapping and crop stress analysis to optimise yield and minimise input costs.'
  },
  { 
    icon: '🗺️', 
    title: '3D Mapping & Survey', 
    desc: 'Centimetre-accurate photogrammetry and LiDAR surveys for construction, GIS, and civil projects.'
  },
]

const COURSES = [
  {
    title: 'DGCA Certified Remote Pilot Course',
    duration: '30 days',
    level: 'Beginner',
    desc: 'Full ground school theory and flight training leading to an official DGCA Remote Pilot Certificate.',
    badge: 'DGCA Certified',
  },
  {
    title: 'Night Operations & BVLOS',
    duration: '5 days',
    level: 'Advanced',
    desc: 'Specialised flight protocols for beyond-visual-line-of-sight and night surveillance flight operations.',
    badge: 'Specialised',
  },
  {
    title: 'Drone Assembly & Maintenance',
    duration: '7 days',
    level: 'Intermediate',
    desc: 'Hands-on avionics, wiring, calibration, and troubleshooting for multi-rotor commercial drones.',
    badge: 'Hands-on',
  },
]

const CAPABILITY_BADGES = [
  'DGCA / Certified training',
  'AI / Support assistant',
  '24/7 / Information access',
]

export default function Home() {
  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-chatbot'))
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">See the ground before you fly.</h1>

            <p className="hero-desc">
              AI-guided support for DroneTV's training programs and aerial survey services.
            </p>

            <div className="hero-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleOpenChat}
              >
                Ask the assistant
              </button>
            </div>

            {/* Exactly 3 Approved Capability Badges */}
            <div className="hero-capabilities">
              {CAPABILITY_BADGES.map((badgeText, idx) => (
                <div key={idx} className="capability-badge">
                  {badgeText}
                </div>
              ))}
            </div>
          </div>

          {/* Plain SVG Radar Graphic */}
          <div className="hero-visual" aria-hidden="true">
            <svg
              width="320"
              height="320"
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hero-radar-svg"
            >
              {/* Outer circles in #4B5A6B */}
              <circle cx="160" cy="160" r="140" stroke="#4B5A6B" strokeWidth="1.5" />
              <circle cx="160" cy="160" r="95" stroke="#4B5A6B" strokeWidth="1.5" />
              {/* Inner circle in #7A9B7E */}
              <circle cx="160" cy="160" r="50" stroke="#7A9B7E" strokeWidth="1.5" />
              {/* One line from center to edge in #F2A63C */}
              <line x1="160" y1="160" x2="259" y2="61" stroke="#F2A63C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Services</span>
            <h2 className="section-title" style={{ marginTop: '0.75rem' }}>Our Core Services</h2>
            <p className="section-subtitle">
              From high-resolution aerial cinematography to millimeter-accurate GIS terrain models.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/services" className="service-learn-more">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn-secondary">
              View All Services →
            </Link>
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
                  <span>⏱ Duration: {c.duration}</span>
                  <span style={{ marginLeft: '1rem' }}>📊 Level: {c.level}</span>
                </div>
                <p>{c.desc}</p>
                <Link to="/courses" className="course-link">
                  View Syllabus →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container cta-container">
          <div className="cta-content">
            <h2 style={{ color: '#EDEDE4', marginBottom: '0.75rem' }}>Ready to Get Started?</h2>
            <p style={{ color: '#94A3B8', marginBottom: '1.75rem' }}>
              Connect with our team or ask our AI assistant to find the right training course or aerial survey service.
            </p>
            <div className="cta-actions">
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleOpenChat}
              >
                Ask the assistant
              </button>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
