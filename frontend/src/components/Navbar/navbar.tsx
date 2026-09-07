import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import './navbar.css'

gsap.registerPlugin(ScrollToPlugin)

interface NavItem {
  id: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'courses', label: 'Courses' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()

  const isAutoScrolling = useRef(false)
  const rafId = useRef<number | null>(null)

  // Track active section and scroll state with RAF throttling
  const handleScroll = useCallback(() => {
    if (rafId.current !== null) return

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 20)

      if (isAutoScrolling.current || location.pathname !== '/') return

      const navOffset = 64
      const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const top = section.offsetTop - navOffset
        if (scrollY >= top) {
          setActiveSection(section.id)
          break
        }
      }
    })
  }, [location.pathname])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll])

  // Smooth Section Scrolling
  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false)

    if (location.pathname !== '/') {
      navigate('/#' + sectionId)
      return
    }

    const element = document.getElementById(sectionId)
    if (!element) return

    const navOffset = 64
    const targetY = element.getBoundingClientRect().top + window.pageYOffset - navOffset

    // Cancel any ongoing tweens
    gsap.killTweensOf(window)

    // Update active section immediately for instantaneous visual response
    setActiveSection(sectionId)
    isAutoScrolling.current = true

    // GSAP Butter-Smooth Glide
    gsap.to(window, {
      duration: 0.65,
      scrollTo: { y: targetY, autoKill: false },
      ease: 'power2.out',
      onComplete: () => {
        isAutoScrolling.current = false
      },
    })
  }

  return (
    <header className={`navbar ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => scrollToSection('home')}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">Drone<span className="logo-accent">TV</span></span>
        </Link>

        {/* Desktop Navigation with Motion Shared Layout Active Indicator */}
        <nav className="navbar-links" aria-label="Main navigation">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id && location.pathname === '/'
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                <span className="nav-item-text">{item.label}</span>
                {isActive && (
                  <motion.span
                    className="nav-active-pill"
                    layoutId="navbarActiveIndicator"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Header Action */}
        <div className="navbar-action">
          <button className="btn-primary navbar-cta" onClick={() => scrollToSection('contact')}>
            Get a Quote
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Slide-down Menu */}
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id && location.pathname === '/'
            return (
              <button
                key={item.id}
                className={`mobile-nav-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            )
          })}
          <div className="mobile-cta-wrap">
            <button 
              className="btn-primary" 
              style={{ width: '100%' }} 
              onClick={() => scrollToSection('contact')}
            >
              Get a Quote
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
