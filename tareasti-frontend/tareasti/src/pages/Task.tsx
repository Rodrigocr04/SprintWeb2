import { useState } from "react"
import { Check, Clock, AlertTriangle, AlertCircle } from "lucide-react"
import "../styles/Task.css"

export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "pending" | "in-progress" | "completed"

export interface TaskProps {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  onComplete?: (id: string) => void
}

export default function Task({ id, title, description, status, priority, onComplete }: TaskProps) {
  const [isHovering, setIsHovering] = useState(false)

  const handleComplete = () => {
    if (onComplete) {
      onComplete(id)
    }
  }

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return <Clock className="priority-icon priority-low" />
      case "medium":
        return <AlertTriangle className="priority-icon priority-medium" />
      case "high":
        return <AlertCircle className="priority-icon priority-high" />
      default:
        return <Clock className="priority-icon priority-low" />
    }
  }

  return (
    <div
      className={`task-card ${status === "completed" ? "completed" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="task-header">
        <h3 className="task-title">{title}</h3>
        <div className="task-indicators">
          <span className={`status-badge ${status}`}>{status.replace("-", " ")}</span>
          <span className={`priority-badge ${priority}`}>
            {getPriorityIcon(priority)}
            <span className="priority-text">{priority}</span>
          </span>
        </div>
      </div>

      <p className="task-description">{description}</p>

      <div className="task-actions">
        <button
          className={`complete-button ${status === "completed" ? "completed" : ""} ${isHovering ? "visible" : ""}`}
          onClick={handleComplete}
          disabled={status === "completed"}
        >
          <Check className="check-icon" />
          <span>{status === "completed" ? "Completed" : "Mark as Complete"}</span>
        </button>
      </div>
    </div>
  )
}
