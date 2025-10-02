import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import DailyGame from './pages/DailyGame'
import PartyGame from './pages/PartyGame'
import About from './pages/About'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/daily/:slug" element={<DailyGame />} />
          <Route path="/party/:slug" element={<PartyGame />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
