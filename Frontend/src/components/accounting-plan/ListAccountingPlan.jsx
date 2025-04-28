import React, { useState, useEffect, useRef } from "react";
import AccountingPlanDataService from "../../services/AccountingPlanService"
import { useNavigate } from "react-router-dom";
import "./AccountingPlan.css";
import "../modal/AccountModal.css";
import AccountingPlan from "./AccountingPlan";
import Modal from "../modal/Modal";
import { SearchBar } from "../search-bar/SearchBar";
import Table from "../table/Table";
import PaginationMenu from "../pagination-menu/PaginationMenu";


const AccountingPlansList = ({ newPGC }) => {
  const [accountingPlans, setAccountingPlans] = useState([]);
  const [selectedAccountingPlanId, setSelectedAccountingPlanId] = useState(null); // ID del plan a editar
  const modalRef = useRef(null); // Referencia para la modal
  const accountsModalRef = useRef(null)
  const navigate = useNavigate();
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

  const retrieveAccountingPlans = async (page, name) => {
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

  const deleteAccountingPlan = (id) => {
    AccountingPlanDataService.remove(id)
      .then((response) => {
        retrieveAccountingPlans(); //Refresh list after remove
        navigate("/accounting-plans/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearchChange = (searchValue) => {
    const searchTerm = searchValue;
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
            <SearchBar
              value={searchAccPlan}
              handleSearchChange={handleSearchChange}
            />
          </div>
        </div>


        <div className="accountingPlan__table--container">
          {accountingPlans.length === 0 ? (
            <p>No hay PGCs disponibles</p>
          ) : (

            <Table
              titles={["Nombre PGC", "Acrónimo", "Descripción", "Acciones"]}
              data={accountingPlans}
              actions={true}
              show={fetchAccountsByPGC}
              openModal={openEditModal}
              exportCSV={handleExportToCSV}
              deleteItem={deleteAccountingPlan}
              columnConfig={[
                { field: 'name', sortable: true },
                { field: 'acronym', sortable: true },
                { field: 'description', sortable: true }
              ]}
            />
          )}
        </div>

        <PaginationMenu
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

      </section>

      <Modal ref={accountsModalRef} modalTitle="Cuentas del PGC" showButton={false}>
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

      <Modal ref={modalRef} modalTitle="Editar PGC" showButton={false}>
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