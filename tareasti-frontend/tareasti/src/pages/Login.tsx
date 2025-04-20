import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, LogIn } from 'lucide-react'
import "../styles/Login.css"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (role === "leader") {
      navigate("/leader-dashboard")
    } else {
      navigate("/member-dashboard")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h1 className="card-title">IT Task Management System</h1>
          <p className="card-description">Enter your credentials to access your dashboard</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  className="form-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select id="role" className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>
                  Select your role
                </option>
                <option value="programmer">Programmer</option>
                <option value="designer">UI Designer</option>
                <option value="tester">Tester</option>
                <option value="leader">Team Leader</option>
              </select>
            </div>
            <button type="submit" className="login-button">
              <LogIn className="button-icon" /> Login
            </button>
          </form>
        </div>
        <div className="card-footer">
          <p className="footer-text">System for IT Task Assignment and Real-time Events</p>
        </div>
      </div>
    </div>
  )
}