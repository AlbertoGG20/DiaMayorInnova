import { useEffect, useState, useRef, useCallback } from 'react';
import AccountService from '../../services/AccountService';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import Modal from '../modal/Modal';
import PaginationMenu from '../pagination-menu/PaginationMenu';
import { SearchBar } from '../search-bar/SearchBar';
import Table from '../table/Table';
import Account from './Account';
import './Account.css';

const AccountsList = ({ newAccount }) => {
  const modalRef = useRef(null); // Referencia para la modal
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(undefined);
  const [searchAccount, setSearchAccount] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteModalData, setDeleteModalData] = useState({
    title: '',
    message: '',
    buttonStatus: 'default',
  });

  const retrieveAccounts = useCallback(async (page, search) => {
    const data = await AccountService.getAll(page, 10, search);
    if (data) {
      setAccounts(data.accounts);
      setTotalPages(data.meta.total_pages);
    }
  }, []);

  useEffect(() => {
    retrieveAccounts(currentPage, searchAccount)
  }, [newAccount, currentPage, searchAccount, retrieveAccounts]);

  const handleSearchChange = (value) => {
    setSearchAccount(value);
    setCurrentPage(1);
  };

  const openEditModal = (id) => {
    setSelectedAccountId(id);
    modalRef.current?.showModal();
  };

  const handleEditSaveSuccess = useCallback(() => {
    retrieveAccounts(currentPage, searchAccount);
  }, [currentPage, searchAccount]);

  const closeEditModal = () => setSelectedAccountId(null);

  const openDeleteModal = (accountId) => {
    const account = accounts.find(s => s.id === accountId);
    setAccountToDelete(account);
    setDeleteModalData({
      title: '¿Estás seguro de que deseas eliminar este enunciado?',
      message: `La cuenta llamada '${account.name}' será eliminada permanentemente.`,
      buttonStatus: 'default',
    });
    setIsDeleteModalOpen(true);
  };

  const deleteAccount = useCallback(async (id) => {
    const response = await AccountService.remove(id);

    if (response) {
      retrieveAccounts(currentPage, searchAccount);
      setDeleteModalData({
        title: 'Cuenta eliminada',
        message: `Se ha eliminado la cuenta llamada '${accountToDelete.name}'.`,
        buttonStatus: 'close',
      });
      setAccountToDelete(null);
    }
    else {
      setDeleteModalData({
        title: 'No se ha podido eliminar la cuenta',
        message: `Revise que la cuenta '${accountToDelete.name}' no tenga ninguna anotación asociada.`,
        buttonStatus: 'close',
      });
    }
  }, [currentPage, searchAccount, accountToDelete]);

  return (
    <>

      <section className='account_accList'>
        <div className='account__header'>
          <h2 className='account__header--h2'>Todas las cuentas</h2>
          <div className='account__form--row'>
            <SearchBar
              value={searchAccount}
              handleSearchChange={handleSearchChange}
            />
          </div>

          <div className='account__table'>
            {accounts.length === 0 ? (
              <p>No hay cuentas disponibles</p>
            ) : (
              <Table
                titles={['Nº Cuenta', 'Nombre', 'Descripción', 'PGC', 'Cargo', 'Abono', 'Acciones']}
                data={accounts}
                actions={true}
                openModal={openEditModal}
                deleteItem={openDeleteModal}
                columnConfig={[
                  { field: 'account_number', sortable: true },
                  { field: 'name', sortable: true },
                  { field: 'description', sortable: true },
                  { field: 'accounting_plan', sortable: true, render: (account) => account.accounting_plan?.acronym || '-' },
                  { field: 'charge',},
                  { field: 'credit'}
                ]}
              />
            )}
          </div>
          <PaginationMenu
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </section>

      <Modal ref={modalRef} modalTitle='Editar Cuenta' showButton={false} onCloseModal={closeEditModal}>
        {selectedAccountId && (
          <Account
            id={selectedAccountId}
            onSaveSuccess={handleEditSaveSuccess}
          />
        )}
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title={deleteModalData.title}
        message={deleteModalData.message}
        deleteModalButtonStatus={deleteModalData.buttonStatus}
        onDelete={() => deleteAccount(accountToDelete?.id)}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default AccountsList
