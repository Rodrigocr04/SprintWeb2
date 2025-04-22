import { useState } from "react"
import { LogOut } from 'lucide-react'
import "../styles/LeaderDashboard.css"
import { useNavigate } from "react-router-dom"
import AddTask from "./AddTask"  // Asegúrate de que la ruta sea correcta

export default function LeaderDashboard() {
  const [activeTab, setActiveTab] = useState("team")
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
            <div className="user-profile">
              <div className="avatar">
                <span className="avatar-fallback">TL</span>
              </div>
              <div className="user-info">
                <p className="user-name">Team Leader</p>
                <p className="user-role">Administrator</p>
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
                  className={`tab-button ${activeTab === "team" ? "active" : ""}`}
                  onClick={() => setActiveTab("team")}
                >
                  Team Members
                </button>
                <button
                  className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
                  onClick={() => setActiveTab("tasks")}
                >
                  Pending Tasks
                </button>
              </div>

              <div className={`tab-content ${activeTab === "team" ? "active" : ""}`}>
                <div className="content-header">
                  <h2 className="section-title">Team Members</h2>
                </div>
                <p className="section-description">Manage your team members and their workload</p>

                <div className="members-list">
                  {/* Team members will be rendered here */}
                  <div className="empty-state">
                    <p>No team members added yet</p>
                  </div>
                </div>
              </div>

              <div className={`tab-content ${activeTab === "tasks" ? "active" : ""}`}>
                <div className="content-header">
                  <h2 className="section-title">Pending Tasks</h2>
                  <AddTask />  {/* Aquí agregamos el componente AddTask */}
                </div>
                <p className="section-description">Tasks waiting to be assigned to team members</p>

                <div className="tasks-list">
                  {/* Tasks will be rendered here */}
                  <div className="empty-state">
                    <p>No pending tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}