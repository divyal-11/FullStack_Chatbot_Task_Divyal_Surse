import { Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import './services.css'

const SERVICES = [
  {
    icon: '🎬',
    title: 'Aerial Cinematography',
    desc: 'Capture stunning 4K footage for films, commercials, real-estate listings, weddings, and live events. Our stabilised gimbal systems deliver broadcast-quality results in any condition.',
    features: ['4K / 6K RAW capture', 'Gimbal-stabilised', 'FPV freestyle', 'Live streaming feed', 'Same-day delivery'],
  },
  {
    icon: '🔍',
    title: 'Industrial Inspection',
    desc: 'Replace risky rope-access and scaffolding with safe, efficient drone inspections for towers, wind turbines, pipelines, bridges, and high-rise structures.',
    features: ['Thermal imaging', 'Zoom camera', 'Detailed PDF report', 'Georeferenced images', 'Regulatory compliant'],
  },
  {
    icon: '🌾',
    title: 'Precision Agriculture',
    desc: 'Unlock data-driven farming with NDVI multispectral mapping. Identify crop stress, water distribution issues, and pest zones before they become costly problems.',
    features: ['NDVI & RGB mapping', 'Crop health reports', 'Irrigation analysis', 'Variable-rate spraying', 'Yield prediction'],
  },
  {
    icon: '🗺️',
    title: '3D Mapping & Survey',
    desc: 'Generate centimetre-accurate orthomosaics, digital elevation models, and point clouds using photogrammetry and LiDAR for construction, mining, and GIS projects.',
    features: ['LiDAR scanning', 'Photogrammetry', 'DEM / DTM output', 'GIS integration', 'CAD export'],
  },
  {
    icon: '🏗️',
    title: 'Construction Monitoring',
    desc: 'Track project progress, verify earthworks, and produce volumetric reports at every stage of construction with scheduled drone flyovers and automated comparison tools.',
    features: ['Weekly site surveys', 'Volume calculations', 'Progress reports', 'BIM integration', 'Stockpile measurement'],
  },
  {
    icon: '🔒',
    title: 'Security & Surveillance',
    desc: 'Deploy aerial surveillance for large-area perimeter monitoring, crowd management, and event security — covering ground that fixed cameras simply cannot reach.',
    features: ['Night-vision capable', 'Real-time streaming', 'Wide-area coverage', 'Event management', 'Perimeter patrol'],
  },
]

export default function Services() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <>
      {/* ── PAGE HERO ── */}
      <motion.section 
        className="page-hero"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container">
          <span className="badge badge-accent">What We Offer</span>
          <h1>Professional Drone Services</h1>
          <p>
            From cinematic production to precision data collection — DroneTV's DGCA-certified
            team delivers industry-leading aerial solutions tailored to your project.
          </p>
        </div>
      </motion.section>

      {/* ── SERVICES LIST ── */}
      <section className="services-page">
        <div className="container">
          <motion.div 
            className="services-list"
            variants={containerVariants}
            initial="visible"
            animate="visible"
          >
            {SERVICES.map(s => (
              <motion.div 
                key={s.title} 
                className="service-detail-card"
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.22, ease: 'easeOut' } }}
              >
                <div className="svc-icon-wrap">{s.icon}</div>
                <div className="svc-body">
                  <h2>{s.title}</h2>
                  <p>{s.desc}</p>
                  <div className="svc-features">
                    {s.features.map(f => (
                      <span key={f} className="svc-feature-tag">✓ {f}</span>
                    ))}
                  </div>
                </div>
                <div className="svc-action">
                  <Link to="/contact" className="btn-primary">Enquire Now</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
