import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import "../styles/Login.css"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rol: role,
        }),
        mode: "cors",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("user", JSON.stringify(data))

        if (data.rol.toLowerCase() === "lider") {
          navigate("/leader-dashboard")
        } else {
          navigate("/worker-dashboard")
        }
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error during login")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToRegister = () => {
    navigate("/register")
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
            {error && <div className="error-message">{error}</div>}

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
                <option value="programador">Programmer</option>
                <option value="disenador">UI Designer</option>
                <option value="tester">Tester</option>
                <option value="lider">Team Leader</option>
              </select>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="button-icon" /> Login
                </>
              )}
            </button>

            <div className="register-section">
              <p>Don't have an account?</p>
              <button type="button" className="register-button" onClick={navigateToRegister}>
                <UserPlus className="button-icon" /> Register
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer">
          <p className="footer-text">System for IT Task Assignment and Real-time Events</p>
        </div>
      </div>
    </div>
  )
}