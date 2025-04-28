import React, { useState, useEffect } from "react";
import AccountingPlanDataService from "../../services/AccountingPlanService";
import "./EditFormModal.css";

const AccountingPlan = ({ id, onSaveSuccess, onCloseModal}) => {
  const initialAccountingPlanState = {
    id: null,
    name: "",
    description: "",
    acronym: ""
  };

  const [currentAccountingPlan, setCurrentAccountingPlan] = useState(initialAccountingPlanState);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setMessage(""); 
    setError("");
  
    if (id) {
      AccountingPlanDataService.get(id)
        .then(response => {
          setCurrentAccountingPlan(response.data);
          setError(""); 
        })
        .catch(e => {
          console.log(e);
          setError("Error al cargar el plan contable.");
        });
    }
  
    return () => {
      setMessage("");
      setError("");
    };
  }, [id, onCloseModal]); 
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentAccountingPlan({ ...currentAccountingPlan, [name]: value });
  };

  const updateAccountingPlan = async (e) => {
    e.preventDefault();
  
    setError("");
  
    if (!currentAccountingPlan.name || !currentAccountingPlan.description || !currentAccountingPlan.acronym) {
      setMessage("");
      setError("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      await AccountingPlanDataService.update(currentAccountingPlan.id, currentAccountingPlan);
      setMessage("Actualizado correctamente.");
      setError("");
      onSaveSuccess();
    } catch (error) {
      setError("Error al actualizar.");
      setMessage("");
    }
  };
  

  return (
    <div className="editForm__container">
      <form onSubmit={updateAccountingPlan}>
        <div className="editForm__form--row">
          <div className="editForm__form--group">
            <label>Nombre
            <input
              className="editForm__input" 
              name="name" value={currentAccountingPlan.name} 
              onChange={handleInputChange} /></label>
          </div>

          <div className="editForm__form--group">
            <label>Acrónimo
            <input 
              className="editForm__input" 
              name="acronym" 
              value={currentAccountingPlan.acronym} 
              onChange={handleInputChange} /></label>
          </div>
        </div>

        <div className="editForm__form--row">
          <div className="editForm__form--group full-width">
            <label>Descripción
            <input name="description"
              className="editForm__input"
              value={currentAccountingPlan.description} 
              onChange={handleInputChange} /></label>
          </div>
        </div>


        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center'}}>{message}</p>}

        <button className="editForm__form--save" type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default AccountingPlan;
