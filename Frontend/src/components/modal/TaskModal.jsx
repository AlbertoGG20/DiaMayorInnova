import React from "react";
import "./TaskModal.css";
import "./Modal.css";

const TaskModal = ({ show, onClose, children, modalTitle }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay " onClick={onClose}>
      <div className="modal-overlay__container">
        <header className="modal__header">
          <h2 className="modal__h2">{modalTitle}</h2>
          <button className="btn light" onClick={onClose} aria-label="Cerrar">X</button>
        </header>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}

        </div>
      </div>
    </div>
  );
};

export default TaskModal;