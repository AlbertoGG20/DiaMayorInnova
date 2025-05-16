import React, { useState, useRef, useEffect } from 'react';
import Modal from '../modal/Modal';
import http from '../../http-common';
import PaginationMenu from '../pagination-menu/PaginationMenu';

const AnnotationForm = ({ solutionIndex, entryIndex, annotationIndex, solutions, setSolutions }) => {
  const annotation = solutions[solutionIndex].entries[entryIndex].annotations[annotationIndex];
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const accountIdInputRef = useRef(null);
  const accountNumberInputRef = useRef(null);
  const modalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (annotation.account_id) {
      const fetchAccountDataById = async () => {
        try {
          const response = await http.get(`/accounts/${annotation.account_id}`);
          const accountData = response.data;
          const updatedSolutions = [...solutions];
          updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_id = accountData.id;
          updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = accountData.name;
          accountNumberInputRef.current.value = accountData.account_number;
          setSolutions(updatedSolutions);
        } catch (error) {
          console.error('Error al cargar los datos de la cuenta: ', error);
        }
      };
      fetchAccountDataById();
    }
  }, [annotation.account_id]);

  const loadAccounts = async () => {
    try {
      const response = await http.get(`/accounts?page=${currentPage}&per_page=${5}&search=${searchQuery}`);
      setAccounts(response.data.accounts);
      setTotalPages(response.data.meta.total_pages || 1);
    } catch (error) {
      console.error('Error al cargar las cuentas: ', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [searchQuery, currentPage]);

  const debounceTimeout = useRef(null);

  let account_id;
  let account_name;
  const searchAccount = async (accountNumber) => {
    try {
      const response = await http.get(`/accounts/find_by_account_number?account_number=${accountNumber}`);
      if (response.data) {
        account_id = response.data.id;
        account_name = response.data.name;
      }
    } catch (error) {
      account_id = null;
      account_name = '';
      console.error('Error al buscar la cuenta: ', error);
    }
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex] = {
      ...updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex],
      account_id: account_id,
      account_name: account_name
    };
    setSolutions(updatedSolutions);
  };

  const openAccountModal = async () => {
    await loadAccounts();
    modalRef.current?.showModal();
  };

  const handleAccountSelect = (account) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_id = account.id;
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = account.name;
    setSolutions(updatedSolutions);
    modalRef.current?.close();
  };

  const handleAnnotationChange = (event) => {
    const { name, value } = event.target;
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex][name] = value;

    if (name === 'account_id') {
      updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_id = Number(value);
      updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_name = '';
    }
    setSolutions(updatedSolutions);

    if (name === 'account_id' && value) {
      // Limpiar el timeout anterior si existe
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Buscar primero en las cuentas cargadas
      const foundAccount = accounts.find(acc => acc.id === value);
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

    if (name === 'account_number' && value) {
      // Limpiar el timeout anterior si existe
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Buscar primero en las cuentas cargadas
      const foundAccount = accounts.find(acc => acc.account_number === value);
      if (foundAccount) {
        updatedSolutions[solutionIndex].entries[entryIndex].annotations[annotationIndex].account_id = foundAccount.id;
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
      if (event.key === 'F1' && document.activeElement === accountNumberInputRef.current) {
        event.preventDefault();
        openAccountModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const safeSetCurrentPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className='statement-page__annotation-row'>
      <input
        type='number'
        name='number'
        value={annotation.number || ''}
        onChange={handleAnnotationChange}
        id='number'
        className='statement-page__input--edit-solution'
        placeholder='Apunte'
      />
      <input
        type='number'
        name='account_id'
        value={annotation.account_id || ''}
        onChange={handleAnnotationChange}
        id='account_id'
        className='statement-page__input--edit-solution'
        placeholder='Nº Cuenta'
        style={{ display: 'none' }}
        ref={accountIdInputRef}
      />
      <input
        type='number'
        name='account_number'
        onChange={handleAnnotationChange}
        id='account_number'
        className='statement-page__input--edit-solution'
        placeholder='Nº Cuenta'
        ref={accountNumberInputRef}
      />
      <input
        type='text'
        name='account_name'
        value={annotation.account_name || ''}
        readOnly
        id='account_name'
        className='statement-page__input--edit-solution'
        placeholder='Nombre Cuenta'
      />
      <input
        type='number'
        name='debit'
        value={annotation.debit || ''}
        disabled={!!annotation.credit}
        onChange={handleAnnotationChange}
        id='debit'
        className='statement-page__input--edit-solution'
        placeholder='Debe'
      />
      <input
        type='number'
        name='credit'
        value={annotation.credit || ''}
        disabled={!!annotation.debit}
        onChange={handleAnnotationChange}
        id='credit'
        className='statement-page__input--edit-solution'
        placeholder='Haber'
      />
      <button
        type='button'
        onClick={removeAnnotation}
        className='statement-page__button statement-page__button-delete btn__icon'
        aria-label='Eliminar apunte'
      >
        <i className='fi fi-rr-trash'></i>
      </button>

      <Modal ref={modalRef} modalTitle='Seleccionar Cuenta' showButton={false}>
        <div className='account-list'>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder='Search by number or name...'
            className='search-input'
          />
        </div>
        <div className='account-list'>
          {isLoading && <p>Loading...</p>}
          {!isLoading && (
            accounts.length > 0 ? (
              accounts.map((account) => (
                <div
                  key={`${account.account_number}-${account.id}`}
                  className='account-item'
                  onClick={() => handleAccountSelect(account)}
                >
                  <span className='account-item_account'>{account.account_number}</span>
                  <span className='account-item_account'>{account.name}</span>
                </div>
              ))
            ) : (
              <p>No accounts found.</p>
            )
          )}
        </div>

        <PaginationMenu
          currentPage={currentPage}
          setCurrentPage={safeSetCurrentPage}
          totalPages={totalPages}
        />
      </Modal>
    </div>
  );
};

export default AnnotationForm;
