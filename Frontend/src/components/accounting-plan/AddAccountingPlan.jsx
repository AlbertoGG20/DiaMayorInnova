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
  const [fileName, setFileName] = useState("Nada seleccionado");
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
        .then(response => {
          setAccountingPlan({
            id: parseInt(response.data.id),
            name: response.data.name.trim(),
            description: response.data.description.trim(),
            acronym: response.data.acronym.trim(),
          });
          setSubmitted(true)
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
    setUploadMessage("");
    setSelectedFile(null);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".xlsx"))) {
      setSelectedFile(file);
      setError("");
      setFileName(file.name);
    } else {
      setError("El archivo no tiene el formato adecuado");
      setSelectedFile(null);
      setFileName("Nada seleccionado");
    }
  };

  const handleFileUpload= async () => {
    if (!selectedFile) {
      setError("Debes seleccionar un archivo.");
      return;
    }
  
    const fileName = selectedFile.name.toLowerCase();
  
    // Resetear mensajes previos
    setError("");
    setUploadMessage("Subiendo archivo...");
  
    try {
      if (fileName.endsWith(".csv")) {
        const result = await AccountingPlanDataService.importCSV(selectedFile);
        if (!result) {
          setError("Hubo un problema al importar el CSV.");
          return;
        }
      } else if (fileName.endsWith(".xlsx")) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await AccountingPlanDataService.importXLSX(formData);
      } else {
        setError("Formato de archivo no soportado. Solo se permiten .csv o .xlsx.");
        return;
      }
  
      setUploadMessage("¡Importación exitosa!");
      setSelectedFile(null);
      setNewPGC(true);
    } catch (error) {
      console.error("Error al importar archivo:", error);
      if (error.response) {
        setUploadMessage(`Error al importar el archivo: ${error.response.data.message || "Error desconocido"}`);
      } else if (error.request) {
        setUploadMessage("Error de conexión. No se pudo enviar el archivo.");
      } else {
        setUploadMessage(`Error inesperado: ${error.message}`);
      }
    }
  };
  
  const handleDownloadTemplate = async () => {
    try {
      const blob = await AccountingPlanDataService.downloadTemplateXLSX();
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Plantilla_PGC.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error al descargar la plantilla.");
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
        <>
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
                  <textarea
                    className="accountingPlan__input"
                    placeholder="Descripción PGC"
                    id="description"
                    required
                    value={accountingPlan.description}
                    onChange={handleInputChange}
                    name="description">
                  </textarea></label>
              </div>
            </div>

            <div className="accountingPlan__form--actions">
              <div className="accountingPlan__form--row">
                <div className="accountingPlan__form--add">
                  <button className="btn " onClick={saveAccountingPlan}> <i className="fi-rr-plus" />Añadir plan</button>
                </div>

                <div className="accountingPlan__form--upload">
                  <button
                    className="btn "
                    onClick={handleFileUpload}
                    disabled={!selectedFile}
                  > Cargar archivo </button>
                  <label htmlFor="fileUpload" className="accountingPlan__file--label btn light">
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      id="fileUpload"
                      onChange={handleFileChange}
                      className="accountingPlan__file--input"
                    />
                    <i className="fi-rr-upload" />
                    <span id="file-name" className="accountingPlan__file--name">
                      {fileName}
                    </span>
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileChange}
                    className="accountingPlan__file--input"
                  />
                  <button className="btn light accountingPlan__button" onClick={handleDownloadTemplate}> <i className="fi-rr-download" />Plantilla</button>
                </div>
              </div>
            </div>
            {error && <div className="accountingPlan__error">{error}</div>}
            {uploadMessage && <div className="accountingPlan__message">{uploadMessage}</div>}
          </div>
        </>
      )}
    </>
  );
};

export default AddAccountingPlan;