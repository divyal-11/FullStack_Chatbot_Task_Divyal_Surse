import { Link } from 'react-router-dom'
import './courses.css'
import './services.css'

const COURSES = [
  {
    title: 'DGCA Certified Remote Pilot Course',
    badge: 'DGCA Certified',
    badgeType: 'accent',
    duration: '30 days',
    level: 'Beginner',
    eligibility: '10th Pass, Age 18+',
    fee: '₹45,000',
    desc: 'Complete ground school and practical flight training to earn your DGCA Remote Pilot Certificate. Covers regulations, meteorology, navigation, and multi-rotor operations.',
    curriculum: [
      'Air law & DGCA regulations',
      'Meteorology & navigation',
      'Drone systems & payloads',
      'Simulator & field flying',
      'Written & practical exam prep',
    ],
  },
  {
    title: 'Night Operations & BVLOS',
    badge: 'Advanced',
    badgeType: 'sage',
    duration: '5 days',
    level: 'Advanced',
    eligibility: 'DGCA RPC holder',
    fee: '₹18,000',
    desc: 'Specialised training for beyond-visual-line-of-sight operations and night flights. Covers lighting, obstacle avoidance, risk assessment, and regulatory permissions.',
    curriculum: [
      'Night flight regulations',
      'BVLOS operational planning',
      'Lighting & visibility systems',
      'Emergency procedures',
      'Permission application process',
    ],
  },
  {
    title: 'Drone Assembly & Maintenance',
    badge: 'Hands-on',
    badgeType: 'sage',
    duration: '7 days',
    level: 'Intermediate',
    eligibility: 'Basic electronics knowledge',
    fee: '₹12,000',
    desc: 'Build, calibrate, and maintain multi-rotor platforms from scratch. Understand ESCs, flight controllers, power systems, and troubleshoot common failures in the field.',
    curriculum: [
      'Frame & motor selection',
      'ESC & FC configuration',
      'Power system design',
      'Calibration & tuning (Betaflight/ArduPilot)',
      'Field maintenance & repair',
    ],
  },
  {
    title: 'Aerial Photography & Videography',
    badge: 'Creative',
    badgeType: 'accent',
    duration: '10 days',
    level: 'Beginner',
    eligibility: 'No prior experience needed',
    fee: '₹20,000',
    desc: 'Master camera settings, shot composition, and post-processing workflows for professional aerial content. Ideal for filmmakers, photographers, and content creators.',
    curriculum: [
      'Camera settings & RAW capture',
      'Shot planning & composition',
      'ND filters & lighting',
      'LUTs & colour grading',
      'Client delivery workflow',
    ],
  },
  {
    title: 'GIS & Mapping with Drones',
    badge: 'Technical',
    badgeType: 'accent',
    duration: '14 days',
    level: 'Intermediate',
    eligibility: 'Basic GIS or surveying background',
    fee: '₹28,000',
    desc: 'Learn to plan photogrammetry missions, process point clouds, and produce orthomosaics and DEMs using industry-standard tools like Pix4D and Agisoft Metashape.',
    curriculum: [
      'Mission planning (DJI, Pix4D)',
      'Ground control points (GCPs)',
      'Photogrammetry processing',
      'Point cloud & DEM generation',
      'GIS output & reporting',
    ],
  },
]

export default function Courses() {
  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="page-hero">
        <div className="container">
          <span className="badge badge-sage">Training Academy</span>
          <h1>Pilot Training & Courses</h1>
          <p>
            DGCA-recognised programmes designed for aspiring pilots, industry professionals,
            and creative content creators at every skill level.
          </p>
        </div>
      </section>

      {/* ── COURSES GRID ── */}
      <section className="courses-page">
        <div className="container">
          <div className="courses-page-grid">
            {COURSES.map(c => (
              <div key={c.title} className="course-detail-card">
                <div className="course-card-header">
                  <h2>{c.title}</h2>
                  <span className={`badge badge-${c.badgeType}`}>{c.badge}</span>
                </div>

                <p>{c.desc}</p>

                <div className="course-stats">
                  <div className="course-stat">
                    <span className="course-stat-label">Duration</span>
                    <span className="course-stat-value">{c.duration}</span>
                  </div>
                  <div className="course-stat">
                    <span className="course-stat-label">Level</span>
                    <span className="course-stat-value">{c.level}</span>
                  </div>
                  <div className="course-stat">
                    <span className="course-stat-label">Eligibility</span>
                    <span className="course-stat-value" style={{ fontSize: '0.78rem' }}>{c.eligibility}</span>
                  </div>
                  <div className="course-stat">
                    <span className="course-stat-label">Fee</span>
                    <span className="course-stat-value" style={{ color: 'var(--accent)' }}>{c.fee}</span>
                  </div>
                </div>

                <div className="course-curriculum">
                  <p className="course-curriculum-title">Curriculum Highlights</p>
                  {c.curriculum.map(item => (
                    <span key={item} className="curriculum-item">{item}</span>
                  ))}
                </div>

                <Link to="/contact" className="btn-primary">Enrol Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
