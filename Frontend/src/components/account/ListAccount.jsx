import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import AccountService from '../../services/AccountService';
import "./Account.css";

const AccountsList = ({ newAcc }) => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchAccount, setSearchAccount] = useState("");
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("ascending") //Sort control state

  useEffect(() => {
    retrieveAccounts();
  }, [newAcc]);

  const retrieveAccounts = () => {
    AccountService.getAll()
      .then(response => {
        setAccounts(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = (e) => {
    e.preventDefault();
    if (searchAccount) {
      const searchTerm = searchAccount.toLowerCase();
      AccountService.getAll()
        .then(response => {
          const filteredAccounts = response.data.filter (acc =>
            acc.name.toLowerCase().includes(searchTerm)
          );
          setAccounts(filteredAccounts);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      retrieveAccounts();
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

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchAccount(searchTerm);
  
    if (!searchTerm) {
      retrieveAccounts(); // Si le champ est vide, récupérer tous les comptes
      return;
    }
  
    // Filtrage dynamique des comptes
    setAccounts((prevAccounts) =>
      prevAccounts.filter((acc) =>
        acc.name.toLowerCase().includes(searchTerm)
      )
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

  return (
    <>

      <section className='account_accList'>
        <div className='account__header'>
          <h2 className='account__header--h2'>Todas las cuentas</h2>

          <form className='search-bar search-bar--acc'>
  <input
    className='search-bar_search'
    type='text'
    value={searchAccount}
    onChange={handleSearchChange}
    placeholder='Filtrer par nom de compte'
  />
  <i className='fi fi-rr-search'></i> {/* Icône juste décorative */}
</form>

        </div>

        <div className='account__table'>
          {accounts.length === 0 ? (
            <p>No hay cuentas disponibles</p>
          ) : (
          <table className='account_tbody'>
            <thead>
              <tr>
                <th onClick={handleSortClick} style={{cursor: "pointer"}}>
                  Nombre {sortOrder === "ascending" ? <i className='fi fi-rr-angle-small-down'/> : <i className='fi fi-rr-angle-small-up'/>}
                </th>
                <th>Nº Cuenta</th>
                <th>Descripción</th>
                <th>PGC</th>
              </tr>
            </thead>
            <tbody>
              {accounts && accounts.map((account, index) => (
                <tr className='account__accList--item' key={index} onClick={() => setActiveAccount(account, index)}>
                  <td>{account.name}</td>
                  <td>{account.account_number}</td>
                  <td>{account.description}</td>
                  <td>{account.accounting_plan_id}</td>
                  <td className='account__form--actions'>
                    <button className='account__button--link inter' onClick={() => navigate("/help-examples")}>
                      <i className='fi-rr-interrogation'/> Ayuda
                    </button>
                    <button className='account__button--link pencil' onClick={() => navigate("/accounts/" + account.id)}>
                      <i className='fi-rr-pencil' /> Editar
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

      </section>
    </>
  );
};

export default AccountsList