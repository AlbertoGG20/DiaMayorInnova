import React, { useEffect, useState } from 'react'
import AccountDataService from '../../services/AccountService';
import { Link } from 'react-router-dom';
import "./Account.css";
import AccountingPlanService from '../../services/AccountingPlanService';

const AddAccount = ({ setNewAcc }) => {
  const initialAccountState = {
    id: null,
    account_number: 0,
    description: "",
    accounting_plan_id: 0,
    name: "",
  };

  const [account, setAccount] = useState(initialAccountState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState([]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setAccount({ ...account, [name]: value });
  };


  const validateForm = () => {
    if (!account.name || !account.account_number || !account.description || !account.accounting_plan_id) {
      setError("Todos los campos son obligatorios y deben tener valores válidos.");
      return false;
    };
    setError("")
    return true;
  }


  const saveAccount = () => {
    setNewAcc(false);
    if (validateForm()) {
      let data = {
          name: account.name.trim(),
          account_number: account.account_number,
          description: account.description.trim(),
          accounting_plan_id: account.accounting_plan_id,
      };

      AccountDataService.create(data)
      .then(response => {
        setAccount({
          id: parseInt(response.data.id),
          name: response.data.name.trim(),
          account_number: parseInt(response.data.account_number),
          description: response.data.description.trim(),
          accounting_plan_id: parseInt(response.data.accounting_plan_id),
        })
        console.log("nuevvooooooo", response.data);
        setNewAcc(true);
      })
        .catch(e => {
          console.error(e);
          setError("Hubo un problema al guardar la cuenta")
        });
    };
  };


  const newAccount = () => {
    setAccount(initialAccountState);
    setSubmitted(false);
    setError("");
  };

  useEffect(() => {
    AccountingPlanService.getAll()
      .then(({ data }) => {
        setPlans(data);
      })
  }, [])

  return (
    <>
      {submitted ? (
        <div>
          <h4>Se ha enviado correctamente</h4>
          <button className="account__button" onClick={newAccount}>Añadir otra cuenta</button>
          <button><Link to={"/accounts"}>Atrás</Link></button>
        </div>
      ) : (
        <div>
          <div className='account__form'>
            <h4 className='account__header--h4'>Nueva cuenta</h4>
            <div className='account__form--row'>
              <div className='account__form--group'>
                <label>Número de cuenta</label>
                  <input 
                    className='account__input'
                    placeholder='Nº cuenta'
                    type="number"
                    id='account_number'
                    required
                    value={account.account_number}
                    onChange={handleInputChange}
                    name='account_number'
                  />
                </div>  
        
                <div className='account__form--group'>
                  <label>Nombre cuenta</label>
                  <input
                    className='account__input'
                    placeholder='Nombre'
                    type="text"
                    id='name'
                    required
                    value={account.name}
                    onChange={handleInputChange}
                    name='name'
                  />
                </div>

                <div className='account__form--group'>
                  <label>Plan de cuentas</label>
                  <select
                    className='account__input'
                    type="text"
                    id='accounting_plan_id'
                    required
                    value={account.accounting_plan_id}
                    onChange={handleInputChange}
                    name='accounting_plan_id'
                  >
                    <option value={0}>-- PGC --</option>
                    {plans.map((plan, index) => {
                      return (
                        <option key={index} value={plan.id}>{plan.name}</option>
                      );
                    })}
                  </select>
                </div>
              </div>

            <div className='account__form--row'>
              <div className='account__form--group'>
                <label>Descripción</label>
                <input
                  className='account__input'
                  placeholder='Descripción'
                  type="text"
                  id='description'
                  required
                  value={account.description}
                  onChange={handleInputChange}
                  name='description'
                />
              </div>
            </div>

            <div className='account__form--actions'>
              <button className="btn account__button" onClick={saveAccount}> <i className='fi-rr-plus' />Añadir cuenta</button>
            </div>

            {error && <div className="account__error">{error}</div>}

          </div>
        </div>
      )}
    </>
  );
};

export default AddAccount;