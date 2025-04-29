import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import "../styles/AddTask.css"

type TaskStatus = "pending" | "in-progress" | "completed"
type TaskPriority = "low" | "medium" | "high"

interface AddTaskProps {
  onTaskAdded?: () => void;
}

export default function AddTask({ onTaskAdded }: AddTaskProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as TaskStatus,
    priority: "medium" as TaskPriority,
    requiredRole: "",
    developerName: "",
  })
  const [formMessage, setFormMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setFormMessage(null);
    setIsModalOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormMessage(null);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Task data:", formData)
    try {
      const response = await fetch('http://localhost:8080/api/leader/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.title,
          descripcion: formData.description,
          prioridad: formData.priority === 'low' ? 'BAJA' : formData.priority === 'medium' ? 'MEDIA' : 'ALTA',
          rolRequerido: formData.requiredRole.toUpperCase()
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody || 'Failed to create task'}`);
      }

      const newTask = await response.json();
      console.log('Task created successfully:', newTask);
      setFormMessage({ text: 'Task created successfully!', type: 'success' });
      
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        requiredRole: "",
        developerName: "",
      });

      setTimeout(() => {
        if (formMessage?.type === 'success') { 
          handleCloseModal();
        }
        if (onTaskAdded) {
          onTaskAdded();
        }
      }, 1500);

    } catch (error: any) {
      console.error('Error creating task:', error);
      setFormMessage({ text: `Error: ${error.message}`, type: 'error' });
    }
  }

  return (
    <div className="add-task-container">
      <button className="add-task-button" onClick={handleOpenModal}>
        <Plus className="add-icon" />
        <span>Add Task</span>
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Agregar Nueva Tarea</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <X className="close-icon" />
                <span className="sr-only">Cerrar</span>
              </button>
            </div>

            <form className="task-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in-progress" disabled>En Progreso</option>
                    <option value="completed" disabled>Completada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority" className="form-label">
                    Prioridad
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="requiredRole" className="form-label">
                  Rol Requerido
                </label>
                <select
                  id="requiredRole"
                  name="requiredRole"
                  className="form-select"
                  value={formData.requiredRole}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Selecciona un Rol</option>
                  <option value="PROGRAMADOR">Programador</option>
                  <option value="DISENADOR">Diseñador</option>
                  <option value="TESTER">Tester</option>
                </select>
              </div>

              {formMessage && (
                <div className={`form-message form-message-${formMessage.type}`}>
                  {formMessage.text}
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
