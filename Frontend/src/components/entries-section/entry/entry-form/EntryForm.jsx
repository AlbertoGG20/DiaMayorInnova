import React, { useEffect, useRef, useState, useCallback } from "react";
import Modal from "../../../modal/Modal";
import http from "../../../../http-common";
import AccountService from "../../../../services/AccountService";
import "./EntryForm.css"

const EntryForm = ({ aptNumber, annotation, updateAnnotation, onDelete, exercise }) => {
  const [accounts, setAccounts] = useState([]);
  const accountNumberInputRef = useRef(null);
  const modalRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debounceTimeout = useRef(null);

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
  }, [currentPage, totalPages]);

  const openAccountModal = async () => {
    try {
      const response = await http.get(`/accounts`);
      modalRef.current?.showModal();
    } catch (error) {
      console.error("Error al cargar las cuentas:", error);
    }
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

  const handleAccountSelect = (account) => {
    const updated = {
      ...annotation,
      id: annotation.id,
      number: aptNumber,
      account_number: account.account_number,
      account_name: account.name,
      account_id: account.id
    };
    updateAnnotation(updated);
    modalRef.current?.close();
  };

  const searchAccount = useCallback(async (accountNumber) => {
    try {
      const response = await AccountService.findByNumber(accountNumber);
      if (response.data) {
        setAccounts(prevAccounts => {
          // Verificar si la cuenta ya existe con el mismo número e ID
          const exists = prevAccounts.some(acc => 
            acc.account_number === response.data.account_number && 
            acc.id === response.data.id
          );
          
          if (!exists) {
            // Si no existe, agregar la nueva cuenta
            return [...prevAccounts, response.data];
          }
          return prevAccounts;
        });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error al buscar la cuenta:", error);
      return null;
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let processedValue = value;

    if (name === 'debit' || name === 'credit') {
      // Reemplazar comas por puntos
      processedValue = value.replace(',', '.');
      // Asegurarse de que solo hay un punto decimal
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    const updatedAnnotation = { ...annotation, [name]: processedValue };

    if (name === 'account_number') {
      // Limpiar el timeout anterior si existe
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Actualizar inmediatamente el número de cuenta
      updateAnnotation(updatedAnnotation);

      // Si el valor está vacío, limpiar los campos
      if (!value) {
        updateAnnotation({
          ...updatedAnnotation,
          account_id: "",
          account_name: ""
        });
        return;
      }

      // Buscar primero en las cuentas cargadas
      const foundAccount = accounts.find(acc => acc.account_number === value);
      if (foundAccount) {
        updateAnnotation({
          ...updatedAnnotation,
          account_id: foundAccount.id,
          account_name: foundAccount.name
        });
        return;
      }

      // Si no se encuentra, usar debounce para buscar en la API
      debounceTimeout.current = setTimeout(async () => {
        const account = await searchAccount(value);
        if (account) {
          updateAnnotation({
            ...updatedAnnotation,
            account_id: account.id,
            account_name: account.name || ""
          });
        } else {
          // Si no se encuentra la cuenta, mantener el número pero limpiar los otros campos
          updateAnnotation({
            ...updatedAnnotation,
            account_id: "",
            account_name: "",
            account_number: value // Mantener el número introducido
          });
        }
      }, 500); // 500ms de debounce
    } else if (name === 'debit' && processedValue) {
      updatedAnnotation.credit = '';
      updateAnnotation(updatedAnnotation);
    } else if (name === 'credit' && processedValue) {
      updatedAnnotation.debit = '';
      updateAnnotation(updatedAnnotation);
    } else {
      updateAnnotation(updatedAnnotation);
    }
  };

  const handleDelete = (event) => {
    event.preventDefault();
    onDelete();
  };

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className='entry_form_wrapper'>
      <p className='entry_apt'>{aptNumber}</p>
      <form action="" className='entry_form'>
        <div className="entry_form_inputs__wrapper">
          <div className="form_group">
            <input
              type="number"
              id='account_number'
              aria-labelledby="tittle_account-number"
              name='account_number'
              placeholder='477'
              onChange={handleChange}
              value={annotation.account_number || ''}
              min={0}
              ref={accountNumberInputRef} 
              disabled={exercise?.finished} />
          </div>
          <div className="form_group tittle_account-name--no-visible">
            <input
              type="text"
              id='account_name'
              aria-labelledby="tittle_account-name"
              placeholder='Hacienda Pública, IGIC soportado'
              name='account_name'
              onChange={handleChange}
              value={annotation.account_name || ''}
              disabled={exercise?.finished}
              readOnly />
          </div>
          <div className="form_group">
            <input
              type="text"
              id='debit'
              aria-labelledby="tittle_debit"
              name='debit'
              placeholder='1000.00'
              onChange={handleChange}
              value={annotation.debit || ''}
              disabled={annotation.credit || exercise?.finished}
              pattern="[0-9]*[.,]?[0-9]*"
              inputMode="decimal" />
          </div>
          <div className="form_group">
            <input
              type="text"
              id='credit'
              aria-labelledby="tittle_credit"
              name='credit'
              placeholder='1000.00'
              onChange={handleChange}
              value={annotation.credit || ''}
              disabled={annotation.debit || exercise?.finished}
              pattern="[0-9]*[.,]?[0-9]*"
              inputMode="decimal" />
          </div>
        </div>
        <button className='btn-trash' aria-label="Eliminar Apunte" onClick={handleDelete} disabled={exercise?.finished}><i className='fi fi-rr-trash'></i></button>
      </form>

      <Modal ref={modalRef} modalTitle="Seleccionar Cuenta" showButton={false}>
        <div className="account-list">
          {accounts.map((account) => (
            <div
              key={`${account.account_number}-${account.id}`}
              className="account-item"
              onClick={() => handleAccountSelect(account)}
            >
              <span className="account-item_account">{account.account_number}</span>
              <span className="account-item_account">{account.name}</span>
            </div>
          ))}
        </div>

        <div className="account-list__pagination">
          <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => changePage(1)}>
            <i className='fi fi-rr-angle-double-small-left' />
          </button>
          <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
            <i className='fi fi-rr-angle-small-left' />
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
            <i className='fi fi-rr-angle-small-right' />
          </button>
          <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => changePage(totalPages)}>
            <i className='fi fi-rr-angle-double-small-right' />
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EntryForm;
