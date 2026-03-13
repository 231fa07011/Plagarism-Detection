import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) return <Login onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className={darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}>
      <Router>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analysis/:id" element={<Analysis />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default App
