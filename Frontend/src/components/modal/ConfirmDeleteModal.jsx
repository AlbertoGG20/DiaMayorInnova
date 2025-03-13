import React from 'react';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ isOpen, title, message, onDelete, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modalConfirmDelete-overlay">
      <div className="modalConfirmDelete-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <p>Esta acción no se puede deshacer.</p>
        <div className="modalConfirmDelete-buttons">
          <button className="btn-confirm" aria-label="confirmar borrado" data-testid="confirm-delete-button" onClick={onDelete}>Eliminar</button>
          <button className="btn light" aria-label="cancelar borrado" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;