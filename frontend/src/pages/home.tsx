import { Link } from 'react-router-dom'
import './home.css'

const SERVICES = [
  { 
    icon: '🎬', 
    title: 'Aerial Cinematography', 
    desc: 'Cinematic 4K/6K RAW footage for films, events, and real-estate with gimbal-stabilised platforms.',
    tag: 'Cinema Grade'
  },
  { 
    icon: '🔍', 
    title: 'Industrial Inspection', 
    desc: 'Thermal and high-zoom visual inspection of towers, bridges, pipelines, and industrial infrastructure.',
    tag: 'Thermal & Zoom'
  },
  { 
    icon: '🌾', 
    title: 'Precision Agriculture', 
    desc: 'NDVI multispectral mapping and crop stress analysis to optimise yield and minimise input costs.',
    tag: 'NDVI Mapping'
  },
  { 
    icon: '🗺️', 
    title: '3D Mapping & Survey', 
    desc: 'Centimetre-accurate photogrammetry and LiDAR surveys for construction, GIS, and civil projects.',
    tag: 'RTK Sub-cm'
  },
]

const COURSES = [
  {
    title: 'DGCA Certified Remote Pilot Course',
    duration: '30 days',
    level: 'Beginner to Pro',
    desc: 'Full ground school theory and hands-on flight training leading to an official DGCA Remote Pilot Certificate.',
    badge: 'DGCA Certified',
    badgeClass: 'badge-emerald',
  },
  {
    title: 'Night Operations & BVLOS',
    duration: '5 days',
    level: 'Advanced',
    desc: 'Specialised flight protocols for beyond-visual-line-of-sight and night surveillance flight operations.',
    badge: 'Specialised',
    badgeClass: 'badge-cyan',
  },
  {
    title: 'Drone Assembly & Maintenance',
    duration: '7 days',
    level: 'Intermediate',
    desc: 'Hands-on avionics, wiring, calibration, and troubleshooting for multi-rotor commercial drones.',
    badge: 'Hands-on Lab',
    badgeClass: 'badge-accent',
  },
]

const STATS = [
  { number: '500+', label: 'Successful Flight Missions' },
  { number: '100%', label: 'DGCA Compliance Record' },
  { number: '50+', label: 'Enterprise & Govt Clients' },
  { number: '4.9★', label: 'Average Pilot Rating' },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        {/* Ambient Mesh Glows */}
        <div className="hero-glow-blob blob-1" aria-hidden="true" />
        <div className="hero-glow-blob blob-2" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              <span>DGCA Certified Aerial Solutions</span>
            </div>
            
            <h1 className="hero-title">
              The Sky Is Your<br />
              <span className="highlight-gradient">Competitive Edge</span>
            </h1>

            <p className="hero-desc">
              DroneTV delivers enterprise aerial intelligence — from cinematic RAW production
              to precision multispectral surveys — powered by certified master pilots and
              state-of-the-art UAV fleets.
            </p>

            <div className="hero-actions">
              <Link to="/services" className="btn-primary">
                Explore Services <span className="btn-arrow">→</span>
              </Link>
              <Link to="/contact" className="btn-secondary">
                Request Custom Quote
              </Link>
            </div>

            {/* Quick Stats Bar */}
            <div className="hero-stats-row">
              {STATS.map((stat, i) => (
                <div key={i} className="hero-stat-item">
                  <strong>{stat.number}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Holographic Drone Visual */}
          <div className="hero-visual" aria-hidden="true">
            <div className="drone-hologram">
              <div className="radar-sweep" />
              <div className="drone-ring ring-1" />
              <div className="drone-ring ring-2" />
              <div className="drone-ring ring-3" />
              
              {/* Floating Drone Core */}
              <div className="drone-core">
                <span className="drone-core-icon">🛸</span>
                <span className="drone-shadow" />
              </div>

              {/* Floating Telemetry Chips */}
              <div className="telemetry-chip chip-1">
                <span className="chip-indicator" />
                <span className="chip-text">RTK GPS • 0.8cm</span>
              </div>

              <div className="telemetry-chip chip-2">
                <span className="chip-indicator" />
                <span className="chip-text">4K 60FPS • ProRes</span>
              </div>

              <div className="telemetry-chip chip-3">
                <span className="chip-indicator" />
                <span className="chip-text">DGCA Authorized</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-accent">Enterprise Capabilities</span>
            <h2 className="section-title" style={{ marginTop: '0.85rem' }}>Our Core Drone Services</h2>
            <p className="section-subtitle">
              From high-resolution aerial cinematography to millimeter-accurate GIS terrain models.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="service-card">
                <div className="service-card-top">
                  <div className="service-icon">{s.icon}</div>
                  <span className="service-tag">{s.tag}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/services" className="service-learn-more">
                  Explore service <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="services-footer-cta">
            <Link to="/services" className="btn-secondary">
              View All 6 Specialized Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="courses-section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-emerald">Pilot Academy</span>
            <h2 className="section-title" style={{ marginTop: '0.85rem' }}>DGCA Pilot Training & Certifications</h2>
            <p className="section-subtitle">
              Learn from certified flight instructors at our Mumbai facility with hands-on simulator and field hours.
            </p>
          </div>

          <div className="courses-grid">
            {COURSES.map(c => (
              <div key={c.title} className="course-card">
                <div className="course-card-badge-row">
                  <span className={`badge ${c.badgeClass}`}>{c.badge}</span>
                  <span className="course-level-pill">{c.level}</span>
                </div>
                <h3>{c.title}</h3>
                <div className="course-meta">
                  <span>⏱ Duration: {c.duration}</span>
                </div>
                <p>{c.desc}</p>
                <Link to="/courses" className="course-link">
                  View Syllabus & Enrol <span>→</span>
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
            <span className="badge badge-accent">Get Started</span>
            <h2>Ready to Elevate Your Operations?</h2>
            <p>
              Connect with our flight operations team or ask our AI assistant for immediate service estimates and curriculum details.
            </p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-primary">
                Submit an Enquiry <span>→</span>
              </Link>
              <Link to="/courses" className="btn-secondary">
                Browse Training Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
