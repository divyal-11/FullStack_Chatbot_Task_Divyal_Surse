import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

  // Track active section and scroll state
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    setIsScrolled(scrollY > 20)

    if (location.pathname !== '/') return

    const navOffset = 90
    const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      const top = section.offsetTop - navOffset
      if (scrollY >= top) {
        setActiveSection(section.id)
        break
      }
    }
  }, [location.pathname])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
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

    const navOffset = 72
    const targetY = element.getBoundingClientRect().top + window.pageYOffset - navOffset

    // GSAP Butter-Smooth Glide
    gsap.to(window, {
      duration: 0.95,
      scrollTo: { y: targetY, autoKill: false },
      ease: 'power3.inOut',
      onComplete: () => {
        setActiveSection(sectionId)
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

        {/* Desktop Navigation */}
        <nav className="navbar-links" aria-label="Main navigation">
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id && location.pathname === '/'
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
                {isActive && <span className="nav-item-indicator" />}
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
