import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import "./TaskPage.css";

const TaskDetails = ({ selectedTask, onDeleteStatement, onDeleteTask, onCloseModal }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  if (!selectedTask) return <p>Cargando detalles...</p>;

  const handleEditTask = () => {
    navigate("/task-edit", { state: { task: selectedTask } });
  };

  const handleDeleteTask = async () => {
    setTaskToDelete(selectedTask);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    try {
      await taskService.deleteTask(taskToDelete.id);
      onDeleteTask(taskToDelete.id);
      onCloseModal();
    } catch (err) {
      console.error("Error al eliminar la tarea:", err);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <article className="task-details">
      <header className="task-details__header">
        <h3 className="task-details__header--title">{selectedTask.title}</h3>
      </header>
      <section className="task-details__task-content">
        <p className="task-details__task-content--date">
          <strong>Fecha de apertura:{" "}</strong>
          {new Date(selectedTask.opening_date).toLocaleString()}
        </p>
        <p className="task-details__task-content--date">
          <strong>Fecha de cierre:{" "}</strong>
          {new Date(selectedTask.closing_date).toLocaleString()}
        </p>
      </section>
      <section className="task-details__statement-content">
        <h3 className="task-details__statements-title">Enunciados</h3>
        {Array.isArray(selectedTask.statements) && selectedTask.statements.length > 0 ? (
          <ul className="task-details__statements-items">
            {selectedTask.statements.map((statement) => (
              <li
                key={`${statement.id}-${statement.created_at}`}
                className="task-details__statement-item"
              >
                <strong>Definición:</strong>
                <p>{statement.definition}</p>
                <button
                  onClick={() => onDeleteStatement(selectedTask.id, statement.id)}
                  className="task-details__statement-item--delete-btn"
                  aria-label="botón de eliminar enunciado de la tarea"
                >
                  <i className="fi-rr-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay enunciados para esta tarea.</p>
        )}
      </section>
      <footer className="task-details__footer">
        <button onClick={handleEditTask} className="task-details__footer--edit-btn">
          Editar tarea
        </button>
        <button onClick={handleDeleteTask} className="task-details__footer--delete-btn">
          Eliminar tarea
        </button>
      </footer>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="¿Estás seguro de que deseas eliminar esta tarea?"
        message={`La tarea "${taskToDelete?.title}" será eliminada permanentemente.`}
        onDelete={confirmDeleteTask}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </article>
  );
};

export default TaskDetails;