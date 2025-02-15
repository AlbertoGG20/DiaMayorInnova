import React, { useState, useRef, useEffect } from "react";
import Modal from "../modal/Modal";
import http from "../../http-common";

const AnnotationForm = ({ solutionIndex, entryIndex, annotationIndex, solutions, setSolutions }) => {
  
  const annotation = solutions[solutionIndex].entries[entryIndex].annotations[annotationIndex];
  const [accounts, setAccounts] = useState([]);
  const accountNumberInputRef = useRef(null);
  const modalRef = useRef(null);

  const openAccountModal = async () => {
    try {
      const response = await http.get("/accounts");
      setAccounts(response.data);
      modalRef.current?.showModal();
    } catch (error) {
      console.error("Error al cargar las cuentas:", error);
    }
  };

  const handleAccountSelect = (account) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_number = account.account_number;
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = account.name;
    setSolutions(updatedSolutions);
    modalRef.current?.close();
  };

  const handleAnnotationChange = (event) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex][event.target.name] = event.target.value;
    if (event.target.name === "account_number") {
      updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_number = Number(event.target.value);
    }
    setSolutions(updatedSolutions);
  };

  const removeAnnotation = () => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations = updatedSolutions[solutionIndex].entries[entryIndex].annotations.filter(
      (_, i) => i !== annotationIndex
    );
    setSolutions(updatedSolutions);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "F1" && document.activeElement === accountNumberInputRef.current) {
        event.preventDefault();
        openAccountModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="statement-page__annotation-row">
      <input
        type="number"
        name="number"
        value={annotation.number || ""}
        onChange={handleAnnotationChange}
        id="number"
        className="statement-page__input"
        placeholder="Apunte"
        aria-label="number"
      />
      <input
        type="number"
        name="account_number"
        value={annotation.account_number || ""}
        onChange={handleAnnotationChange}
        id="account_number"
        className="statement-page__input"
        placeholder="Nº Cuenta"
        aria-label="account_number"
        ref={accountNumberInputRef}
      />
      <input
        type="text"
        name="account_name"
        value={annotation.account_name || ""}
        readOnly
        id="account_name"
        className="statement-page__input"
        placeholder="Nombre Cuenta"
        aria-label="account_name"
      />
      <input
        type="number"
        name="debit"
        value={annotation.debit || ""}
        disabled={!!annotation.credit && annotation.credit !== "" && annotation.credit !== 0}
        onChange={handleAnnotationChange}
        id="debit"
        className="statement-page__input"
        placeholder="Debe"
        aria-label="debit"
      />
      <input
        type="number"
        name="credit"
        value={annotation.credit || ""}
        disabled={!!annotation.debit && annotation.debit !== "" && annotation.debit !== 0}
        onChange={handleAnnotationChange}
        id="credit"
        className="statement-page__input"
        placeholder="Haber"
        aria-label="credit"
      />
      <button
        type="button"
        onClick={removeAnnotation}
        className="statement-page__button statement-page__button-delete"
        aria-label="Eliminar apunte"
      >
        <i className="fi fi-rr-trash"></i>
      </button>

      <Modal ref={modalRef} title="Seleccionar Cuenta" showButton={false}>
        <div className="account-list">
          {accounts.map((account) => (
            <div
              key={account.account_number}
              className="account-item"
              onClick={() => handleAccountSelect(account)}
            >
              <span className="account-item_account">{account.account_number}</span>
              <span className="account-item_account">{account.name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AnnotationForm;
