import React, { useState } from "react";
import AccountingPlanDataService from "../../services/AccountingPlanService";
import { Link } from "react-router-dom";
import "./AccountingPlan.css";

const AddAccountingPlan = ({ setNewPGC }) => {
  const initialAccountingPlanState = {
    id: null,
    name: "",
    description: "",
    acronym: ""
  };
  const [accountingPlan, setAccountingPlan] = useState(initialAccountingPlanState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setAccountingPlan({ ...accountingPlan, [name]: value });
  };

  const validateForm = () => {
    if (!accountingPlan.name || !accountingPlan.description || !accountingPlan.acronym) {
      setError("Todos los campos son obligatorios y deben tener valores válidos.");
      return false;
    }
    setError("");
    return true;
  };

  const saveAccountingPlan = () => {
    if (validateForm()) {
      let data = {
        name: accountingPlan.name.trim(),
        description: accountingPlan.description.trim(),
        acronym: accountingPlan.acronym.trim()
      };

      AccountingPlanDataService.create(data)
        .then(response => {
          setAccountingPlan({
            id: parseInt(response.data.id),
            name: response.data.name.trim(),
            description: response.data.description.trim(),
            acronym: response.data.acronym.trim()
          });
          setNewPGC(true);
        })
        .catch(e => {
          console.log(e);
          setError("Hubo un problema al guardar el PGC.");
        });
    };
  };

  const newAccountingPlan = () => {
    setAccountingPlan(initialAccountingPlanState);
    setSubmitted(false);
    setError("");
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("El archivo debe ser un .csv válido");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Debes seleccionar un archivo CSV.");
      return;
    }

    setError("");

    const result = await AccountingPlanDataService.importCSV(selectedFile);
    if (result) {
      setNewPGC(true);
      setSelectedFile(null);
    } else {
      setError("Hubo un problema al importar el CSV.");
    }
  };


  return (
    <>
      {submitted ? (
        <div>
          <h4>Se ha enviado correctamente</h4>
          <button className="accountingPlan__button" onClick={newAccountingPlan}>Añadir otro Plan</button>
          <button><Link to={"/accounting-plans"}>Atrás</Link></button>
        </div>
      ) : (
        <div>
          <div className="accountingPlan__form">
            <h2 className="accountingPlan__header--h2">Nuevo plan de contabilidad</h2>
            <div className="accountingPlan__form--row">
              <div className="accountingPlan__form--group">
                <label>Nombre
                <input
                  className="accountingPlan__input"
                  placeholder="Nombre PGC"
                  type="text"
                  id="name"
                  required
                  value={accountingPlan.name}
                  onChange={handleInputChange}
                  name="name">
                </input></label>
              </div>

              <div className="accountingPlan__form--group">
                <label>Acrónimo
                <input
                  className="accountingPlan__input"
                  placeholder="Acrónimo PGC"
                  type="text"
                  id="acronym"
                  required
                  value={accountingPlan.acronym}
                  onChange={handleInputChange}
                  name="acronym">
                </input></label>
              </div>

            </div>

            <div className="accountingPlan__form--row">
              <div className="accountingPlan__form--group full-width">
                <label>Descripción
                <input
                  className="accountingPlan__input"
                  placeholder="Descripción PGC"
                  type="text"
                  id="description"
                  required
                  value={accountingPlan.description}
                  onChange={handleInputChange}
                  name="description">
                </input></label>
              </div>
            </div>

            <div className="accountingPlan__form--actions">
              <div className="accountingPlan__form--row">
                <div className="accountingPlan__form--add">
                  <button className="btn accountingPlan__button" onClick={saveAccountingPlan}> <i className="fi-rr-plus" />Añadir plan</button>
                </div>

                {error && <div className="accountingPlan__error">{error}</div>}

                {/* Sección de Importación de CSV */}
                <div className="accountingPlan__form--upload">
                  <button 
                    className="btn accountingPlan__button" 
                    onClick={handleUpload} 
                    disabled={!selectedFile}
                  > Cargar archivo </button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="accountingPlan__file--input"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AddAccountingPlan;