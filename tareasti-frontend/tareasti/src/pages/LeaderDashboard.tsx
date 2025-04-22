import { useState } from "react"
import { Bell, Filter, LogOut, Plus, Search } from 'lucide-react'
import "../styles/LeaderDashboard.css"
import { useNavigate } from "react-router-dom"

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
            <button className="notification-button">
              <Bell className="icon" />
              <span>Notifications</span>
            </button>
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
                  <div className="header-buttons">
                    <button className="action-button">
                      <Filter className="icon" />
                      Filter
                    </button>
                    <button className="action-button">
                      <Plus className="icon" />
                      Add Member
                    </button>
                  </div>
                </div>
                <p className="section-description">Manage your team members and their workload</p>

                <div className="search-container">
                  <input type="text" className="search-input" placeholder="Search team members..." />
                  <Search className="search-icon" />
                </div>

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
                  <div className="header-buttons">
                    <button className="action-button">
                      <Filter className="icon" />
                      Filter
                    </button>
                    <button className="action-button">
                      <Plus className="icon" />
                      Add Task
                    </button>
                  </div>
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

          <div className="sidebar">
            <div className="sidebar-card">
              <h2 className="card-title">Task Assignment</h2>
              <p className="card-description">Run the automatic task assignment agent</p>
              <div className="rules-container">
                <h3 className="rules-title">Assignment Rules</h3>
                <ul className="rules-list">
                  <li className="rule-item">Assign tasks only to available team members</li>
                  <li className="rule-item">Prioritize senior members for critical tasks</li>
                  <li className="rule-item">Limit to maximum 4 tasks per team member</li>
                </ul>
              </div>
              <button className="run-button" disabled>
                Run Automatic Assignment
              </button>
            </div>

            <div className="sidebar-card">
              <h2 className="card-title">System Overview</h2>
              <div className="overview-section">
                <h3 className="overview-title">Team Composition</h3>
                <div className="stats-grid">
                  <div className="stat-card programmer">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Programmers</div>
                  </div>
                  <div className="stat-card designer">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Designers</div>
                  </div>
                  <div className="stat-card tester">
                    <div className="stat-value">0</div>
                    <div className="stat-label">Testers</div>
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