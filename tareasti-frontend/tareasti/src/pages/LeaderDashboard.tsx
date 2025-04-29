import { useState, useEffect } from "react"
import { LogOut, Users, ListChecks, List, Play } from 'lucide-react'
import "../styles/LeaderDashboard.css"
import { useNavigate } from "react-router-dom"
import AddTask from "./AddTask"
import Task, { TaskProps, TaskStatus, TaskPriority } from "./Task" // Import Task component and types
import Notification from "../components/Notification"; // Import the Notification component

// Define interfaces for data types
interface Worker {
  id: number;
  nombre: string;
  rol: string;
  nivel: string;
  disponible: boolean;
  // Add other relevant fields if needed
}

// Backend Task interface (adjust based on actual API response if needed)
interface ApiTask {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string; // PENDIENTE, EN_PROGRESO, COMPLETADA
  prioridad: string; // ALTA, MEDIA, BAJA
  rolRequerido: string;
  asignadoA: Worker | null; 
}

export default function LeaderDashboard() {
  const [activeTab, setActiveTab] = useState("allTasks") // Default to showing all tasks
  const [workers, setWorkers] = useState<Worker[]>([])
  const [pendingTasks, setPendingTasks] = useState<ApiTask[]>([])
  const [allTasks, setAllTasks] = useState<ApiTask[]>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({
    workers: true,
    pendingTasks: true,
    allTasks: true,
  })
  const [error, setError] = useState<Record<string, string | null>>({
    workers: null,
    pendingTasks: null,
    allTasks: null,
  })
  const navigate = useNavigate()
  // Add state for notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = async (endpoint: string, setData: Function, key: string) => {
    setLoading(prev => ({ ...prev, [key]: true }))
    setError(prev => ({ ...prev, [key]: null }))
    try {
      const response = await fetch(`http://localhost:8080/api/leader/${endpoint}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setData(data)
    } catch (err: any) {
      setError(prev => ({ ...prev, [key]: err.message || `Failed to fetch ${key}` }))
      console.error(`Error fetching ${key}:`, err)
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData("workers", setWorkers, "workers")
    fetchData("tasks/pending", setPendingTasks, "pendingTasks")
    fetchData("tasks/all", setAllTasks, "allTasks")
  }, [])

  // Function to refresh all data
  const refreshAllData = () => {
      fetchData("workers", setWorkers, "workers")
      fetchData("tasks/pending", setPendingTasks, "pendingTasks")
      fetchData("tasks/all", setAllTasks, "allTasks")
  }

  // Handler for automatic assignment
  const handleAssignAutomatically = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/leader/tasks/assign-automatic', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      // Set success notification
      setNotification({ message: 'Automatic task assignment initiated successfully!', type: 'success' });
      // Refresh data after assignment
      refreshAllData()
    } catch (err: any) {
      // Set error notification
      setNotification({ message: `Error initiating assignment: ${err.message}`, type: 'error' });
      console.error('Error assigning tasks automatically:', err)
    }
  }

  const handleLogout = () => {
    // Clear user data from local storage or context
    localStorage.removeItem("user"); // Example if user data is in local storage
    navigate("/")
  }

  // Handler for completing a task
  const handleCompleteTask = async (taskId: string) => {
    const taskIdNum = parseInt(taskId, 10); // Endpoint expects number
    if (isNaN(taskIdNum)) {
      console.error("Invalid task ID", taskId);
      alert("Invalid task ID.");
      return;
    }

    try {
       // Use the WORKER endpoint, as it handles completion generically
      const response = await fetch(`http://localhost:8080/api/worker/tasks/${taskIdNum}/complete`, {
        method: 'PUT',
      });

      if (!response.ok) {
        // Try to get error message from response body
        const errorBody = await response.text(); 
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody || 'Could not complete task'}`);
      }

      // Set success notification
      setNotification({ message: 'Task marked as complete successfully!', type: 'success' });
      // Refresh data after completion
      refreshAllData(); 
    } catch (err: any) {
       // Set error notification
      setNotification({ message: `Error completing task: ${err.message}`, type: 'error' });
      console.error('Error completing task:', err);
    }
  };

  const renderLoadingOrError = (key: string) => {
    if (loading[key]) return <p>Loading...</p>
    if (error[key]) return <p>Error: {error[key]}</p>
    return null
  }

  const renderEmptyState = (message: string) => (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  )

  // Helper functions to map backend values to frontend Task component props
  const mapPriority = (prioridad: string): TaskPriority => {
    switch (prioridad?.toUpperCase()) { // Add safety check for null/undefined
      case "ALTA": return "high";
      case "MEDIA": return "medium";
      case "BAJA": return "low";
      default: return "low"; // Default to low if unknown
    }
  };

  const mapStatus = (estado: string): TaskStatus => {
    switch (estado?.toUpperCase()) { // Add safety check for null/undefined
      case "EN_PROGRESO": return "in-progress"; // Match backend Enum name if needed
      case "COMPLETADA": return "completed";
      case "PENDIENTE":
      default: return "pending";
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="header-title">IT Task Management System - Leader</h1>
          <div className="header-actions">
            <div className="user-profile">
              <div className="avatar">
                <span className="avatar-fallback">TL</span>
              </div>
              <div className="user-info">
                <p className="user-name">Team Leader</p> { /* Can fetch name later */}
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
                  className={`tab-button ${activeTab === "allTasks" ? "active" : ""}`}
                  onClick={() => setActiveTab("allTasks")}
                >
                  <List className="icon" /> All Tasks
                </button>
                <button
                  className={`tab-button ${activeTab === "pendingTasks" ? "active" : ""}`}
                  onClick={() => setActiveTab("pendingTasks")}
                >
                  <ListChecks className="icon" /> Pending Tasks
                </button>
                <button
                  className={`tab-button ${activeTab === "team" ? "active" : ""}`}
                  onClick={() => setActiveTab("team")}
                >
                  <Users className="icon" /> Team Members
                </button>
              </div>

               {/* All Tasks Tab - Updated rendering */}
              <div className={`tab-content ${activeTab === "allTasks" ? "active" : ""}`}>
                <div className="content-header">
                  <h2 className="section-title">All Tasks</h2>
                   <div className="header-button-group">
                    <AddTask onTaskAdded={refreshAllData} />
                    <button className="assign-button" onClick={handleAssignAutomatically}>
                       <Play className="icon" /> Assign Automatically
                    </button>
                   </div>
                </div>
                <p className="section-description">Overview of all tasks in the system</p>
                 {renderLoadingOrError("allTasks")}
                {!loading.allTasks && !error.allTasks && (
                    <div className="tasks-list"> {/* Use the same class as WorkerDashboard for consistency */} 
                    {allTasks.length === 0 ? renderEmptyState("No tasks found.") : (
                        allTasks.map(task => {
                            const taskProps: TaskProps = {
                                id: task.id.toString(),
                                title: task.titulo,
                                description: task.descripcion,
                                status: mapStatus(task.estado),
                                priority: mapPriority(task.prioridad),
                                // Pass the completion handler
                                onComplete: handleCompleteTask, 
                            };
                            return (
                                <div key={task.id} className="leader-task-wrapper">
                                    <Task {...taskProps} />
                                    <p className="assigned-worker-info">
                                        Assigned to: {task.asignadoA ? `${task.asignadoA.nombre} (${task.asignadoA.rol})` : 'Unassigned'}
                                    </p>
                                </div>
                            );
                        })
                    )}
                    </div>
                )}
              </div>

               {/* Pending Tasks Tab - Can also be updated similarly if needed */}
              <div className={`tab-content ${activeTab === "pendingTasks" ? "active" : ""}`}>
                <div className="content-header">
                  <h2 className="section-title">Pending Tasks</h2>
                </div>
                <p className="section-description">Tasks waiting to be assigned</p>
                {renderLoadingOrError("pendingTasks")}
                {!loading.pendingTasks && !error.pendingTasks && (
                    <div className="tasks-list">
                        {pendingTasks.length === 0 ? renderEmptyState("No pending tasks.") : (
                            pendingTasks.map(task => { // Assuming pendingTasks have same structure
                                const taskProps: TaskProps = {
                                    id: task.id.toString(),
                                    title: task.titulo,
                                    description: task.descripcion,
                                    status: 'pending', // Pending tasks are always pending
                                    priority: mapPriority(task.prioridad),
                                };
                                return <Task key={taskProps.id} {...taskProps} />;
                            })
                        )}
                    </div>
                )}
              </div>

              {/* Team Members Tab */}
              <div className={`tab-content ${activeTab === "team" ? "active" : ""}`}>
                <div className="content-header">
                  <h2 className="section-title">Team Members</h2>
                </div>
                <p className="section-description">View team members and their availability</p>
                {renderLoadingOrError("workers")}
                {!loading.workers && !error.workers && (
                    <div className="members-list">
                    {workers.length === 0 ? renderEmptyState("No team members found.") : (
                        <div className="member-cards-grid"> {/* Added grid container */} 
                            {workers.map(worker => (
                            <div key={worker.id} className="member-card">
                                <div className="member-card-header">
                                    <span className={`availability-dot ${worker.disponible ? 'available' : 'unavailable'}`}></span>
                                    <h3 className="member-name">{worker.nombre}</h3>
                                </div>
                                <p className="member-details">{worker.rol} - {worker.nivel}</p>
                                <p className={`member-status ${worker.disponible ? 'available' : 'unavailable'}`}>
                                    {worker.disponible ? 'Available' : 'Unavailable'}
                                </p>
                            </div>
                            ))}
                        </div>
                    )}
                    </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Render notification if active */} 
      {notification && (
          <Notification 
              message={notification.message} 
              type={notification.type} 
              onClose={() => setNotification(null)} 
          />
      )}
    </div>
  )
}