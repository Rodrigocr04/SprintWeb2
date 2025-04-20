import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import LeaderDashboard from './pages/LeaderDashboard' // You'll need to create these
import WorkerDashboard from './pages/WorkerDashboard' // You'll need to create these

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/leader-dashboard" element={<LeaderDashboard />} />
        <Route path="/member-dashboard" element={<WorkerDashboard />} />
      </Routes>
    </Router>
  )
}

export default App