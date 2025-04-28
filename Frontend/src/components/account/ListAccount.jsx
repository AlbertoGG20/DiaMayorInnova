import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import AccountService from '../../services/AccountService';
import "./Account.css";
import Account from "./Account";
import Modal from '../modal/Modal';
import { SearchBar } from '../search-bar/SearchBar';
import Table from '../table/Table';
import PaginationMenu from '../pagination-menu/PaginationMenu';

const AccountsList = ({ newAcc }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState([]);
  const modalRef = useRef(null); // Referencia para la modal
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchAccount, setSearchAccount] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    retrieveAccounts(currentPage, searchAccount);
  }, [newAcc, currentPage, searchAccount]);

  const retrieveAccounts = async (page, name) => {
    setIsLoading(true);
    try {
      const data = await AccountService.getAll(page, 10, name);
      if (data) {
        setAccounts(data.accounts);
        setTotalPages(data.meta.total_pages);
      }
    } catch (error) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveAccount = (account, index) => {
    setCurrentAccount(account);
    setCurrentIndex(index);
  }

  const deleteAccount = (id) => {
    AccountService.remove(id)
      .then((response) => {
        retrieveAccounts();
        setCurrentAccount(null);
        setCurrentIndex(-1);
        navigate("/accounts/");
      })
      .catch((e) => {
        console.log(e)
      });
  }

  const handleSearchChange = (value) => {
    const searchTerm = value;
    setSearchAccount(searchTerm);

    if (!searchTerm) {
      retrieveAccounts();
      return;
    }

    setAccounts((prevAccounts) =>
      prevAccounts.filter((acc) => {
        acc.name.toLowerCase().includes(searchTerm);
        setCurrentPage(1);
      })
    );
  };

  const openEditModal = (id) => {
    setSelectedAccountId(id);
    modalRef.current?.showModal();
  }

  const closeEditModal = () => {
    setSelectedAccountId(null);
    modalRef.current?.close();
  };

  const handleSaveSuccess = () => {
    retrieveAccounts();
  };

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
                titles={["Nº Cuenta", "Nombre", "Descripción", "PGC", "Acciones"]}
                data={accounts}
                actions={true}
                openModal={openEditModal}
                deleteItem={deleteAccount}
                columnConfig={[
                  { field: 'account_number', sortable: true },
                  { field: 'name', sortable: true },
                  { field: 'description', sortable: true },
                  { field: 'accounting_plan_id', sortable: true }
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

      <Modal ref={modalRef} modalTitle="Editar Cuenta" showButton={false}>
        {selectedAccountId && (
          <Account
            id={selectedAccountId}
            onSaveSuccess={handleSaveSuccess}
            onCloseModal={closeEditModal}
          />
        )}
      </Modal>
    </>
  );
};

export default AccountsList