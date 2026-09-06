import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { submitEnquiry } from '../utils/api'
import type { UserType } from '../types'
import './contact.css'
import './services.css'

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

const INTERESTS = [
  'Aerial Cinematography',
  'Industrial Inspection',
  'Precision Agriculture',
  '3D Mapping & Survey',
  'Construction Monitoring',
  'Security & Surveillance',
  'DGCA Pilot Course',
  'Night Operations & BVLOS',
  'Drone Assembly & Maintenance',
  'Aerial Photography Course',
  'GIS & Mapping Course',
  'Other / General Enquiry',
]

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email'
  if (!data.phone.trim()) errors.phone = 'Phone is required'
  else if (!/^[+\d\s\-()]{7,15}$/.test(data.phone)) errors.phone = 'Enter a valid phone number'
  if (!data.userType) errors.userType = 'Please select a user type'
  if (!data.interest) errors.interest = 'Please select your area of interest'
  if (!data.message.trim()) errors.message = 'Message is required'
  else if (data.message.trim().length < 10) errors.message = 'Message must be at least 10 characters'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', userType: '', interest: '', message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    try {
      await submitEnquiry({ ...form, userType: form.userType as UserType })
      setSubmitted(true)
    } catch {
      setApiError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const shouldReduceMotion = useReducedMotion()

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
          <span className="badge badge-accent">Get In Touch</span>
          <h1>Contact & Enquiry</h1>
          <p>Fill in the form and our team will get back to you within 24 hours.</p>
        </div>
      </motion.section>

      {/* ── CONTACT LAYOUT ── */}
      <section className="contact-page">
        <div className="container">
          <div className="contact-layout">
            {/* Left Info Panel */}
            <motion.div 
              className="contact-info"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <h2>Let's talk about your project</h2>
              <p>
                Whether you need aerial footage for a production, drone data for your farm,
                or want to enrol in one of our certified courses — we're here to help.
              </p>
              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">📍</div>
                  <div className="contact-detail-text">
                    <strong>Location</strong>
                    <span>Mumbai, Maharashtra, India</span>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">📧</div>
                  <div className="contact-detail-text">
                    <strong>Email</strong>
                    <span>hello@dronetv.in</span>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">📞</div>
                  <div className="contact-detail-text">
                    <strong>Phone</strong>
                    <span>+91 98765 43210</span>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">⏰</div>
                  <div className="contact-detail-text">
                    <strong>Hours</strong>
                    <span>Mon–Sat, 9 AM – 6 PM IST</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Form Panel */}
            <motion.div 
              className="contact-form-wrap"
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">✅</div>
                  <h3>Enquiry Submitted!</h3>
                  <p>
                    Thank you, <strong>{form.name}</strong>. We've received your enquiry and
                    will get back to you within 24 hours.
                  </p>
                  <button
                    className="btn-secondary"
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', userType: '', interest: '', message: '' }) }}
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2>Send us an Enquiry</h2>
                  <p>All fields marked with <span style={{ color: 'var(--accent)' }}>*</span> are required.</p>

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Name <span className="required">*</span></label>
                        <input id="name" name="name" type="text" placeholder="Your full name" value={form.name} onChange={handleChange} />
                        {errors.name && <span className="form-error">{errors.name}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email <span className="required">*</span></label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Phone <span className="required">*</span></label>
                        <input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                        {errors.phone && <span className="form-error">{errors.phone}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="userType">I am a <span className="required">*</span></label>
                        <select id="userType" name="userType" value={form.userType} onChange={handleChange}>
                          <option value="">Select type...</option>
                          <option value="STUDENT">Student</option>
                          <option value="CUSTOMER">Customer / Business</option>
                          <option value="OTHER">Other</option>
                        </select>
                        {errors.userType && <span className="form-error">{errors.userType}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="interest">Area of Interest <span className="required">*</span></label>
                      <select id="interest" name="interest" value={form.interest} onChange={handleChange}>
                        <option value="">Select service or course...</option>
                        {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                      {errors.interest && <span className="form-error">{errors.interest}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message <span className="required">*</span></label>
                      <textarea id="message" name="message" placeholder="Tell us about your project or enquiry..." value={form.message} onChange={handleChange} />
                      {errors.message && <span className="form-error">{errors.message}</span>}
                    </div>

                    {apiError && <p className="form-error" style={{ marginBottom: '1rem' }}>{apiError}</p>}

                    <button type="submit" className="btn-primary form-submit" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Enquiry →'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
