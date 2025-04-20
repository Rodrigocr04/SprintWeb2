import { useState } from "react"
import { Bell, LogOut } from 'lucide-react'
import "../styles/WorkerDashboard.css"
import { useNavigate } from "react-router-dom"

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("tasks")
  const navigate = useNavigate()

  const handleLogout = () => {
    // Add logout logic here
    navigate("/")
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="header-title">IT Task Management System</h1>
          <div className="header-actions">
            <button className="notification-button">
              <Bell className="icon" />
              <span>Notifications</span>
            </button>
            <div className="user-profile">
              <div className="avatar">
                <span className="avatar-fallback">JD</span>
              </div>
              <div className="user-info">
                <p className="user-name">John Doe</p>
                <p className="user-role">Programmer</p>
              </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut className="icon" />
              <span className="sr-only">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <div className="main-content">
            <div className="tabs">
              <div className="tabs-list">
                <button
                  className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
                  onClick={() => setActiveTab("tasks")}
                >
                  My Tasks
                </button>
                <button
                  className={`tab-button ${activeTab === "events" ? "active" : ""}`}
                  onClick={() => setActiveTab("events")}
                >
                  Events
                </button>
              </div>

              <div className={`tab-content ${activeTab === "tasks" ? "active" : ""}`}>
                <div className="tasks-header">
                  <h2 className="section-title">Assigned Tasks</h2>
                  <span className="badge outline">0 pending</span>
                </div>

                <div className="tasks-list">
                  {/* Task items will be rendered here */}
                  <div className="empty-state">
                    <p>No tasks assigned yet</p>
                  </div>
                </div>
              </div>

              <div className={`tab-content ${activeTab === "events" ? "active" : ""}`}>
                <h2 className="section-title">Upcoming Events</h2>

                <div className="events-list">
                  {/* Event items will be rendered here */}
                  <div className="empty-state">
                    <p>No upcoming events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="profile-card">
              <h2 className="card-title">My Profile</h2>
              <div className="profile-content">
                <div className="profile-avatar">
                  <span className="avatar-fallback">JD</span>
                </div>
                <h3 className="profile-name">John Doe</h3>
                <div className="profile-badges">
                  <span className="role-badge">Programmer</span>
                  <span className="level-badge">Senior</span>
                </div>
              </div>

              <div className="separator"></div>

              <div className="workload-section">
                <h4 className="section-subtitle">Current Workload</h4>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "0%" }}></div>
                </div>
                <p className="workload-text">0 of 4 maximum tasks</p>
              </div>

              <div className="separator"></div>

              <div className="skills-section">
                <h4 className="section-subtitle">Skills</h4>
                <div className="skills-list">
                  <span className="skill-badge">React</span>
                  <span className="skill-badge">TypeScript</span>
                  <span className="skill-badge">Node.js</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}