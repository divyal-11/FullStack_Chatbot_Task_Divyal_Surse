import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Navbar from './components/Navbar/navbar'
import Footer from './components/Footer/Footer'
import Chatbot from './components/Chatbot/Chatbot'
import Home from './pages/home'
import Services from './pages/services'
import Courses from './pages/courses'
import Contact from './pages/contact'
import Admin from './pages/admin'

gsap.registerPlugin(ScrollToPlugin)

const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.16,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const reducedVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}

function App() {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  // Scroll to top on route change if not navigating to a hash anchor
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [location.pathname])

  // Handle cross-page hash navigation (e.g. from /admin to /#services)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        setTimeout(() => {
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - 64
          gsap.killTweensOf(window)
          gsap.to(window, {
            duration: 0.65,
            scrollTo: { y: targetY, autoKill: false },
            ease: 'power2.out',
          })
        }, 120)
      }
    }
  }, [location])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, position: 'relative', width: '100%', paddingTop: 'var(--nav-height)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={shouldReduceMotion ? reducedVariants : pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: '100%' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
