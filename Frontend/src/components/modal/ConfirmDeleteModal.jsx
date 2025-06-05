import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ isOpen, title, message, deleteModalButtonStatus = 'default', onDelete, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='modalConfirmDelete-overlay'>
      <div className='modalConfirmDelete-content'>
        <h2>{title}</h2>
        <p>{message}</p>
        {deleteModalButtonStatus === 'default' && <p>Esta acción no se puede deshacer.</p>}
        <div className='modalConfirmDelete-buttons'>
          {deleteModalButtonStatus === 'default' && (
            <>
              <button className='btn-confirm' aria-label='confirmar borrado' data-testid='confirm-delete-button' onClick={onDelete}>Eliminar</button>
              <button className='btn light' aria-label='cancelar borrado' onClick={onClose}>Cancelar</button>
            </>
          )}
          {deleteModalButtonStatus === 'close' && <button className='btn light' aria-label='cerrar' onClick={onClose}>Cerrar</button>}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;