import React, { useState, useEffect } from "react";
import AccountingPlanDataService from "../../services/AccountingPlanService"
import { Link, useNavigate } from "react-router-dom";
import "./AccountingPlan.css";

// PGC LIST
const AccountingPlansList = ({ newPGC }) => {
  const [accountingPlans, setAccountingPlans] = useState([]);
  const [currentAccountingPlan, setCurrentAccountingPlan] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchAccPlan, setSearchAccPlan] = useState("");
  const navigate = useNavigate();



  useEffect(() => {
    retrieveAccountingPlans();
  }

    , [newPGC]);

  const retrieveAccountingPlans = () => {
    AccountingPlanDataService.getAll()
      .then(response => {
        setAccountingPlans(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    if (searchAccPlan) {
      AccountingPlanDataService.findByName(searchAccPlan)
        .then(response => {
          setAccountingPlans(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      retrieveAccountingPlans();
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
    setSearchAccPlan(e.target.value);
  };

  return (
    <>

      <section className="accountingPlan__pgcList">
        <h2 className="accountingPlan__header--h2">Todos los planes</h2>

        <div className="accountingPlan__input--filter">
          <input
            aria-label="Filtrar por nombre"
            className="accountingPlan__input"
            type="text"
            value={searchAccPlan}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === 'Enter' && findByName()} //Usability upgrade #1 -> Search pressing "Enter" key
            placeholder="Filtrar por nombre"
          />
          <button className="btn accountingPlan__button" onClick={findByName}>Buscar</button>
        </div>

        <div className="accountingPlan__table">
          {accountingPlans.length === 0 ? ( // Usability upgrade #3 -> Show message if there is no data
            <p>No hay PGCs disponibles</p>
          ) : (
            <table className="accountingPlan_tbody">
              <thead>
                <tr>
                  <th>Nombre PGC</th>
                  <th>Acrónimo</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {accountingPlans && accountingPlans.map((accountingPlan, index) => (
                  <tr className="accountingPlan__pgcList-item" key={index} onClick={() => setActiveAccountingPlan(accountingPlan, index)}>
                    <td>{accountingPlan.name}</td>
                    <td>{accountingPlan.acronym}</td>
                    <td>{accountingPlan.description}</td>
                    <td className="accountingPlan__form--actions">
                      <button className="accountingPlan__button--link eye" onClick={()=>navigate("/accounts")}>
                          <i className="fi-rr-eye" /> Ver cuentas
                      </button>
                      <button className="accountingPlan__button--link pencil" onClick={()=>navigate("/accounting-plans/" + accountingPlan.id)}>
                          <i className="fi-rr-pencil" /> Editar
                      </button>
                      <button aria-label="Eliminar PGC" className="accountingPlan__button--remove trash"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("¿Está seguro de que quiere eliminar este PGC?")) { //Usability upgrade #2 -> Confirm before PGC remove
                            deleteAccountingPlan(accountingPlan.id);
                          }
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

    </>
  );
};

export default AccountingPlansList;