import type React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import "../styles/AddTask.css"

type TaskStatus = "pending" | "in-progress" | "completed"
type TaskPriority = "low" | "medium" | "high"

export default function AddTask() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as TaskStatus,
    priority: "medium" as TaskPriority,
    requiredRole: "",
    developerName: "",
  })

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Task data:", formData)
    // Aquí iría la lógica para enviar los datos al backend

    // Reset form and close modal
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      requiredRole: "",
      developerName: "",
    })
    setIsModalOpen(false)
  }

  return (
    <div className="add-task-container">
      <button className="add-task-button" onClick={handleOpenModal}>
        <Plus className="add-icon" />
        <span>Agregar Tarea</span>
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
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Completada</option>
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
                <input
                  type="text"
                  id="requiredRole"
                  name="requiredRole"
                  className="form-input"
                  value={formData.requiredRole}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="developerName" className="form-label">
                  Nombre del Desarrollador
                </label>
                <input
                  type="text"
                  id="developerName"
                  name="developerName"
                  className="form-input"
                  value={formData.developerName}
                  onChange={handleChange}
                />
              </div>

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
