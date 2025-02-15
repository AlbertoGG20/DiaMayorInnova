import { useRef, forwardRef, useImperativeHandle } from "react";
import "./Modal.css";

const Modal = forwardRef(({ children, btnText = "Abrir Modal", modalTitle = "Modal", showButton = true }, ref) => {
  const modalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    showModal: () => modalRef.current?.showModal(),
    close: () => modalRef.current?.close(),
  }));

  const openModal = (e) => {
    e.preventDefault();
    modalRef.current.showModal();
  };

  const closeModal = (e) => {
    e.preventDefault();
    modalRef.current.close();
  };

  return (
    <>
      {showButton && (
        <button className="btn light" onClick={openModal}>
          {btnText}
        </button>
      )}

      <dialog ref={modalRef} className="defaultModal">
        <header className="modal__header">
          <h2>{modalTitle}</h2>
          <button className="btn light" onClick={closeModal}>X</button>
        </header>
        <div className="modal__content">
          {children}
        </div>
      </dialog>
    </>
  )
});

export default Modal;
