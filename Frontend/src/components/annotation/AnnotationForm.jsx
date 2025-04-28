import React, { useState, useRef, useEffect } from "react";
import Modal from "../modal/Modal";
import http from "../../http-common";
import PaginationMenu from "../pagination-menu/PaginationMenu";

const AnnotationForm = ({ solutionIndex, entryIndex, annotationIndex, solutions, setSolutions }) => {
  const annotation = solutions[solutionIndex].entries[entryIndex].annotations[annotationIndex];
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const accountNumberInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (annotation.account_id) {
      const fetchAccountData = async () => {
        try {
          const response = await http.get(`/accounts/${annotation.account_id}`);
          const accountData = response.data;
          const updatedSolutions = [...solutions];
          updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_number = accountData.account_number;
          updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = accountData.name;
          setSolutions(updatedSolutions);
        } catch (error) {
          console.error("Error al cargar los datos de la cuenta:", error);
        }
      };
      fetchAccountData();
    }
  }, [annotation.account_id]);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await http.get(`/accounts?page=${currentPage}&limit=${5}`);
        setAccounts(response.data.accounts);
        setTotalPages(response.data.meta.total_pages || 1);
      } catch (error) {
        console.error("Error al cargar las cuentas:", error);
      }
    };
    loadAccounts();
  }, [currentPage]);
  const debounceTimeout = useRef(null);

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

  const searchAccount = async (accountNumber) => {
    try {
      const response = await http.get(`/accounts/find_by_account_number?account_number=${accountNumber}`);
      if (response.data) {
        const updatedSolutions = [...solutions];
        updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex] = {
          ...updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex],
          account_number: response.data.account_number,
          account_name: response.data.name
        };
        setSolutions(updatedSolutions);
      }
    } catch (error) {
      console.error("Error al buscar la cuenta:", error);
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
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_id = account.id;
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
      updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_id = null;
      updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = "";
    }
    setSolutions(updatedSolutions);

    if (name === "account_number" && value) {
      // Limpiar el timeout anterior si existe
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Si el valor está vacío, limpiar los campos
      if (!value) {
        updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = "";
        setSolutions(updatedSolutions);
        return;
      }

      // Buscar primero en las cuentas cargadas
      const foundAccount = accounts.find(acc => acc.account_number === value);
      if (foundAccount) {
        updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = foundAccount.name;
        setSolutions(updatedSolutions);
        return;
      }

      // Si no se encuentra, usar debounce para buscar en la API
      debounceTimeout.current = setTimeout(() => {
        searchAccount(value);
      }, 500); // 500ms de debounce
    }
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
        id="number"
        className="statement-page__input--edit-solution"
        placeholder="Apunte"
      />
      <input
        type="number"
        name="account_number"
        value={annotation.account_number || ""}
        onChange={handleAnnotationChange}
        id="account_number"
        className="statement-page__input--edit-solution"
        placeholder="Nº Cuenta"
        ref={accountNumberInputRef}
      />
      <input
        type="text"
        name="account_name"
        value={annotation.account_name || ""}
        readOnly
        id="account_name"
        className="statement-page__input--edit-solution"
        placeholder="Nombre Cuenta"
      />
      <input
        type="number"
        name="debit"
        value={annotation.debit || ""}
        disabled={!!annotation.credit}
        onChange={handleAnnotationChange}
        id="debit"
        className="statement-page__input--edit-solution"
        placeholder="Debe"
      />
      <input
        type="number"
        name="credit"
        value={annotation.credit || ""}
        disabled={!!annotation.debit}
        onChange={handleAnnotationChange}
        id="credit"
        className="statement-page__input--edit-solution"
        placeholder="Haber"
      />
      <button
        type="button"
        onClick={removeAnnotation}
        className="statement-page__button statement-page__button-delete btn__icon"
        aria-label="Eliminar apunte"
      >
        <i className="fi fi-rr-trash"></i>
      </button>

      <Modal ref={modalRef} modalTitle="Seleccionar Cuenta" showButton={false}>
        <div className="account-list">
          {accounts && accounts.map((account) => (
            <div
              key={account.id}
              className="account-item"
              onClick={() => handleAccountSelect(account)}
            >
              <span className="account-item_account">{account.account_number}</span>
              <span className="account-item_account">{account.name}</span>
            </div>
          ))}
        </div>
        <div className="account-pagination">
          <PaginationMenu
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AnnotationForm;
