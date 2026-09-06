import { useState, useRef, useEffect } from 'react'
import { submitEnquiry } from '../../utils/api'
import type { UserType } from '../../types'
import './Chatbot.css'

// ── Rule-based response engine ─────────────────────────────────────────────
const RESPONSES: { keywords: string[]; reply: string; chips?: string[] }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening'],
    reply: 'Hello! 👋 Welcome to DroneTV. I\'m your AI assistant. How can I help you today?',
    chips: ['Tell me about your services', 'What courses do you offer?', 'I want to get a quote'],
  },
  {
    keywords: ['services', 'what do you do', 'offer', 'provide'],
    reply: '🚁 DroneTV offers:\n• Aerial Cinematography (4K/6K)\n• Industrial Inspection\n• Precision Agriculture & NDVI Mapping\n• 3D Mapping & LiDAR Surveys\n• Construction Monitoring\n• Security & Surveillance\n\nWould you like details on any specific service?',
    chips: ['Aerial Cinematography', 'Industrial Inspection', 'Precision Agriculture', 'Get a quote'],
  },
  {
    keywords: ['course', 'training', 'pilot', 'learn', 'dgca', 'certification', 'certificate'],
    reply: '🎓 Our training programmes:\n• DGCA Certified Remote Pilot (30 days)\n• Night Operations & BVLOS (5 days)\n• Drone Assembly & Maintenance (7 days)\n• Aerial Photography & Videography (10 days)\n• GIS & Mapping with Drones (14 days)\n\nAll courses are conducted at our Mumbai facility.',
    chips: ['DGCA course details', 'Course fees', 'How to enrol?'],
  },
  {
    keywords: ['dgca', 'certified', 'remote pilot', 'rpc'],
    reply: '✅ Our DGCA Remote Pilot Course is 30 days, fee ₹45,000. It covers air law, navigation, meteorology, simulator + field flying, and exam preparation. Eligibility: 10th Pass, Age 18+.',
    chips: ['How to enrol?', 'What other courses exist?', 'Contact team'],
  },
  {
    keywords: ['fee', 'cost', 'price', 'how much', 'charges', 'rate'],
    reply: '💰 Course Fees:\n• DGCA Pilot Course — ₹45,000\n• Night Ops & BVLOS — ₹18,000\n• Drone Assembly — ₹12,000\n• Aerial Photography — ₹20,000\n• GIS & Mapping — ₹28,000\n\nFor service pricing, it depends on project scope. Submit an enquiry for a custom quote!',
    chips: ['Get a custom quote', 'Submit enquiry'],
  },
  {
    keywords: ['aerial', 'cinema', 'film', 'video', 'photography', 'footage'],
    reply: '🎬 Our Aerial Cinematography service delivers stunning 4K/6K RAW footage with gimbal-stabilised cameras. We cover films, commercials, real-estate, events and live streaming. Same-day rushes available.',
    chips: ['Get a quote', 'Submit enquiry', 'Other services'],
  },
  {
    keywords: ['inspection', 'industrial', 'tower', 'pipeline', 'bridge', 'wind turbine'],
    reply: '🔍 Industrial Inspection — We use thermal imaging and zoom cameras to safely inspect towers, wind turbines, pipelines, and bridges. You get detailed georeferenced PDF reports without risky rope-access.',
    chips: ['Get a quote', 'Other services'],
  },
  {
    keywords: ['agriculture', 'farm', 'ndvi', 'crop', 'spraying', 'irrigation'],
    reply: '🌾 Precision Agriculture — NDVI multispectral mapping identifies crop stress, water issues, and pest zones early. We also support variable-rate spraying and yield prediction.',
    chips: ['Get a quote', 'Other services'],
  },
  {
    keywords: ['mapping', 'survey', 'lidar', 'photogrammetry', '3d', 'dem', 'gis'],
    reply: '🗺️ 3D Mapping & Survey — We produce centimetre-accurate orthomosaics, DEMs, and point clouds using photogrammetry and LiDAR. Outputs include CAD, GIS, and Pix4D formats.',
    chips: ['Get a quote', 'Other services'],
  },
  {
    keywords: ['location', 'where', 'based', 'mumbai', 'address', 'office'],
    reply: '📍 DroneTV is based in **Mumbai, Maharashtra, India**. We operate across the country for large projects. Contact us for site-specific assessments.',
    chips: ['Contact team', 'Submit enquiry'],
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone', 'call', 'speak', 'talk'],
    reply: '📞 You can reach us at:\n• Email: hello@dronetv.in\n• Phone: +91 98765 43210\n• Hours: Mon–Sat, 9 AM – 6 PM IST\n\nOr submit an enquiry form and we\'ll get back within 24 hours!',
    chips: ['Submit enquiry', 'Get a quote'],
  },
  {
    keywords: ['quote', 'enquiry', 'enrol', 'book', 'hire', 'enquire', 'submit'],
    reply: 'Great! I can capture your details right here. Just fill in the quick form below and our team will get back to you within 24 hours! 👇',
    chips: [],
    // This triggers the in-chat lead form
  },
]

const FALLBACK_REPLY = "I'm not sure about that, but our team definitely can help! Would you like to submit an enquiry or speak to someone directly?"
const FALLBACK_CHIPS = ['Tell me about services', 'Course information', 'Contact team', 'Submit enquiry']

function getResponse(input: string): { reply: string; chips: string[]; showForm?: boolean } {
  const lower = input.toLowerCase()
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) {
      const showForm = ['quote', 'enquiry', 'enrol', 'book', 'hire', 'enquire', 'submit'].some(k => lower.includes(k))
      return { reply: r.reply, chips: r.chips || FALLBACK_CHIPS, showForm }
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
    text: 'Hi there! 👋 I\'m DroneTV\'s AI assistant. I can help you with our services, training courses, pricing, or connect you with our team. What would you like to know?',
  },
]

const INITIAL_CHIPS = ['Tell me about your services', 'What courses do you offer?', 'I want to get a quote', 'Contact the team']

// ── Component ──────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem('dronetv-chat')
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES
    } catch { return INITIAL_MESSAGES }
  })
  const [chips, setChips] = useState<string[]>(INITIAL_CHIPS)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Persist history
  useEffect(() => {
    sessionStorage.setItem('dronetv-chat', JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Unread badge
  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread(prev => prev + 1)
    }
  }, [messages.length]) // eslint-disable-line react-hooks/exhaustive-deps

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
    }, 900 + Math.random() * 600)
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
    sessionStorage.removeItem('dronetv-chat')
  }

  const handleOpen = () => {
    setOpen(true)
    setUnread(0)
  }

  return (
    <div className="chatbot-widget">
      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div className="chatbot-header-info">
              <strong>DroneTV Assistant</strong>
              <span>Online</span>
            </div>
            <div className="chatbot-header-actions">
              <button className="chatbot-action-btn" onClick={handleClear} title="Clear conversation">🗑</button>
              <button className="chatbot-action-btn" onClick={() => setOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`msg ${msg.role}`}>
                {msg.role === 'bot' && <div className="msg-avatar">🚁</div>}
                <div className="msg-bubble">
                  {msg.text?.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < (msg.text?.split('\n').length ?? 1) - 1 ? <br /> : null}</span>
                  ))}
                  {msg.showForm && !msg.formSubmitted && (
                    <LeadCaptureForm onSubmit={(name) => {
                      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, formSubmitted: true } : m))
                      addBotResponse(`🎉 Thank you ${name}! Your enquiry has been submitted. Our team will reach out within 24 hours. Is there anything else I can help you with?`)
                      setChips(INITIAL_CHIPS)
                    }} />
                  )}
                  {msg.showForm && msg.formSubmitted && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--sage)', marginTop: '0.5rem' }}>✅ Enquiry submitted!</p>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg bot">
                <div className="msg-avatar">🚁</div>
                <div className="typing-indicator">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Reply Chips */}
          {chips.length > 0 && !typing && (
            <div className="quick-replies">
              {chips.map(chip => (
                <button key={chip} className="quick-reply-chip" onClick={() => handleSend(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              className="chatbot-input"
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              id="chatbot-text-input"
            />
            <button className="chatbot-send" onClick={() => handleSend()} disabled={!input.trim()} aria-label="Send message">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button className="chatbot-toggle" onClick={open ? () => setOpen(false) : handleOpen} aria-label="Toggle chat">
        {open ? '✕' : '💬'}
        {!open && unread > 0 && <span className="chatbot-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>
    </div>
  )
}

// ── In-Chat Lead Capture Form ──────────────────────────────────────────────
function LeadCaptureForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', userType: '' as UserType | '', interest: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.userType) {
      setError('Please fill in name, email, and type.')
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
        interest: form.interest || 'General Enquiry',
        message: `Enquiry submitted via chatbot by ${form.name}`,
      })
      onSubmit(form.name)
    } catch {
      setError('Submission failed. Please try the Contact page.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="chat-lead-form" onSubmit={handleSubmit}>
      <p className="chat-lead-form-title">📋 Quick Enquiry Form</p>
      <input className="chat-lead-input" placeholder="Your name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
      <input className="chat-lead-input" placeholder="Email *" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
      <input className="chat-lead-input" placeholder="Phone (optional)" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
      <select className="chat-lead-select" value={form.userType} onChange={e => setForm(p => ({ ...p, userType: e.target.value as UserType }))}>
        <option value="">I am a... *</option>
        <option value="STUDENT">Student</option>
        <option value="CUSTOMER">Customer / Business</option>
        <option value="OTHER">Other</option>
      </select>
      <input className="chat-lead-input" placeholder="Interest (optional)" value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))} />
      {error && <p style={{ fontSize: '0.75rem', color: '#f87171' }}>{error}</p>}
      <button type="submit" className="chat-lead-submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Enquiry →'}
      </button>
    </form>
  )
}
