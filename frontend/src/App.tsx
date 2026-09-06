import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/navbar'
import Footer from './components/Footer/Footer'
import Chatbot from './components/Chatbot/Chatbot'
import Home from './pages/home'
import Services from './pages/services'
import Courses from './pages/courses'
import Contact from './pages/contact'
import Admin from './pages/admin'

function App() {
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
