import { useRef, forwardRef, useImperativeHandle } from "react";
import "./Modal.css";

const Modal = forwardRef(({ children, btnText = "Abrir Modal", modalTitle = "Modal", showButton = true, needOpen = true, saveBtn = false, btnNoBg = false }, ref) => {
  const modalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showModal: () => modalRef.current?.showModal(),
    close: () => modalRef.current?.close(),
  }));

  const openModal = (e) => {
    if (!needOpen) return;
    e.preventDefault();
    modalRef.current.showModal();
  };

  const closeModal = (e) => {
    e.preventDefault();
    modalRef.current.close();
  };

  const btnClass = btnNoBg ? "btn btn__icon" : "btn light";


  return (
    <>
      {showButton && (
        <button
          className={btnClass}
          onClick={needOpen ? openModal : (e) => e.preventDefault()}
          disabled={!needOpen}
        >
          {btnText}
        </button >
      )}

      <dialog ref={modalRef} className="defaultModal">
        <header className="modal__header">
          <h2 className="modal__h2">{modalTitle}</h2>
          <button className="btn light" onClick={closeModal} aria-label="Cerrar">X</button>
        </header>
        <div className="modal__content">
          {children}
        </div>
        {saveBtn &&
          <footer className="modal__footer">
            <button className="btn " onClick={closeModal} aria-label="Guardar">Guardar</button>
            <button className="btn light" onClick={closeModal} aria-label="Cerrar">Cancelar</button>
          </footer>
        }
      </dialog>
    </>
  )
});

export default Modal;
