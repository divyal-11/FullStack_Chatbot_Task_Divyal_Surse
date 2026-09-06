import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { submitEnquiry } from '../../utils/api'
import type { UserType } from '../../types'
import './Chatbot.css'

// ── Rule-Based Response Engine ─────────────────────────────────────────────
const RESPONSES: { keywords: string[]; reply: string; chips?: string[]; showForm?: boolean }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'evening'],
    reply: "Hello! Welcome to DroneTV. I'm your AI flight and training assistant. How can I assist you today?",
    chips: ['Tell me about services', 'What courses do you offer?', 'I am interested in a service', 'Speak to someone'],
  },
  {
    keywords: ['services', 'what do you do', 'offer', 'solutions', 'capability'],
    reply: "🚁 DroneTV delivers precision aerial solutions across India:\n• Aerial Survey & 3D LiDAR Mapping\n• DGCA Certified Pilot Training\n• Thermal & Industrial Inspection\n• Precision Agriculture & NDVI\n\nWhich service would you like to explore?",
    chips: ['Aerial Survey', 'Thermal Inspection', 'DGCA Training', 'Speak to someone'],
  },
  {
    keywords: ['course', 'training', 'pilot', 'learn', 'dgca', 'certification', 'license', 'rpc'],
    reply: "🎓 DroneTV Training Programmes:\n• DGCA Remote Pilot Course (30 days — ₹45,000)\n• Night Operations & BVLOS (5 days — ₹18,000)\n• Drone Assembly & Maintenance (7 days — ₹12,000)\n\nAll courses are conducted with practical airfield flying at our Mumbai facility.",
    chips: ['Register as student', 'Course fees', 'Eligibility details', 'Register now'],
  },
  {
    keywords: ['student', 'eligibility', 'admission', 'qualify', 'age'],
    reply: "👨‍🎓 Student & Pilot Admissions:\n• Eligibility: Minimum 10th Pass, Age 18+\n• Includes theory ground school, simulator flights, field flying, and DGCA exam preparation.\n\nWould you like to register or speak with an admissions counsellor?",
    chips: ['Register as student', 'Course fees', 'Speak to someone'],
  },
  {
    keywords: ['register', 'enrol', 'enroll', 'admission', 'apply', 'join'],
    reply: "You can register for any DGCA pilot course or technical training right here! Please provide your details below and our training coordinator will confirm your batch schedule. 👇",
    showForm: true,
    chips: [],
  },
  {
    keywords: ['interested in a service', 'interested', 'survey service', 'inspection service', 'quote', 'hire'],
    reply: "Excellent! We provide full-scope aerial survey, LiDAR mapping, and thermal inspections. Fill out the quick mission enquiry card below to receive a custom project estimate! 👇",
    showForm: true,
    chips: [],
  },
  {
    keywords: ['speak to someone', 'call', 'human', 'agent', 'phone', 'representative', 'talk'],
    reply: "📞 You can speak directly with our flight operations desk at +91 98765 43210 (Mon–Sat, 9:00 AM – 6:00 PM IST) or submit your details below for a direct callback! 👇",
    showForm: true,
    chips: [],
  },
  {
    keywords: ['contact', 'reach', 'email', 'address', 'location', 'office', 'mumbai'],
    reply: "📍 DroneTV Operations Desk:\n• Location: Mumbai, Maharashtra, India\n• Email: hello@dronetv.in\n• Phone: +91 98765 43210\n• Hours: Mon–Sat, 9:00 AM – 6:00 PM IST\n\nYou can also submit an enquiry form right here.",
    chips: ['Speak to someone', 'Register as student', 'Explore services'],
  },
  {
    keywords: ['fee', 'cost', 'price', 'rate', 'how much', 'pricing'],
    reply: "💰 Certified Programme Fees:\n• DGCA Remote Pilot: ₹45,000 (30 Days)\n• Night Ops & BVLOS: ₹18,000 (5 Days)\n• Drone Assembly: ₹12,000 (7 Days)\n\nFor commercial aerial survey projects, quotes are scoped by area and deliverables.",
    chips: ['Register now', 'Interested in a service', 'Speak to someone'],
  },
  {
    keywords: ['thermal', 'inspection', 'pipeline', 'solar', 'tower'],
    reply: "🔍 Thermal & Industrial Inspection:\nWe use radiometric infrared sensors to safely audit high-voltage transmission towers, wind turbines, and industrial assets without risky scaffolding. Reports include georeferenced thermal orthomosaics.",
    chips: ['Interested in a service', 'Speak to someone'],
  },
  {
    keywords: ['survey', 'mapping', 'lidar', 'photogrammetry', '3d', 'dem'],
    reply: "🗺️ Aerial Survey & 3D Mapping:\nCentimetre-accurate orthomosaics, digital elevation models, and point clouds using aerial LiDAR and photogrammetry. Deliverables include CAD, GIS, and Pix4D formats.",
    chips: ['Interested in a service', 'Speak to someone'],
  },
]

const FALLBACK_REPLY = "I want to make sure you get the exact information you need. Our aviation coordinators can assist you directly with custom surveys or course admissions. Would you like to speak to someone or submit a quick enquiry?"
const FALLBACK_CHIPS = ['Tell me about services', 'What courses do you offer?', 'Interested in a service', 'Speak to someone']

function getResponse(input: string): { reply: string; chips: string[]; showForm?: boolean } {
  const lower = input.toLowerCase().trim()
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) {
      return { reply: r.reply, chips: r.chips || FALLBACK_CHIPS, showForm: r.showForm }
    }
  }
  return { reply: FALLBACK_REPLY, chips: FALLBACK_CHIPS }
}

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: string
  role: 'bot' | 'user'
  text?: string
  showForm?: boolean
  formSubmitted?: boolean
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'bot',
    text: "Welcome to DroneTV. I'm your technical flight & training assistant. How can I help with services, DGCA courses, or project planning today?",
  },
]

const INITIAL_CHIPS = [
  'Tell me about services',
  'What courses do you offer?',
  'Interested in a service',
  'Speak to someone',
]

// ── Component ──────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem('dronetv-chat-history')
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES
    } catch {
      return INITIAL_MESSAGES
    }
  })
  const [chips, setChips] = useState<string[]>(INITIAL_CHIPS)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Listen for custom trigger from Hero CTA
  useEffect(() => {
    const handleCustomOpen = () => setOpen(true)
    window.addEventListener('dronetv:open-chat', handleCustomOpen)
    return () => window.removeEventListener('dronetv:open-chat', handleCustomOpen)
  }, [])

  // Persist session history
  useEffect(() => {
    try {
      sessionStorage.setItem('dronetv-chat-history', JSON.stringify(messages))
    } catch {
      // Ignore sessionStorage quotas
    }
  }, [messages])

  // Scroll to latest message
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, typing, open])

  const addUserMessage = (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    return userMsg
  }

  const addBotResponse = (text: string, showForm?: boolean) => {
    setTyping(true)
    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text, showForm }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
    }, 600 + Math.random() * 400)
  }

  const handleSend = (text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    addUserMessage(msg)
    const { reply, chips: newChips, showForm } = getResponse(msg)
    setChips(newChips)
    addBotResponse(reply, showForm)
  }

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES)
    setChips(INITIAL_CHIPS)
    sessionStorage.removeItem('dronetv-chat-history')
  }

  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="chatbot-widget" aria-label="DroneTV AI Support Assistant">
      {/* Chat Window with Spring Open/Close Motion */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 22, scale: shouldReduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: shouldReduceMotion ? 1 : 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-avatar-wrap">◈</div>
              <div className="chatbot-header-info">
                <strong>DroneTV AI Assistant</strong>
                <div className="chatbot-status-row">
                  <span className="chatbot-status-indicator" />
                  <span>Active Telemetry • Ready</span>
                </div>
              </div>
              <div className="chatbot-header-actions">
                <button className="chatbot-action-btn" onClick={handleClear} title="Clear conversation" aria-label="Reset chat">
                  ↺
                </button>
                <button className="chatbot-action-btn" onClick={() => setOpen(false)} title="Close" aria-label="Close chat">
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  className={`msg ${msg.role}`}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="msg-bubble">
                    {msg.text?.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < (msg.text?.split('\n').length ?? 1) - 1 ? <br /> : null}
                      </span>
                    ))}

                    {/* Embedded Lead Capture Form */}
                    {msg.showForm && !msg.formSubmitted && (
                      <InChatLeadForm onSubmit={(name) => {
                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, formSubmitted: true } : m))
                        addBotResponse(`Thank you, ${name}! Your details have been submitted. Our aviation coordinator will contact you directly within 24 hours.`)
                        setChips(INITIAL_CHIPS)
                      }} />
                    )}

                    {msg.showForm && msg.formSubmitted && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--sage)', marginTop: '0.5rem', fontWeight: 600 }}>
                        ✓ Details submitted successfully
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {typing && (
                  <motion.div
                    className="msg bot"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div className="typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick-Reply Chips */}
            {chips.length > 0 && !typing && (
              <div className="quick-replies">
                {chips.map(chip => (
                  <motion.button
                    key={chip}
                    className="quick-reply-chip"
                    onClick={() => handleSend(chip)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="chatbot-input-area">
              <input
                className="chatbot-input"
                type="text"
                placeholder="Ask about services, DGCA courses, pricing..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                autoComplete="off"
              />
              <motion.button
                className="chatbot-send"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                aria-label="Send query"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ONE Clear Floating Chat Entry Point: "Ask DroneTV AI" */}
      <motion.button
        className={`chatbot-launcher-btn ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(!open)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        aria-label={open ? 'Close Assistant' : 'Ask DroneTV AI'}
      >
        <span className="chatbot-launcher-icon">◈</span>
        <span>{open ? 'Close Assistant' : 'Ask DroneTV AI'}</span>
        {!open && <span className="chatbot-launcher-pulse" />}
      </motion.button>
    </div>
  )
}

// ── In-Chat Lead Form Component ─────────────────────────────────────────────
function InChatLeadForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', userType: '' as UserType | '', interest: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.userType) {
      setError('Please provide name, email, and profile type.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || 'N/A',
        userType: form.userType as UserType,
        interest: form.interest || 'General Technical Enquiry',
        message: `Chatbot enquiry logged by ${form.name}`,
      })
      onSubmit(form.name)
    } catch {
      setError('Submission could not reach backend. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="chat-lead-form" onSubmit={handleSubmit}>
      <p className="chat-lead-title">📋 Direct Enquiry Routing</p>
      <input
        className="chat-lead-input"
        placeholder="Full name *"
        value={form.name}
        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        required
      />
      <input
        className="chat-lead-input"
        placeholder="Email address *"
        type="email"
        value={form.email}
        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        required
      />
      <input
        className="chat-lead-input"
        placeholder="Phone number (optional)"
        type="tel"
        value={form.phone}
        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
      />
      <select
        className="chat-lead-select"
        value={form.userType}
        onChange={e => setForm(p => ({ ...p, userType: e.target.value as UserType }))}
        required
      >
        <option value="">Profile type... *</option>
        <option value="STUDENT">Student / Pilot Candidate</option>
        <option value="CUSTOMER">Business / Commercial Client</option>
        <option value="OTHER">Other Technical Query</option>
      </select>
      <input
        className="chat-lead-input"
        placeholder="Area of interest (optional)"
        value={form.interest}
        onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
      />
      {error && <p style={{ fontSize: '0.75rem', color: '#f87171' }}>{error}</p>}
      <button type="submit" className="chat-lead-submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit to Coordinator →'}
      </button>
    </form>
  )
}
