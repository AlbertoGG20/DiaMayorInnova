import React, { useState } from "react";
import EntryForm from "../entry/EntryForm.jsx";

const SolutionForm = ({ solution, solutionIndex, solutions, setSolutions }) => {

  const handleSolutionChange = (event) => {
    setSolutions((solution) => {
      const updatedSolutions = [...solutions];
      updatedSolutions[solutionIndex].description = event.target.value;
      return updatedSolutions;
    });

  };

  const [collapsedEntries, setCollapsedEntries] = useState(
    solution.entries.map(() => true) // Inicialmente todos los asientos están contraídos
  );

  const toggleCollapse = (index) => {
    const updatedCollapse = [...collapsedEntries];
    updatedCollapse[index] = !updatedCollapse[index];
    setCollapsedEntries(updatedCollapse);
  };

  const addEntry = () => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries.push({
      entry_number: updatedSolutions[solutionIndex].entries.length + 1,
      entry_date: "",
      annotations: [{ number: 1, account_number: 0, credit: "", debit: "" }],
    });
    setSolutions(updatedSolutions);
  };

  const removeEntry = (entryIndex) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries = updatedSolutions[solutionIndex].entries.filter(
      (_, i) => i !== entryIndex
    );
    setSolutions(updatedSolutions);
    console.log("Soluciones actualizadas después de eliminar asiento:", updatedSolutions);
  };

  const removeLastEntry = () => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries.pop();
    setSolutions(updatedSolutions);
  };

  const removeSolution = () => {
    const updatedSolutions = solutions.filter((_, index) => index !== solutionIndex);
    setSolutions(updatedSolutions);
  };

  const calculateTotals = () => {
    const totals = { debit: 0, credit: 0 };
    solution.entries.forEach((entry) => {
      entry.annotations.forEach((annotation) => {
        totals.debit += parseFloat(annotation.debit || 0);
        totals.credit += parseFloat(annotation.credit || 0);
      });
    });
    return totals;
  };

  const totals = calculateTotals();

  return (
    <>
      <div className="statement-page__form-modal--solution">
        <h5>Solución {solutionIndex + 1}:</h5>
        <textarea
          id="solution-description"
          name="description"
          className="statement-page__description"
          value={solution.description}
          onChange={handleSolutionChange}
          placeholder="Descripción de la solución"
          aria-label="Descripción de la solución"
        />
        {/* <button type="button" onClick={removeSolution}>Eliminar Solución</button> */}
      </div>

      {
        solution.entries.map((entry, entryIndex) => (
          <div key={entryIndex} className="SolutionForm__entry_container">
            <div className="SolutionForm__entry_header">
              <div
                className="statement-page__entry-collapse"
                onClick={() => toggleCollapse(entryIndex)}
              >
                <span className="statement-page__entry-title">{`Asiento ${entry.entry_number}`}</span>
                <span className="statement-page__entry-icon">
                  <i className={
                    collapsedEntries[entryIndex]
                      ? "fi fi-rr-angle-small-down"
                      : "fi fi-rr-angle-small-up"
                  }
                  ></i>
                </span>
                <span className="statement-page__entry-date">Fecha: {entry.entry_date || "Sin fecha"}</span>
              </div>
              <button
                type="button"
                className="statement-page__button--remove-entry btn__icon"
                onClick={() => removeEntry(entryIndex)}
              >
                <i className="fi fi-rr-trash"></i>
              </button>
            </div>

            {!collapsedEntries[entryIndex] && (
              <EntryForm
                solutionIndex={solutionIndex}
                entry={entry}
                entryIndex={entryIndex}
                solutions={solutions}
                setSolutions={setSolutions}
              />
            )}

          </div>
        ))}


      <div className="statement-page-modal__actions" >
        <div className="statement-page-modal__actions-buttons" >
          <button type="button" onClick={addEntry} className="btn">
            + Asiento
          </button>
          {/* <button
            type="button"
            className="statement-page__button--remove-entry"
            onClick={removeLastEntry}
          >
            <i className="fi fi-rr-trash"></i>
          </button> */}
        </div>
        <div className="statement-page__totals">
          <span>Total Debe: {totals.debit.toFixed(2)}</span>
          <span>Total Haber: {totals.credit.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
};

export default SolutionForm;