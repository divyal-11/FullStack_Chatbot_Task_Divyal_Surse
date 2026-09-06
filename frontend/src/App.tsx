import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

function App() {
  const location = useLocation()

  // Handle cross-page hash navigation (e.g. from /admin to /#services)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const el = document.getElementById(targetId)
      if (el) {
        setTimeout(() => {
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - 72
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
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
