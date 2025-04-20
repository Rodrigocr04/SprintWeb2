import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Save, ArrowLeft } from "lucide-react"
import "../styles/RegisterPage.css"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [level, setLevel] = useState("")
  const [available, setAvailable] = useState(true)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          email,
          password,
          rol: role,
          nivel: level,
          disponible: available,
        }),
        mode: "cors",
        credentials: "include",
      })

      if (response.ok) {
        // Registration successful, navigate to login
        navigate("/")
      } else {
        const errorData = await response.text()
        setError(errorData || "Registration failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error during registration")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToLogin = () => {
    navigate("/")
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="card-header">
          <h1 className="card-title">Create an Account</h1>
          <p className="card-description">Join the IT Task Management System</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleRegister} className="register-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a password"
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
                <option value="PROGRAMADOR">Programmer</option>
                <option value="DISENADOR">UI Designer</option>
                <option value="TESTER">Tester</option>
                <option value="LIDER">Team Leader</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="level">Experience Level</label>
              <select
                id="level"
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your level
                </option>
                <option value="JUNIOR">Junior</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <input
                id="available"
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <label htmlFor="available">Available for new tasks</label>
            </div>

            <button type="submit" className="register-submit-button" disabled={isLoading}>
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <Save className="button-icon" /> Register
                </>
              )}
            </button>

            <button type="button" className="back-to-login-button" onClick={navigateToLogin}>
              <ArrowLeft className="button-icon" /> Back to Login
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