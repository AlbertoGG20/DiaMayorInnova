import React, { useState, useEffect, useRef } from "react";
import statementService from "../../services/statementService";


const StatementForm = ({ onStatementCreated, onAddSolution, solutions, setSolutions, onSaveSolution, statement, onDeleteSolution }) => {
  const [definition, setDefinition] = useState(statement?.definition || "");
  const [explanation, setExplanation] = useState(statement?.explanation || "");
  const [isPublic, setIsPublic] = useState(statement?.is_public || false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  const prevStatementRef = useRef();

  useEffect(() => {
    if (!isUpdated && statement?.id && (JSON.stringify(prevStatementRef.current) !== JSON.stringify(statement))) {
      setDefinition(statement?.definition || "");
      setExplanation(statement?.explanation || "");
      setIsPublic(statement?.is_public || false);
      setSolutions(statement?.solutions || []);
    }

    prevStatementRef.current = statement;
  }, [statement, isUpdated]);

  const clearSuccessMessage = () => {
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const handleAddSolution = () => {
    const newSolution = {
      description: "",
      entries: [
        {
          entry_number: 1,
          entry_date: "",
          annotations: [
            {
              number: 1,
              account_number: 0,
              credit: "",
              debit: "",
            },
            {
              number: 2,
              account_number: 0,
              credit: "",
              debit: "",
            },
          ]
        }
      ]
    };
    setSolutions((prevSolutions) => [...prevSolutions, newSolution]);
  };

  const handleSaveSolution = (updatedSolution, index) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[index] = updatedSolution;
    setSolutions(updatedSolutions);
    if (onSaveSolution) {
      onSaveSolution(updatedSolution);
    }
  };

  const handleDeleteSolution = (index) => {
    if (onDeleteSolution) {
      onDeleteSolution(index);
    }
  };

  const validateForm = () => {
    let errors = "";

    if (!definition.trim()) {
      errors += "La definición es obligatoria.\n";
    }

    solutions.forEach((solution, solutionIndex) => {
      if (!solution.description.trim()) {
        errors += `La descripción de la solución ${solutionIndex + 1} es obligatoria.\n`;
      }

      solution.entries.forEach((entry, entryIndex) => {
        if (entry.annotations.length < 2) {
          errors += `El asiento ${entryIndex + 1} de la solución ${solutionIndex + 1} debe tener al menos dos anotaciones.\n`;
        }

        let totalDebit = 0;
        let totalCredit = 0;

        if (!entry.entry_number) {
          errors += `El número de asiento de la solución ${solutionIndex + 1} es obligatorio.\n`;
        }
        if (!entry.entry_date) {
          errors += `La fecha del asiento de la solución ${solutionIndex + 1} es obligatoria.\n`;
        }

        entry.annotations.forEach((annotation, annotationIndex) => {

          let credit = Number(annotation.credit) || 0;
          let debit = Number(annotation.debit) || 0;

          if (!annotation.account_number) {
            errors += `El número de cuenta de la anotación ${annotationIndex + 1} en la solución ${solutionIndex + 1} es obligatorio.\n`;
          }

          if (credit > 0 && debit > 0) {
            errors += `La anotación ${annotationIndex + 1} en el asiento ${entryIndex + 1} de la solución ${solutionIndex + 1} no puede tener valores en ambos, débito y crédito.\n`;
          }
          if (credit === 0 && debit === 0) {
            errors += `La anotación ${annotationIndex + 1} en el asiento ${entryIndex + 1} de la solución ${solutionIndex + 1} debe tener un valor en débito o crédito.\n`;
          }

          totalDebit += debit;
          totalCredit += credit;
        });

        if (totalDebit !== totalCredit) {
          errors += `El asiento ${entryIndex + 1} de la solución ${solutionIndex + 1} no está balanceado. La suma de débitos (${totalDebit}) no es igual a la suma de créditos (${totalCredit}).\n`;
        }

      });
    });

    setErrorMessage(errors);
    return errors === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      console.error("Errores de validación:", errorMessage);
      return;
    }

    const statementData = {
      definition,
      explanation,
      is_public: isPublic,
      solutions_attributes: solutions.map((solution) => ({
        ...(solution.id && { id: solution.id }),
        description: solution.description,
        ...(solution._destroy === true ? { _destroy: true } : {}),
        entries_attributes: solution.entries.map((entry) => ({
          ...(entry.id && { id: entry.id }),
          entry_number: entry.entry_number,
          entry_date: entry.entry_date,
          ...(entry._destroy === true ? { _destroy: true } : {}),
          annotations_attributes: entry.annotations.map((annotation) => ({
            ...(annotation.id && { id: annotation.id }),
            number: annotation.number,
            account_number: annotation.account_number,
            credit: parseFloat(annotation.credit),
            debit: parseFloat(annotation.debit),
            ...(annotation._destroy === true ? { _destroy: true } : {}),
          })),
        })),
      })),
    };

    try {
      const response = statement?.id
        ? await statementService.updateStatement(statement.id, statementData)
        : await statementService.createStatement(statementData);

      if (onStatementCreated) {
        onStatementCreated(response.data);
      }

      setSuccessMessage(statement?.id ? "Enunciado actualizado correctamente." : "Enunciado creado correctamente.");
      clearSuccessMessage();

      setDefinition("");
      setExplanation("");
      setIsPublic(false);
      setSolutions([]);
      setFieldErrors({});
      setIsUpdated(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          console.error("Error 403 - Acceso denegado:", error.response.data || error.response.statusText);
          setErrorMessage("No tienes permisos para modificar enunciados ajenos.");
        } else {
          console.error("Error en la solicitud:", error.response || error);
          setErrorMessage("Hubo un error al crear el enunciado. Por favor, inténtelo de nuevo.");
        }
      } else {
        console.error("Error desconocido:", error);
        setErrorMessage("Hubo un problema al contactar con el servidor. Intenta nuevamente.");
      }
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <>
      <h2 className="statement-page__form--header">Crear Enunciado</h2>
      <form className="statement-page__form--form" onSubmit={handleSubmit}>
        <div className="statement-page__form--content">
          <label className="statement-page__label--definition" htmlFor="definition">Definición:</label>
          <textarea
            id="definition"
            className="statement-page__input"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
          {fieldErrors.definition && <div className="error-message">{fieldErrors.definition}</div>}
        </div>
        <div className="statement-page__form--content">
          <label className="statement-page__label--explanation" htmlFor="explanation">Explicación:</label>
          <textarea
            id="explanation"
            className="statement-page__input--explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
          {fieldErrors.explanation && <div className="error-message">{fieldErrors.explanation}</div>}
        </div>

        <div className="statement-page__buttons-container">
          <div className="statement-page__buttons--actions">
            <button type="submit" className="btn">{statement ? "Actualizar" : "Crear"}</button>
            {statement && (
              <button type="button" onClick={handleCancel} className=" btn light">
                Cancelar
              </button>
            )}
            <button type="button" onClick={handleAddSolution} className="btn light">
              <i className="fi fi-rr-plus"></i>
              Añadir Solución
            </button>
            <div className="statement-page__visibility--container">
              <label className="statement-page__label--visibility" htmlFor="isPublic">
                Público:
              </label>
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="statement-page__checkbox--visibility"
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}</div>}
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

          </div>
        </div>
      </form>
    </>
  );
};

export default StatementForm;