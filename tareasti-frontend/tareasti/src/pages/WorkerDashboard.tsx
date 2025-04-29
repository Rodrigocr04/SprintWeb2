import { useState, useEffect } from "react";
import { LogOut } from 'lucide-react';
import "../styles/WorkerDashboard.css";
import { useNavigate } from "react-router-dom";
import Task, { TaskProps } from "./Task"; // Make sure TaskProps is exported from Task.tsx

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface ApiTask {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fecha_creacion: string;
  fecha_completada: string | null;
  usuario_id: number;
}

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`http://localhost:8080/api/worker/tasks/${user.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiTask[] = await response.json();
        console.log("Raw API response:", data); // Verifica cuántas tareas vienen
        
        const mappedTasks = data.map(task => {
          const mapped = {
            id: task.id.toString(),
            title: task.titulo,
            description: task.descripcion,
            status: mapStatus(task.estado),
            priority: mapPriority(task.prioridad),
          };
          console.log(`Mapped task ${task.id}:`, mapped);
          return mapped;
        });
        
        console.log("Total mapped tasks:", mappedTasks.length); // Verifica el mapeo
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
}, [user?.id]);

  const mapPriority = (prioridad: string): "low" | "medium" | "high" => {
    switch (prioridad.toLowerCase()) {
      case "alta": return "high";
      case "media": return "medium";
      default: return "low";
    }
  };

  const mapStatus = (estado: string): "pending" | "in-progress" | "completed" => {
    switch (estado.toLowerCase()) {
      case "en progreso": return "in-progress";
      case "completada": return "completed";
      default: return "pending";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/worker/tasks/${taskId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: user?.id,
          fecha_completada: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: "completed" } 
              : task
          )
        );
        console.log(`Task ${taskId} marked as complete in frontend state.`);
      } else {
        const errorBody = await response.text(); // Get error details
        console.error("Failed to complete task on backend:", response.status, errorBody);
        throw new Error(`Failed to complete task: ${response.status} ${errorBody}`);
      }
    } catch (error) {
      console.error("Error in handleTaskComplete:", error);
      // Optionally show an error message to the user here
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="header-title">IT Task Management System</h1>
          <div className="header-user">
            {user && (
              <span className="user-info">
                {user.nombre} ({user.rol})
              </span>
            )}
          </div>
          <div className="header-actions">
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
              </div>

              <div className={`tab-content ${activeTab === "tasks" ? "active" : ""}`}>
                <div className="tasks-header">
                  <h2 className="section-title">Assigned Tasks</h2>
                  <span className="badge outline">
                    {tasks.filter(t => t.status !== "completed").length} pending
                  </span>
                </div>

                <div className="tasks-list">
                  {loading ? (
                    <div className="empty-state">
                      <p>Loading tasks...</p>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="empty-state">
                      <p>No tasks assigned yet</p>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <Task
                        key={task.id}
                        {...task}
                        onComplete={handleTaskComplete}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}