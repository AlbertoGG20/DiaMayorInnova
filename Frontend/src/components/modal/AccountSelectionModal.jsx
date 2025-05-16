import { useEffect } from 'react';
import PaginationMenu from '../pagination-menu/PaginationMenu';
import Modal from './Modal';

export default function AccountSelectorModal({
  modalRef,
  modalTitle = 'Seleccionar Cuenta',
  accountNumberInputRef,
  accounts,
  loadAccounts,
  searchQuery,
  setSearchQuery,
  onSearchChange,
  currentPage,
  setCurrentPage,
  totalPages,
  isLoading,
  setIsLoading,
  onAccountSelect,
}) {

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

  const openAccountModal = async () => {
    // we want to put the loading message only in the openning
    // of the modal and not when the user is searching
    setIsLoading(true);
    setSearchQuery('');
    setCurrentPage(1);
    loadAccounts();
    modalRef.current?.showModal();
  };

  return (
    <Modal ref={modalRef} modalTitle={modalTitle} showButton={false}>
      <div className='search-bar'>
        <input
          type='text'
          value={searchQuery}
          onChange={onSearchChange}
          placeholder='Search by number or name...'
          className='search-input'
        />
      </div>
      <div className='account-list'>
        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          accounts.length > 0 ? (
            accounts.map(account => (
              <div
                key={`${account.account_number}-${account.id}`}
                className='account-item'
                onClick={() => onAccountSelect(account)}
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
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </Modal>
  );
}