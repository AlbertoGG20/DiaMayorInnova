import React, { useEffect, useState } from 'react'
import HelpExampleDataService from '../../services/HelpExampleService';
import { Link } from 'react-router-dom';
import AccountService from '../../services/AccountService';

const AddHelpExample = ({}) => {
  const initialHelpExampleState = {
    id: null,
    creditMoves: "",
    debitMoves: "",
    account_id: 0,
    description: ""
  };

  const [helpExample, setHelpExample] = useState(initialHelpExampleState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState([]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    // setHelpExample({...helpExample, [name]:value});
    setHelpExample({...helpExample, [name]: name === "account_id" ? parseInt(value) : value});
  };

  const validateForm = () => {
    if (!helpExample.creditMoves || !helpExample.debitMoves || !helpExample.account_id || !helpExample.description) {
      setError("Todos los campos son obligatorios y deben tener valores válidos.");
      return false;
    };
    setError("")
    return true;
  }

  const saveHelpExample = () => {
    if (validateForm()) {
      let data = {
        creditMoves: helpExample.creditMoves.trim(),
        debitMoves: helpExample.debitMoves.trim(),
        account_id: helpExample.account_id,
        description: helpExample.description.trim(),
      };

      HelpExampleDataService.create(data)
      .then(response => {
        setHelpExample({
          id: parseInt(response.data.id),
          creditMoves: response.data.creditMoves.trim(),
          debitMoves: response.data.debitMoves.trim(),
          account_id: parseInt(response.data.account_id),
          description: response.data.description.trim(),
        });
        setSubmitted(true);
      })
      .catch(e => {
        setError("Problema al crear");
      });
    }
  };

  const newHelpExample = () => {
    setHelpExample(initialHelpExampleState);
    setSubmitted(false);
    setError("");
  };

  useEffect(() => {
    AccountService.getAll()
      .then(({data}) => {
        setAccounts(data);
      })
  },[])

  return (
    <>
      <Link to={"/help-examples/"}>
        Atrás
      </Link>

      <div>
        {submitted ? (
          <div>
            <h4>Se ha creado el ejemplo</h4>
            <button onClick={newHelpExample}>Añadir otro ejemplo</button>
          </div>
        ) : (
          <div>
            <h4>Nuevo ejemplo</h4>
            <div>
              <label>Movimientos Debe</label>
              <input
                type="text"
                id='debitMoves'
                required
                value={helpExample.debitMoves}
                onChange={handleInputChange}
                name='debitMoves'
              />
            </div>

            <div>
              <label>Movimientos Haber</label>
              <input
                type="text"
                id='creditMoves'
                required
                value={helpExample.creditMoves}
                onChange={handleInputChange}
                name='creditMoves'
              />
            </div>

            <div>
              <label>Cuenta</label>
              <select 
                type="text"
                id='account_id'
                required
                value={helpExample.account_id}
                onChange={handleInputChange}
                name='account_id'
              >
              <option value={0}>-- Cuenta --</option>
                    {accounts.map((account, index) => {
                      return (
                        <option key={index} value={account.id}>{account.name}</option>
                      );
                    })}
                  </select>
            </div>

            <div>
              <label>Descripción</label>
              <input
                type="text"
                id='description'
                required
                value={helpExample.description}
                onChange={handleInputChange}
                name='description'
              />
            </div>

            <button onClick={saveHelpExample}>Crear ejemplo</button>

            {error && <div className="helpExample__error">{error}</div>}
          </div>

        )}
      </div>
    </>
  );
};

export default AddHelpExample