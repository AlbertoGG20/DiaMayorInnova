import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import AccountService from '../../services/AccountService';
import "./Account.css";
import Account from "./Account";
import Modal from '../modal/Modal';
import { SearchBar } from '../search-bar/SearchBar';

const AccountsList = ({ newAcc }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState([]);
  const modalRef = useRef(null); // Referencia para la modal
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchAccount, setSearchAccount] = useState("");
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("ascending") //Sort control state
  const [currentPage, setCurrentPage] = useState(1); //Pagination
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
      retrieveAccounts(); // Si le champ est vide, récupérer tous les comptes
      return;
    }

    // Filtrage dynamique des comptes
    setAccounts((prevAccounts) =>
      prevAccounts.filter((acc) => {
        acc.name.toLowerCase().includes(searchTerm);
        setCurrentPage(1);
      })
    );
  };


  //Accounts sorted by Name column
  const sortAccounts = (order) => {
    const sortedAcc = [...accounts].sort((a, b) => {
      if (order === "ascending") {
        return a.name.localeCompare(b.name);
      }
      else {
        return b.name.localeCompare(a.name);
      }
    });
    setAccounts(sortedAcc);
  }

  //Change order
  const handleSortClick = () => {
    const newOrder = sortOrder === "ascending" ? "descending" : "ascending";
    setSortOrder(newOrder);
    sortAccounts(newOrder);
  }

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
              <table className='account_tbody'>
                <thead>
                  <tr>
                    <th>Nº Cuenta</th>
                    <th onClick={handleSortClick} style={{ cursor: "pointer" }}>
                      Nombre {sortOrder === "ascending" ? <i className='fi fi-rr-angle-small-down' /> : <i className='fi fi-rr-angle-small-up' />}
                    </th>
                    <th>Descripción</th>
                    <th>PGC</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts && accounts.map((account, index) => (
                    <tr className='account__accList--item' key={index} onClick={() => setActiveAccount(account, index)}>
                      <td>{account.account_number}</td>
                      <td>{account.name}</td>
                      <td>{account.description}</td>
                      <td>{account.accounting_plan_id}</td>
                      <td className='account__table--actions'>
                        <button className='account__button--link inter' onClick={() => navigate("/help-examples")}>
                          <i className='fi-rr-interrogation' />
                        </button>
                        <button className='account__button--link pencil' onClick={() => openEditModal(account.id)}>
                          <i className='fi-rr-pencil' />
                        </button>
                        <button aria-label="Eliminar cuenta" className='account__button--remove trash'
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAccount(account.id);
                          }}>
                          <i className='fi-rr-trash' />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
          <div className="section-table__pagination">
            <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
              <i className='fi fi-rr-angle-double-small-left' />
            </button>
            <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
              <i className='fi fi-rr-angle-small-left' />
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
              <i className='fi fi-rr-angle-small-right' />
            </button>
            <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
              <i className='fi fi-rr-angle-double-small-right' />
            </button>
          </div>
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