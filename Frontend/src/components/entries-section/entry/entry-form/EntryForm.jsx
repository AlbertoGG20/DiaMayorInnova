import { useEffect, useRef } from 'react';
import AccountService from '../../../../services/AccountService';
import useAccountSelector from '../../../../hooks/useAccountSelector';
import AccountSelectorModal from '../../../modal/AccountSelectionModal';
import './EntryForm.css';

const EntryForm = ({ annotation, updateAnnotation, onDelete, exercise }) => {
  const accountIdInputRef = useRef(null);
  const accountNumberInputRef = useRef(null);
  const modalRef = useRef(null);
  const debounceTimeout = useRef(null);
  const accountSelector = useAccountSelector();

  const handleAccountSelect = (account) => {
    const updated = {
      ...annotation,
      id: annotation.id,
      number: annotation.number,
      account_number: account.account_number,
      account_name: account.name,
      account_id: account.id,
    };
    updateAnnotation(updated);
    modalRef.current?.close();
  };

  const searchAccount = async (accountNumber) => {
    try {
      const response = await AccountService.findByNumber(accountNumber);
      if (response.data) {
        accountSelector.setAccounts(prevAccounts => {
          const exists = prevAccounts.some(acc =>
            acc.account_number === response.data.account_number &&
            acc.id === response.data.id
          );
          if (!exists) {
            return [...prevAccounts, response.data];
          }
          return prevAccounts;
        });
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error al buscar la cuenta: ', error);
      return null;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let processedValue = value;

    if (name === 'debit' || name === 'credit') {
      processedValue = value.replace(',', '.');
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    const updatedAnnotation = { ...annotation, [name]: processedValue };

    if (name === 'account_number') {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      updateAnnotation(updatedAnnotation);

      if (!value) {
        updateAnnotation({ ...updatedAnnotation, account_id: '', account_name: '' });
        return;
      }

      // Buscar primero en las cuentas cargadas
      const foundAccount = accountSelector.accounts.find(acc => acc.account_number === Number(value));
      if (foundAccount) {
        updateAnnotation({
          ...updatedAnnotation,
          account_id: foundAccount.id,
          account_name: foundAccount.name
        });
        return;
      }

      debounceTimeout.current = setTimeout(async () => {
        const account = await searchAccount(value);
        if (account) {
          updateAnnotation({
            ...updatedAnnotation,
            account_id: account.id,
            account_name: account.name || ''
          });
        } else {
          updateAnnotation({
            ...updatedAnnotation,
            account_id: '',
            account_name: '',
            account_number: value
          });
        }
      }, 500);
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

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, []);

  return (
    <div className='entry_form_wrapper'>
      <p className='entry_apt'> {annotation.number}</p>
      <form action='' className='entry_form'>
        <div className='entry_form_inputs__wrapper'>
          <div className='form_group'>
            <input
              type='number'
              name='account_id'
              value={annotation.account_id || ''}
              onChange={handleChange}
              id='account_id'
              style={{ display: 'none' }}
              ref={accountIdInputRef}
            />
            <input
              type='number'
              id='account_number'
              aria-labelledby='tittle_account-number'
              name='account_number'
              placeholder='477'
              onChange={handleChange}
              value={annotation.account_number || ''}
              min={0}
              ref={accountNumberInputRef}
              disabled={exercise?.finished}
            />
          </div>
          <div className='form_group tittle_account-name--no-visible'>
            <input
              type='text'
              name='account_name'
              placeholder='Hacienda Pública, IGIC soportado'
              onChange={handleChange}
              value={annotation.account_name || ''}
              disabled={exercise?.finished}
              readOnly
            />
          </div>
          <div className='form_group'>
            <input
              type='text'
              name='debit'
              placeholder='1000.00'
              onChange={handleChange}
              value={annotation.debit || ''}
              disabled={annotation.credit || exercise?.finished}
              pattern='[0-9]*[.,]?[0-9]*'
              inputMode='decimal'
            />
          </div>
          <div className='form_group'>
            <input
              type='text'
              name='credit'
              placeholder='1000.00'
              onChange={handleChange}
              value={annotation.credit || ''}
              disabled={annotation.debit || exercise?.finished}
              pattern='[0-9]*[.,]?[0-9]*'
              inputMode='decimal'
            />
          </div>
        </div>
        <button
          className='btn-trash'
          onClick={handleDelete}
          disabled={exercise?.finished}
        >
          <i className='fi fi-rr-trash'></i>
        </button>
      </form>

      <AccountSelectorModal
        modalRef={modalRef}
        searchQuery={accountSelector.searchQuery}
        setSearchQuery={accountSelector.setSearchQuery}
        handleSearchChange={accountSelector.handleSearchChange}
        accountNumberInputRef={accountNumberInputRef}
        accounts={accountSelector.accounts}
        loadAccounts={accountSelector.loadAccounts}
        currentPage={accountSelector.currentPage}
        setCurrentPage={accountSelector.setCurrentPage}
        totalPages={accountSelector.totalPages}
        isLoading={accountSelector.isLoading}
        setIsLoading={accountSelector.setIsLoading}
        onAccountSelect={handleAccountSelect}
      />
    </div>
  );
};

export default EntryForm;
