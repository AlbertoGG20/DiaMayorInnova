import React, { useState, useEffect, useRef } from "react";
import AccountingPlanDataService from "../../services/AccountingPlanService"
import { useNavigate } from "react-router-dom";
import "./AccountingPlan.css";
import "../modal/AccountModal.css";
import AccountingPlan from "./AccountingPlan";
import Modal from "../modal/Modal";


const AccountingPlansList = ({ newPGC }) => {
  const [accountingPlans, setAccountingPlans] = useState([]);
  const [selectedAccountingPlanId, setSelectedAccountingPlanId] = useState(null); // ID del plan a editar
  const modalRef = useRef(null); // Referencia para la modal
  const accountsModalRef = useRef(null)
  const navigate = useNavigate();
  const [currentAccountingPlan, setCurrentAccountingPlan] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchAccPlan, setSearchAccPlan] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending") //Sort control state
  const [accounts, setAccounts] = useState([]); // Stocker les comptes récupérés
  const [isModalOpen, setIsModalOpen] = useState(false); // Gérer l'affichage de la modale
  const [currentPage, setCurrentPage] = useState(1); //Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    retrieveAccountingPlans(currentPage, searchAccPlan);
  }, [newPGC, currentPage, searchAccPlan]);

  const retrieveAccountingPlans = async(page, name) => {
    setIsLoading(true);
    try {
      const data = await AccountingPlanDataService.getAll(page, 10, name);
      if (data) {
        setAccountingPlans(data.accountingPlans);
        setTotalPages(data.meta.total_pages);
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setIsLoading(false);
    }
  };

  const setActiveAccountingPlan = (accountingPlan, index) => {
    setCurrentAccountingPlan(accountingPlan);
    setCurrentIndex(index);
  };

  const deleteAccountingPlan = (id) => {
    AccountingPlanDataService.remove(id)
      .then((response) => {
        retrieveAccountingPlans(); //Refresh list after remove
        setCurrentAccountingPlan(null); //Clear state
        setCurrentIndex(-1); //Reset index
        navigate("/accounting-plans/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchAccPlan(searchTerm);
  
    if (!searchTerm) {
      retrieveAccountingPlans(); // Si le champ est vide, récupérer tous les PGC
      return;
    }
  
    // Filtrage dynamique des plans comptables
    setAccountingPlans((prevPlans) =>
      prevPlans.filter((plan) => {
        plan.name.toLowerCase().includes(searchTerm);
        setCurrentPage(1);
      })
    );
  };
  

  //PGC sorted by Name column
  const sortAccountinPlans = (order) => {
    const sortedPGC = [...accountingPlans].sort((a, b) => {
      if (order === "ascending") {
        return a.name.localeCompare(b.name);
      }
      else {
        return b.name.localeCompare(a.name);
      }
    });
    setAccountingPlans(sortedPGC);
  };

  //Change order
  const handleSortClick = () => {
    const newOrder = sortOrder === "ascending" ? "descending" : "ascending";
    setSortOrder(newOrder);
    sortAccountinPlans(newOrder);
  }

  const openEditModal = (id) => {
    setSelectedAccountingPlanId(id);
    modalRef.current?.showModal(); 
  };

  const closeEditModal = () => {
    setSelectedAccountingPlanId(null);
    modalRef.current?.close();
  };

  const handleSaveSuccess = () => {
    retrieveAccountingPlans();
  };
  
  // Download CSV
  const handleExportToCSV = (id) => {
    AccountingPlanDataService.exportToCSV(id);
  };
  
  

  const fetchAccountsByPGC = (pgcId) => {
    AccountingPlanDataService.getAccountsByPGC(pgcId)
      .then(response => {
        setAccounts(response.data);
        setIsModalOpen(true);
        accountsModalRef.current?.showModal(); 
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des comptes :", error);
      });
  };

  return (
    <>
      <section className="accountingPlan__pgcList">
        <div className="accountingPlan__header">
          <h2 className="accountingPlan__header--h2">Todos los planes</h2>
            <div className="accountingPlan__form--row">
              <form className="search-bar search-bar--pgc">
                <input
                  className="search-bar_search"
                  type="text"
                  value={searchAccPlan}
                  onChange={handleSearchChange}
                  placeholder="Buscar por nombre"
                />
                <i className="fi fi-rr-search"></i> {/* Icône uniquement décorative */}
              </form>

              <div className="accountingPlan__pagination">
                <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                  <i className='fi fi-rr-angle-double-small-left'/>
                </button>
                <button className="dt-paging-button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                  <i className='fi fi-rr-angle-small-left'/>
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                  <i className='fi fi-rr-angle-small-right'/>
                </button>
                <button className="dt-paging-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                  <i className='fi fi-rr-angle-double-small-right'/>
                </button>
              </div>
            </div>
        </div>
        

        <div className="accountingPlan__table">
          {accountingPlans.length === 0 ? (
            <p>No hay PGCs disponibles</p>
          ) : (
            <table className="accountingPlan_tbody">
              <thead>
                <tr>
                  <th onClick={handleSortClick} style={{cursor: "pointer"}}>
                    Nombre PGC {sortOrder === "ascending" ? <i className="fi fi-rr-angle-small-down"/> : <i className="fi fi-rr-angle-small-up"/>}
                  </th>
                  <th>Acrónimo</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accountingPlans.map((accountingPlan, index) => (
                  <tr key={index}>
                    <td>{accountingPlan.name}</td>
                    <td>{accountingPlan.acronym}</td>
                    <td>{accountingPlan.description}</td>
                    <td className="accountingPlan__table--actions">
                      <button className="accountingPlan__button--link eye" onClick={() => fetchAccountsByPGC(accountingPlan.id)}>
                        <i className="fi-rr-eye" />
                      </button>
                      <button className="accountingPlan__button--link pencil" onClick={() => openEditModal(accountingPlan.id)}>
                        <i className="fi-rr-pencil" />
                      </button>
                      <button className="accountingPlan__button--link download" onClick={() => handleExportToCSV(accountingPlan.id)}>
                        <i className="fi-rr-download" /> CSV
                      </button>
                      <button aria-label="Eliminar PGC" className="accountingPlan__button--remove trash"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAccountingPlan(accountingPlan.id);
                        }}>
                        <i className="fi-rr-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Modal ref={accountsModalRef} modalTitle="Cuentas del PGC" showButton = {false}>
        {accounts.length > 0 ? (
          <table className="modal-table">
            <thead>
              <tr>
                <th>Nº Cuenta</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_number}</td>
                  <td>{account.name}</td>
                  <td>{account.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay cuentas disponibles.</p>
        )}
      </Modal>

      <Modal ref={modalRef} modalTitle="Editar PGC" showButton = {false}>
        {selectedAccountingPlanId && (
          <AccountingPlan 
            id={selectedAccountingPlanId} 
            onSaveSuccess={handleSaveSuccess}
            onCloseModal={closeEditModal}
          />
        )}
      </Modal>
    </>
  );
};

export default AccountingPlansList;