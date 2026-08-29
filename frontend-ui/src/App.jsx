import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import WorkspacePage from './pages/WorkspacePage'

function App() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => {
        setBackendMessage(data.message)
        console.log('Backend message:', data.message);
      })
      .catch((err) => console.error('Error fetching backend:', err));
  }, []);

  return (
    <Router>
      <Layout>
        {backendMessage && (
          <div className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-green-200 text-green-700 text-xs font-medium px-3 py-2 rounded-lg shadow-lg shadow-green-900/5 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Backend: {backendMessage}
          </div>
        )}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/transcribe" element={<WorkspacePage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
