import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from 'motion/react'
import gsap from 'gsap'
import Radar from '../components/Radar/Radar'
import { submitEnquiry } from '../utils/api'
import type { UserType } from '../types'
import './home.css'

// ── Real Services Data ─────────────────────────────────────────────────────
const SERVICES = [
  {
    code: 'SRV-01',
    icon: '🗺️',
    title: 'Aerial Survey & Mapping',
    desc: 'Centimetre-accurate photogrammetry and LiDAR 3D elevation models for civil engineering, infrastructure, and GIS planning.',
    features: ['High-density LiDAR point clouds', 'Orthomosaic mapping & DEM / DTM', 'CAD & GIS format integration', 'Volumetric earthwork computation'],
    interestVal: '3D Mapping & Survey',
  },
  {
    code: 'SRV-02',
    icon: '🎓',
    title: 'DGCA Pilot Training',
    desc: 'Official Directorate General of Civil Aviation recognised training programmes conducted by experienced aviation instructors.',
    features: ['DGCA Remote Pilot Certification (RPC)', 'Hands-on simulator & airfield flying', 'Night operations & BVLOS preparation', 'Air law, navigation & meteorology'],
    interestVal: 'DGCA Pilot Course',
  },
  {
    code: 'SRV-03',
    icon: '🔍',
    title: 'Thermal & Industrial Inspection',
    desc: 'High-resolution radiometric thermal imaging to safely audit high-voltage transmission lines, pipelines, and industrial assets.',
    features: ['Zero-risk rope & scaffolding replacement', 'Thermal anomaly & hot-spot detection', 'Georeferenced comprehensive audit PDF', 'Certified industrial flight compliance'],
    interestVal: 'Industrial Inspection',
  },
]

// ── Real Course Data ───────────────────────────────────────────────────────
const COURSES = [
  {
    title: 'DGCA Certified Remote Pilot Course',
    badge: 'DGCA Certified',
    badgeType: 'accent',
    duration: '30 days',
    level: 'Beginner',
    eligibility: '10th Pass, Age 18+',
    fee: '₹45,000',
    desc: 'Complete ground school and practical airfield flight training to earn your official DGCA Remote Pilot Certificate.',
    curriculum: [
      'Aviation air law & DGCA safety rules',
      'Meteorology, weather assessment & navigation',
      'UAS flight dynamics & fail-safe systems',
      'Simulator + outdoor practical flight training',
      'Written & practical pilot examination',
    ],
    interestVal: 'DGCA Pilot Course',
  },
  {
    title: 'Night Operations & BVLOS',
    badge: 'Advanced',
    badgeType: 'sage',
    duration: '5 days',
    level: 'Advanced',
    eligibility: 'DGCA RPC holder',
    fee: '₹18,000',
    desc: 'Specialised flight training for beyond-visual-line-of-sight and low-light operations under strict safety standards.',
    curriculum: [
      'Night flight regulations & clearance protocols',
      'BVLOS mission routing & telemetry setup',
      'Anti-collision strobes & visibility systems',
      'Emergency fail-safe recovery procedures',
      'Special airspace permission workflows',
    ],
    interestVal: 'Night Operations & BVLOS',
  },
  {
    title: 'Drone Assembly & Maintenance',
    badge: 'Hardware',
    badgeType: 'sage',
    duration: '7 days',
    level: 'Intermediate',
    eligibility: 'Basic electronics knowledge',
    fee: '₹12,000',
    desc: 'Hands-on engineering workshop: construct, calibrate, and service industrial multi-rotor platforms from discrete components.',
    curriculum: [
      'Airframe structural geometry & propulsion sizing',
      'Electronic speed controller & flight controller setup',
      'Power distribution & telemetry wiring',
      'Betaflight / ArduPilot tuning & PID calibration',
      'Field diagnostic testing & maintenance',
    ],
    interestVal: 'Drone Assembly & Maintenance',
  },
]

const INTEREST_OPTIONS = [
  '3D Mapping & Survey',
  'DGCA Pilot Course',
  'Industrial Inspection',
  'Night Operations & BVLOS',
  'Drone Assembly & Maintenance',
  'Precision Agriculture',
  'Aerial Cinematography',
  'Other Technical Enquiry',
]

interface FormData {
  name: string
  email: string
  phone: string
  userType: UserType | ''
  interest: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  userType?: string
  interest?: string
  message?: string
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // ── Scroll-Linked Subtle Parallax for Hero ──────────────────────────────
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 45])
  const radarY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 25])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, shouldReduceMotion ? 1 : 0.3])

  // Enquiry Form State
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    userType: '',
    interest: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')

  // Trigger Chatbot Open
  const handleOpenAssistant = () => {
    window.dispatchEvent(new CustomEvent('dronetv:open-chat'))
  }

  // Smooth scroll helper with interest preselection
  const handleEnquireTarget = (interestValue: string) => {
    setForm(prev => ({ ...prev, interest: interestValue }))
    const contactEl = document.getElementById('contact')
    if (contactEl) {
      const targetY = contactEl.getBoundingClientRect().top + window.pageYOffset - 64
      gsap.killTweensOf(window)
      gsap.to(window, {
        duration: 0.65,
        scrollTo: { y: targetY, autoKill: false },
        ease: 'power2.out',
      })
    }
  }

  // ── Form Validation & Submission ─────────────────────────────────────────
  const validate = (): boolean => {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Full name is required'
    if (!form.email.trim()) nextErrors.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address'

    if (!form.phone.trim()) nextErrors.phone = 'Phone number is required'
    else if (!/^[+\d\s\-()]{7,15}$/.test(form.phone.trim())) nextErrors.phone = 'Enter a valid phone number'

    if (!form.userType) nextErrors.userType = 'Please choose whether you are a Student or Business/Customer'
    if (!form.interest) nextErrors.interest = 'Please select a technical interest'
    if (!form.message.trim()) nextErrors.message = 'Please provide details regarding your requirements'
    else if (form.message.trim().length < 10) nextErrors.message = 'Message must be at least 10 characters'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setApiError('')

    try {
      await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        userType: form.userType as UserType,
        interest: form.interest,
        message: form.message.trim(),
      })
      setSubmitted(true)
    } catch {
      setApiError('Unable to connect to the backend server. Please verify your connection or try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Motion UI Animation Variants ─────────────────────────────────────────
  const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  }

  const lineVariants: Variants = {
    hidden: { y: shouldReduceMotion ? 0 : '105%', opacity: shouldReduceMotion ? 0 : 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 240,
        damping: 24,
      },
    },
  }

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const sectionHeaderVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const cardGridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.08,
      },
    },
  }

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 25,
      },
    },
  }

  return (
    <div className="home-wrapper">
      {/* ── 1. HERO SECTION (Motion UI Masked Split-Text + Parallax) ── */}
      <section id="home" className="hero" ref={heroRef}>
        <div className="hero-grid-overlay" aria-hidden="true" />
        <div className="container hero-inner">
          <motion.div 
            className="hero-content"
            style={{ y: heroContentY, opacity: heroOpacity }}
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Editorial Masked Split-Text Reveal */}
            <h1 className="hero-title" aria-label="See the ground before you fly.">
              <span className="hero-title-line-mask">
                <motion.span className="hero-title-line" variants={lineVariants}>
                  See the ground
                </motion.span>
              </span>
              <span className="hero-title-line-mask">
                <motion.span className="hero-title-line" variants={lineVariants}>
                  before you fly.
                </motion.span>
              </span>
            </h1>

            {/* Subheadline */}
            <motion.p className="hero-desc" variants={fadeUpVariants}>
              AI-guided support for DroneTV's training programs and aerial survey services.
            </motion.p>

            {/* Single Primary CTA */}
            <motion.div className="hero-actions" variants={fadeUpVariants}>
              <motion.button 
                className="btn-primary hero-assistant-btn" 
                onClick={handleOpenAssistant}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                aria-label="Ask the assistant"
              >
                <span>Ask the assistant</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Technical Radar Visual with Subtle Parallax */}
          <motion.div 
            className="hero-visual" 
            aria-hidden="true"
            style={{ y: radarY, opacity: heroOpacity }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 24,
              delay: 0.35,
            }}
          >
            <Radar />
          </motion.div>
        </div>
      </section>

      {/* ── 2. SERVICES SECTION (Motion Staggered Viewport Entrance) ── */}
      <section id="services" className="services-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionHeaderVariants}
          >
            <span className="badge badge-accent">Capabilities</span>
            <h2 className="section-title" style={{ marginTop: '0.85rem' }}>Our Core Services</h2>
            <p className="section-subtitle">
              Precision commercial flight operations, LiDAR photogrammetry, and industrial inspection reports.
            </p>
          </motion.div>

          <motion.div 
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardGridVariants}
          >
            {SERVICES.map(s => (
              <motion.div 
                key={s.title} 
                className="service-panel"
                variants={cardItemVariants}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
              >
                <div className="service-header-row">
                  <div className="service-icon-box">{s.icon}</div>
                  <span className="service-code">{s.code}</span>
                </div>

                <h3>{s.title}</h3>
                <p>{s.desc}</p>

                <div className="service-features-list">
                  {s.features.map((feat, i) => (
                    <span key={i} className="service-feature-item">{feat}</span>
                  ))}
                </div>

                <div className="service-panel-action">
                  <button 
                    className="btn-secondary service-panel-btn" 
                    onClick={() => handleEnquireTarget(s.interestVal)}
                  >
                    Enquire About Service →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3. COURSES SECTION (Motion Progressive Stagger) ── */}
      <section id="courses" className="courses-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionHeaderVariants}
          >
            <span className="badge badge-sage">DGCA Training</span>
            <h2 className="section-title" style={{ marginTop: '0.85rem' }}>Certified Pilot Courses</h2>
            <p className="section-subtitle">
              Structured flight curriculum conducted by certified flight instructors at our Mumbai training facility.
            </p>
          </motion.div>

          <motion.div 
            className="courses-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardGridVariants}
          >
            {COURSES.map(c => (
              <motion.div 
                key={c.title} 
                className="course-panel"
                variants={cardItemVariants}
                whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
              >
                <div className="course-header-row">
                  <span className={`badge ${c.badgeType === 'accent' ? 'course-badge-accent' : 'course-badge-sage'}`}>
                    {c.badge}
                  </span>
                  <span className="course-fee">{c.fee}</span>
                </div>

                <h3>{c.title}</h3>

                <div className="course-meta-tags">
                  <span>⏱ {c.duration}</span>
                  <span>📊 {c.level}</span>
                  <span>🎓 {c.eligibility}</span>
                </div>

                <p>{c.desc}</p>

                <div className="course-curriculum">
                  <p className="course-curriculum-title">Key Curriculum Modules</p>
                  <ul className="course-curriculum-items">
                    {c.curriculum.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="course-panel-action">
                  <button 
                    className="btn-secondary course-panel-btn" 
                    onClick={() => handleEnquireTarget(c.interestVal)}
                  >
                    Enroll in Course →
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 4. CONTACT & ENQUIRY SECTION (Motion Entrance & Form) ── */}
      <section id="contact" className="contact-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={sectionHeaderVariants}
          >
            <span className="badge badge-accent">Direct Contact</span>
            <h2 className="section-title" style={{ marginTop: '0.85rem' }}>Initiate an Enquiry</h2>
            <p className="section-subtitle">
              Speak directly with our flight planning team or register for certified pilot training.
            </p>
          </motion.div>

          <div className="contact-layout">
            {/* Technical Coordinates Panel */}
            <motion.div 
              className="contact-info-panel"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="contact-info-header">
                <h3>Aviation Operations Desk</h3>
                <p>
                  Our technical team is on standby to provide feasibility assessments, airspace clearances, and custom training schedules.
                </p>
              </div>

              <div className="contact-detail-items">
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">📍</div>
                  <div className="contact-detail-text">
                    <strong>Facility Location</strong>
                    <span>Mumbai, Maharashtra, India</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">✉️</div>
                  <div className="contact-detail-text">
                    <strong>Direct Email</strong>
                    <span>hello@dronetv.in</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">📞</div>
                  <div className="contact-detail-text">
                    <strong>Phone Support</strong>
                    <span>+91 98765 43210</span>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon">🕒</div>
                  <div className="contact-detail-text">
                    <strong>Operating Hours</strong>
                    <span>Mon – Sat, 9:00 AM – 6:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="contact-detail-badge">
                <span>✓</span> Responses delivered within 24 business hours
              </div>
            </motion.div>

            {/* Live Enquiry Form Card */}
            <motion.div 
              className="enquiry-form-card"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {submitted ? (
                <motion.div 
                  className="enquiry-success-alert"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <div className="enquiry-success-icon">✓</div>
                  <h4>Enquiry Registered Successfully</h4>
                  <p>
                    Thank you, <strong>{form.name}</strong>. Your enquiry regarding <strong>{form.interest}</strong> has been logged. Our technical aviation coordinator will contact you at <strong>{form.email}</strong> shortly.
                  </p>
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      setSubmitted(false)
                      setForm({ name: '', email: '', phone: '', userType: '', interest: '', message: '' })
                    }}
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="enquiry-form-title">Flight & Training Enquiry</h3>
                  <p className="enquiry-form-desc">Complete the parameters below to route your request to the appropriate division.</p>

                  <div className="form-grid-2">
                    {/* Name */}
                    <div className="form-group">
                      <label htmlFor="form-name">Full Name <span>*</span></label>
                      <input
                        id="form-name"
                        type="text"
                        className={`form-input ${errors.name ? 'has-error' : ''}`}
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label htmlFor="form-email">Email Address <span>*</span></label>
                      <input
                        id="form-email"
                        type="email"
                        className={`form-input ${errors.email ? 'has-error' : ''}`}
                        placeholder="e.g. rahul@example.com"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="form-phone">Phone Number <span>*</span></label>
                      <input
                        id="form-phone"
                        type="tel"
                        className={`form-input ${errors.phone ? 'has-error' : ''}`}
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      />
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>

                    {/* User Type */}
                    <div className="form-group">
                      <label htmlFor="form-usertype">Profile Classification <span>*</span></label>
                      <select
                        id="form-usertype"
                        className={`form-select ${errors.userType ? 'has-error' : ''}`}
                        value={form.userType}
                        onChange={e => setForm(p => ({ ...p, userType: e.target.value as UserType }))}
                      >
                        <option value="">Select profile...</option>
                        <option value="STUDENT">Student / Pilot Candidate</option>
                        <option value="CUSTOMER">Business / Enterprise Client</option>
                        <option value="OTHER">Government / Research / Other</option>
                      </select>
                      {errors.userType && <span className="field-error">{errors.userType}</span>}
                    </div>
                  </div>

                  {/* Technical Interest */}
                  <div className="form-group">
                    <label htmlFor="form-interest">Area of Interest <span>*</span></label>
                    <select
                      id="form-interest"
                      className={`form-select ${errors.interest ? 'has-error' : ''}`}
                      value={form.interest}
                      onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                    >
                      <option value="">Select service or course...</option>
                      {INTEREST_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.interest && <span className="field-error">{errors.interest}</span>}
                  </div>

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="form-message">Mission or Training Scope <span>*</span></label>
                    <textarea
                      id="form-message"
                      rows={3}
                      className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                      placeholder="Describe your survey location, training goals, or timeline..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    />
                    {errors.message && <span className="field-error">{errors.message}</span>}
                  </div>

                  {apiError && <p className="field-error" style={{ marginBottom: '1rem' }}>{apiError}</p>}

                  <motion.button 
                    type="submit" 
                    className="btn-primary form-submit-btn" 
                    disabled={submitting}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {submitting ? 'Submitting Enquiry...' : 'Submit Mission Enquiry →'}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
