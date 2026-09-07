import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { submitEnquiry } from '../../utils/api'
import type { UserType } from '../../types'
import './Chatbot.css'

// ── Predefined Questions per Assignment Specification ───────────────────────
export const PREDEFINED_QUESTIONS = [
  'Submit an Enquiry',
  'What services does DroneTV provide?',
  'What courses / training are available?',
  'How can I contact DroneTV?',
  'How can I register?',
  'I am interested in a service.',
  'I am a student.',
  'I want to speak with someone.',
]

// ── Rule-Based Response Engine ─────────────────────────────────────────────
const RESPONSES: { keywords: string[]; reply: string; chips?: string[]; showForm?: boolean }[] = [
  {
    keywords: ['submit an enquiry', 'submit enquiry', 'enquiry', 'inquiry', 'enquire', 'book', 'application', 'fill form'],
    reply: "I'd be glad to assist you with submitting an official enquiry! Please provide your details below and our coordinator will get in touch promptly: 👇",
    showForm: true,
    chips: ['What services does DroneTV provide?', 'What courses / training are available?', 'How can I contact DroneTV?'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'evening'],
    reply: "Hello! Welcome to DroneTV. I'm your AI flight and training assistant. How can I assist you today? You can ask about our DGCA certifications, aerial services, or submit an enquiry directly.",
    chips: PREDEFINED_QUESTIONS,
  },
  {
    keywords: ['services does dronetv provide', 'what services', 'services', 'what do you do', 'offer', 'solutions', 'capability'],
    reply: "🚁 DroneTV delivers precision enterprise aerial solutions across India:\n• Aerial Survey & 3D LiDAR Mapping (CAD/GIS & centimeter-grade photogrammetry)\n• DGCA Certified Pilot Training (RPC Certification & BVLOS)\n• Thermal & Industrial Inspection (Radiometric substation, solar & flare-stack audits)\n• Precision Agriculture (Multispectral NDVI health indexing)\n\nWhich service or course would you like to explore?",
    chips: ['I am interested in a service.', 'What courses / training are available?', 'How can I contact DroneTV?', 'I want to speak with someone.'],
  },
  {
    keywords: ['courses / training are available', 'training are available', 'courses are available', 'course', 'training', 'pilot', 'learn', 'dgca', 'certification', 'license', 'rpc'],
    reply: "🎓 DroneTV Training Programmes (DGCA Authorised):\n• DGCA Remote Pilot Course (30 days — ₹45,000)\n• Night Operations & BVLOS (5 days — ₹18,000)\n• Drone Assembly & Maintenance (7 days — ₹12,000)\n\nAll courses include dual-control simulator flight hours and live airfield sorties at our Mumbai facility.",
    chips: ['How can I register?', 'I am a student.', 'What services does DroneTV provide?', 'I want to speak with someone.'],
  },
  {
    keywords: ['contact dronetv', 'how can i contact', 'contact', 'reach', 'email', 'address', 'location', 'office', 'mumbai'],
    reply: "📍 DroneTV Operations Desk:\n• Location: Mumbai, Maharashtra, India\n• Direct Phone: +91 98765 43210\n• Email: hello@dronetv.in\n• Hours: Mon–Sat, 9:00 AM – 6:00 PM IST\n\nYou can also submit an enquiry directly below and our coordinator will get in touch! 👇",
    showForm: true,
    chips: ['I want to speak with someone.', 'What services does DroneTV provide?', 'How can I register?'],
  },
  {
    keywords: ['how can i register', 'register', 'enrol', 'enroll', 'admission', 'apply', 'join', 'seat'],
    reply: "You can register for any DGCA pilot course or training batch right here! Please submit your details below and our academy coordinator will reserve your seat and confirm your batch schedule. 👇",
    showForm: true,
    chips: ['What courses / training are available?', 'I am a student.', 'I want to speak with someone.'],
  },
  {
    keywords: ['interested in a service', 'interested', 'survey service', 'inspection service', 'quote', 'hire', 'estimate', 'project'],
    reply: "Excellent! We provide full-scope aerial survey, LiDAR mapping, and thermal inspections across India. Fill out your project details below to receive a custom mission quote! 👇",
    showForm: true,
    chips: ['What services does DroneTV provide?', 'I want to speak with someone.', 'How can I contact DroneTV?'],
  },
  {
    keywords: ['i am a student', 'student', 'eligibility', 'qualify', 'age limit', 'admissions'],
    reply: "👨‍🎓 Student & Pilot Admissions:\n• Eligibility: Minimum 10th Pass, Age 18+, Valid Government ID\n• Training: Classroom ground school, regulations, flight simulator, and practical field flying\n• Certification: Official DGCA Remote Pilot Certificate with placement assistance\n\nWould you like to register or speak with an admissions counsellor?",
    chips: ['How can I register?', 'What courses / training are available?', 'I want to speak with someone.'],
  },
  {
    keywords: ['speak with someone', 'speak to someone', 'someone', 'call', 'human', 'agent', 'phone', 'representative', 'talk'],
    reply: "📞 You can connect directly with our flight operations desk at +91 98765 43210 (Mon–Sat, 9:00 AM – 6:00 PM IST), or submit your details below for a direct callback within 24 hours! 👇",
    showForm: true,
    chips: ['How can I register?', 'I am interested in a service.', 'What services does DroneTV provide?'],
  },
  {
    keywords: ['fee', 'cost', 'price', 'rate', 'how much', 'pricing'],
    reply: "💰 Certified Programme Fees:\n• DGCA Remote Pilot: ₹45,000 (30 Days)\n• Night Ops & BVLOS: ₹18,000 (5 Days)\n• Drone Assembly: ₹12,000 (7 Days)\n\nCommercial aerial surveys are scoped per mission area and deliverables.",
    chips: ['How can I register?', 'I am interested in a service.', 'I want to speak with someone.'],
  },
]

const FALLBACK_REPLY = "I want to make sure you get the exact information you need. Our aviation coordinators can assist you directly with custom surveys or course admissions. Would you like to explore any of the options below, or submit an enquiry?"
const FALLBACK_CHIPS = PREDEFINED_QUESTIONS

function getResponse(input: string): { reply: string; chips: string[]; showForm?: boolean } {
  const lower = input.toLowerCase().trim()

  // 1. Explicit enquiry trigger
  if (
    lower.includes('enquiry') ||
    lower.includes('inquiry') ||
    lower.includes('submit an enquiry') ||
    lower.includes('submit enquiry') ||
    lower.includes('fill form')
  ) {
    return { reply: RESPONSES[0].reply, chips: RESPONSES[0].chips || FALLBACK_CHIPS, showForm: true }
  }

  // 2. Exact matching against predefined questions & topics
  if (lower.includes('service') && (lower.includes('dronetv provide') || lower.includes('what services'))) {
    return { reply: RESPONSES[2].reply, chips: RESPONSES[2].chips || FALLBACK_CHIPS, showForm: RESPONSES[2].showForm }
  }
  if (lower.includes('course') || lower.includes('training are available')) {
    return { reply: RESPONSES[3].reply, chips: RESPONSES[3].chips || FALLBACK_CHIPS, showForm: RESPONSES[3].showForm }
  }
  if (lower.includes('contact') && !lower.includes('speak')) {
    return { reply: RESPONSES[4].reply, chips: RESPONSES[4].chips || FALLBACK_CHIPS, showForm: RESPONSES[4].showForm }
  }
  if (lower.includes('register') || lower.includes('enroll') || lower.includes('enrol')) {
    return { reply: RESPONSES[5].reply, chips: RESPONSES[5].chips || FALLBACK_CHIPS, showForm: RESPONSES[5].showForm }
  }
  if (lower.includes('interested in a service') || (lower.includes('interested') && lower.includes('service'))) {
    return { reply: RESPONSES[6].reply, chips: RESPONSES[6].chips || FALLBACK_CHIPS, showForm: RESPONSES[6].showForm }
  }
  if (lower.includes('student') || lower.includes('i am a student')) {
    return { reply: RESPONSES[7].reply, chips: RESPONSES[7].chips || FALLBACK_CHIPS, showForm: RESPONSES[7].showForm }
  }
  if (lower.includes('speak with someone') || lower.includes('speak to someone') || lower.includes('speak') || lower.includes('call')) {
    return { reply: RESPONSES[8].reply, chips: RESPONSES[8].chips || FALLBACK_CHIPS, showForm: RESPONSES[8].showForm }
  }

  // 3. Keyword scan
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) {
      return { reply: r.reply, chips: r.chips || FALLBACK_CHIPS, showForm: r.showForm }
    }
  }

  // 4. Unknown question fallback
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
    text: "Welcome to DroneTV. I'm your AI flight and training assistant. You can ask me questions about our DGCA courses and aerial services, or submit an official enquiry directly here:",
  },
]

const INITIAL_CHIPS = PREDEFINED_QUESTIONS

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

  // Listen for custom trigger from Hero CTA or URL parameter
  useEffect(() => {
    const handleCustomOpen = () => setOpen(true)
    window.addEventListener('dronetv:open-chat', handleCustomOpen)

    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('chat') === 'form' || params.get('open_chat') === 'true') {
        setOpen(true)
        if (params.get('chat') === 'form') {
          setMessages([
            {
              id: 'init-lead-form',
              role: 'bot',
              text: "I'd be glad to assist you with submitting an official enquiry! Please provide your details below and our coordinator will get in touch promptly: 👇",
              showForm: true,
            },
          ])
        }
      }
    } catch {
      // Ignore in SSR
    }

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
                <button 
                  className="chatbot-action-btn" 
                  onClick={handleClear} 
                  title="Reset conversation (Clear history)" 
                  aria-label="Reset chat"
                >
                  ↺
                </button>
                <button 
                  className="chatbot-action-btn" 
                  onClick={() => setOpen(false)} 
                  title="Close" 
                  aria-label="Close chat"
                >
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
                      <InChatLeadForm onSubmit={(name, email, enqId) => {
                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, formSubmitted: true } : m))
                        addBotResponse(`Thank you, ${name}! Your enquiry${enqId ? ` (#${enqId.slice(-6).toUpperCase()})` : ''} has been registered in our database. Our flight operations coordinator will contact you directly at ${email} within 24 hours.`)
                        setChips(INITIAL_CHIPS)
                      }} />
                    )}

                    {msg.showForm && msg.formSubmitted && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--sage)', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>✓</span> Details submitted successfully to database.
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

// ── In-Chat Lead Form Component (Part 3 Specification) ─────────────────────
function InChatLeadForm({ onSubmit }: { onSubmit: (name: string, email: string, enquiryId?: string) => void }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '' as UserType | '',
    interest: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate Name
    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).')
      return
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    // Validate Phone
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/
    if (!phoneRegex.test(form.phone.trim())) {
      setError('Please enter a valid phone number (at least 7 digits).')
      return
    }

    // Validate User Type
    if (!form.userType) {
      setError('Please select your user type (Student / Customer / Other).')
      return
    }

    // Validate Interest
    if (!form.interest.trim() || form.interest.trim().length < 2) {
      setError('Please select or specify your service or course of interest.')
      return
    }

    // Validate Message
    if (!form.message.trim() || form.message.trim().length < 5) {
      setError('Please enter a brief message (at least 5 characters).')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const res = await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        userType: form.userType as UserType,
        interest: form.interest.trim(),
        message: form.message.trim(),
      })
      onSubmit(form.name.trim(), form.email.trim(), res?.data?.id)
    } catch (err: any) {
      const backendError = err?.response?.data?.details
        ? Object.entries(err.response.data.details)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join(' | ')
        : err?.response?.data?.error || 'Failed to submit enquiry. Please check connection and try again.'
      setError(backendError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="chat-lead-form" onSubmit={handleSubmit}>
      <p className="chat-lead-title">📋 Direct Enquiry Routing</p>
      
      {/* 1. Name */}
      <input
        className="chat-lead-input"
        placeholder="Full name *"
        value={form.name}
        onChange={e => {
          setForm(p => ({ ...p, name: e.target.value }))
          if (error) setError('')
        }}
        required
      />

      {/* 2. Email */}
      <input
        className="chat-lead-input"
        placeholder="Email address *"
        type="email"
        value={form.email}
        onChange={e => {
          setForm(p => ({ ...p, email: e.target.value }))
          if (error) setError('')
        }}
        required
      />

      {/* 3. Phone */}
      <input
        className="chat-lead-input"
        placeholder="Phone number *"
        type="tel"
        value={form.phone}
        onChange={e => {
          setForm(p => ({ ...p, phone: e.target.value }))
          if (error) setError('')
        }}
        required
      />

      {/* 4. User Type (Student / Customer / Other) */}
      <select
        className="chat-lead-select"
        value={form.userType}
        onChange={e => {
          setForm(p => ({ ...p, userType: e.target.value as UserType }))
          if (error) setError('')
        }}
        required
      >
        <option value="">User type (Student / Customer / Other) *</option>
        <option value="STUDENT">Student</option>
        <option value="CUSTOMER">Customer</option>
        <option value="OTHER">Other</option>
      </select>

      {/* 5. Service or Course of Interest */}
      <select
        className="chat-lead-select"
        value={form.interest}
        onChange={e => {
          setForm(p => ({ ...p, interest: e.target.value }))
          if (error) setError('')
        }}
        required
      >
        <option value="">Service or course of interest... *</option>
        <option value="DGCA Remote Pilot Certificate (RPC)">DGCA Remote Pilot Certificate (RPC)</option>
        <option value="Night Operations & BVLOS Certification">Night Operations & BVLOS Certification</option>
        <option value="Drone Assembly & Maintenance">Drone Assembly & Maintenance</option>
        <option value="Aerial Survey & 3D LiDAR Mapping">Aerial Survey & 3D LiDAR Mapping</option>
        <option value="Thermal & Industrial Inspection">Thermal & Industrial Inspection</option>
        <option value="Precision Agriculture & Crop Health">Precision Agriculture & Crop Health</option>
        <option value="General Technical Enquiry">General Technical Enquiry</option>
      </select>

      {/* 6. Message */}
      <textarea
        className="chat-lead-textarea"
        placeholder="Message / project details *"
        rows={2}
        value={form.message}
        onChange={e => {
          setForm(p => ({ ...p, message: e.target.value }))
          if (error) setError('')
        }}
        required
      />

      {error && <p className="chat-lead-error">{error}</p>}

      <button type="submit" className="chat-lead-submit" disabled={submitting}>
        {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry →'}
      </button>
    </form>
  )
}

