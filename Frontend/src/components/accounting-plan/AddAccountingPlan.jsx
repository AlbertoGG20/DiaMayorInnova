import React, { useState } from "react";
import AccountingPlanDataService from "../../services/AccountingPlanService";
import { Link } from "react-router-dom";
import "./AccountingPlan.css";

const AddAccountingPlan = ({ setNewPGC }) => {
  const initialAccountingPlanState = {
    id: null,
    name: "",
    description: "",
    acronym: "",
  };
  const [accountingPlan, setAccountingPlan] = useState(initialAccountingPlanState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleInputChange = (event) => {
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
        acronym: accountingPlan.acronym.trim(),
      };

      AccountingPlanDataService.create(data)
        .then((response) => {
          setAccountingPlan({
            id: parseInt(response.data.id),
            name: response.data.name.trim(),
            description: response.data.description.trim(),
            acronym: response.data.acronym.trim(),
          });
          setSubmitted(true); // Set submitted to true after successful save
          setNewPGC(true);
        })
        .catch((e) => {
          console.error("Error saving accounting plan:", e);
          setError("Hubo un problema al guardar el PGC.");
        });
    }
  };

  const newAccountingPlan = () => {
    setAccountingPlan(initialAccountingPlanState);
    setSubmitted(false);
    setError("");
    setUploadMessage("");
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file);
      setError("");
      setUploadMessage("");
    } else {
      setError("El archivo debe ser un .xlsx válido");
      setSelectedFile(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Por favor, seleccione un archivo XLSX.");
      return;
    }

    try {
      setUploadMessage("Subiendo archivo...");
      const formData = new FormData();
      formData.append("file", selectedFile);

      await AccountingPlanDataService.importXLSX(formData);

      setUploadMessage("¡Importación exitosa!");
      setSelectedFile(null);
      setNewPGC(true);
    } catch (error) {
      console.error("Erreur lors de l'importation :", error);
      if (error.response) {
        setUploadMessage(`Error al importar el archivo: ${error.response.data.message || "Error desconocido"}`);
      } else if (error.request) {
        setUploadMessage("Error de conexión. No se pudo enviar el archivo.");
      } else {
        setUploadMessage(`Error inesperado: ${error.message}`);
      }
    }
  };

  return (
    <>
      {submitted ? (
        <div>
          <h4>Se ha enviado correctamente</h4>
          <button className="accountingPlan__button" onClick={newAccountingPlan}>
            Añadir otro Plan
          </button>
          <button>
            <Link to={"/accounting-plans"}>Atrás</Link>
          </button>
        </div>
      ) : (
        <div>
          <div className="accountingPlan__form">
            <h2 className="accountingPlan__header--h2">Nuevo plan de contabilidad</h2>

            {/* Form for creating a PGC */}
            <div className="accountingPlan__form--row">
              <div className="accountingPlan__form--group">
                <label>
                  Nombre
                  <input
                    className="accountingPlan__input"
                    placeholder="Nombre PGC"
                    type="text"
                    id="name"
                    required
                    value={accountingPlan.name}
                    onChange={handleInputChange}
                    name="name"
                  />
                </label>
              </div>

              <div className="accountingPlan__form--group">
                <label>
                  Acrónimo
                  <input
                    className="accountingPlan__input"
                    placeholder="Acrónimo PGC"
                    type="text"
                    id="acronym"
                    required
                    value={accountingPlan.acronym}
                    onChange={handleInputChange}
                    name="acronym"
                  />
                </label>
              </div>
            </div>

            <div className="accountingPlan__form--row">
              <div className="accountingPlan__form--group full-width">
                <label>
                  Descripción
                  <input
                    className="accountingPlan__input"
                    placeholder="Descripción PGC"
                    type="text"
                    id="description"
                    required
                    value={accountingPlan.description}
                    onChange={handleInputChange}
                    name="description"
                  />
                </label>
              </div>
            </div>

            <div className="accountingPlan__form--add">
              <button className="btn accountingPlan__button" onClick={saveAccountingPlan}>
                <i className="fi-rr-plus" /> Añadir plan
              </button>
            </div>

            {error && <div className="accountingPlan__error">{error}</div>}

            {/* Form for importing an XLSX file */}
            <div className="accountingPlan__form--import">
              <h3>Importar planes contables desde un archivo XLSX</h3>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="accountingPlan__file--input"
              />
              <button
                className="btn accountingPlan__button"
                onClick={handleFileUpload}
                disabled={!selectedFile}
              >
                📂 Subir archivo
              </button>
              {uploadMessage && <p className="accountingPlan__message">{uploadMessage}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAccountingPlan;