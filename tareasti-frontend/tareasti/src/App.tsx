import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import LeaderDashboard from './pages/LeaderDashboard' // You'll need to create these
import WorkerDashboard from './pages/WorkerDashboard' // You'll need to create these
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/leader-dashboard" element={<LeaderDashboard />} />
        <Route path="/member-dashboard" element={<WorkerDashboard />} />
        <Route path="/register" element={<RegisterPage/>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App