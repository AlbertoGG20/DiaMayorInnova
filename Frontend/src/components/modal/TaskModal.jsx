import React from "react";
import "./TaskModal.css";

const TaskModal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="task-modal__button--close" onClick={onClose} aria-label="Cerrar">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default TaskModal;