import React, { useState, useRef, useEffect } from "react";
import Modal from "../modal/Modal";
import http from "../../http-common";

const AnnotationForm = ({ solutionIndex, entryIndex, annotationIndex, solutions, setSolutions }) => {
  const annotation = solutions[0].entries[entryIndex].annotations[annotationIndex];
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const accountNumberInputRef = useRef(null);
  const modalRef = useRef(null);

  const retrieveAccounts = async (page = 1) => {
    try {
      const response = await http.get("/accounts", {
        params: {
          page,
          per_page: 10
        }
      });
      setAccounts(response.data.accounts);
      setTotalPages(response.data.meta.total_pages);
      setCurrentPage(response.data.meta.current_page);
    } catch (error) {
      console.error("Error al cargar las cuentas:", error);
    }
  };

  const openAccountModal = async () => {
    await retrieveAccounts(1);
    modalRef.current?.showModal();
  };

  const handlePageChange = async (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      await retrieveAccounts(newPage);
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
    const { name, value } = event.target;
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex][name] = name === "account_number" ? Number(value) : value;
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="statement-page__annotation-row">
      <input
        type="number"
        name="number"
        value={annotation.number || ""}
        onChange={handleAnnotationChange}
        className="statement-page__input"
        placeholder="Apunte"
      />
      <input
        type="number"
        name="account_number"
        value={annotation.account_number || ""}
        onChange={handleAnnotationChange}
        className="statement-page__input"
        placeholder="Nº Cuenta"
        ref={accountNumberInputRef}
      />
      <input
        type="text"
        name="account_name"
        value={annotation.account_name || ""}
        readOnly
        className="statement-page__input"
        placeholder="Nombre Cuenta"
      />
      <input
        type="number"
        name="debit"
        value={annotation.debit || ""}
        disabled={!!annotation.credit}
        onChange={handleAnnotationChange}
        className="statement-page__input"
        placeholder="Debe"
      />
      <input
        type="number"
        name="credit"
        value={annotation.credit || ""}
        disabled={!!annotation.debit}
        onChange={handleAnnotationChange}
        className="statement-page__input"
        placeholder="Haber"
      />
      <button
        type="button"
        onClick={removeAnnotation}
        className="statement-page__button statement-page__button-delete"
        aria-label="Eliminar apunte"
      >
        <i className="fi fi-rr-trash"></i>
      </button>

      <Modal ref={modalRef} modalTitle="Seleccionar Cuenta" showButton={false}>
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
        <div className="account__pagination">
          <button
            className="dt-paging-button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            <i className="fi fi-rr-angle-double-small-left" />
          </button>
          <button
            className="dt-paging-button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <i className="fi fi-rr-angle-small-left" />
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button
            className="dt-paging-button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <i className="fi fi-rr-angle-small-right" />
          </button>
          <button
            className="dt-paging-button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            <i className="fi fi-rr-angle-double-small-right" />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AnnotationForm;
