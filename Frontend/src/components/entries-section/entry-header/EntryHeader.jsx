import React, { useRef } from 'react';
import Modal from "../../modal/Modal";
import "./EntryHeader.css"

const EntryHeader = ({ addEntry, selectedStatement, examStarted, exercise }) => {

  const modalRef = useRef(null);

  return (
    <div className='entry_header'>
      <h2>Asientos Contables</h2>
      <section className="entry_buttons">

        <button className='btn' disabled={!examStarted || exercise?.finished} onClick={() => {
          if (selectedStatement) {
            addEntry(selectedStatement?.id ?? 0);
          } else {
            modalRef.current?.showModal();
          }
        }}><i className='fi fi-rr-plus'></i>Asiento</button>
      </section>

      <Modal
        ref={modalRef}
        modalTitle="Atención"
        showButton={false}
      >
        <p>Por favor, selecciona un enunciado antes de agregar un asiento.</p>
      </Modal>
    </div>
  )
}

export default EntryHeader
