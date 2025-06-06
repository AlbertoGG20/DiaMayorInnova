import React from "react";
import AnnotationForm from "../annotation/AnnotationForm.jsx";
import { getCurrentDate } from "../../utils/dateUtils";

const EntryForm = ({ solutionIndex, entry, entryIndex, solutions, setSolutions }) => {

  const initializeEntryDate = () => {
    if (!entry.entry_date) {
      const updatedSolutions = [...solutions];
      updatedSolutions[solutionIndex].entries[entryIndex].entry_date = getCurrentDate();
      setSolutions(updatedSolutions);
    }
  };

  React.useEffect(() => {
    initializeEntryDate();
  }, []);

  const handleEntryChange = (event) => {
    if (!event.target || !event.target.name) {
      console.error("Error: event.target o event.target.name no están definidos");
      return;
    }
    const { name, value } = event.target;
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex][name] = value;
    setSolutions(updatedSolutions);
  };

  const removeEntry = () => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries = updatedSolutions[solutionIndex].entries.filter(
      (_, i) => i !== entryIndex
    );
    setSolutions(updatedSolutions);
  };

  const addAnnotation = () => {
    const updatedSolutions = [...solutions];
    updatedSolutions[solutionIndex].entries[entryIndex].annotations.push({
      number: updatedSolutions[solutionIndex].entries[entryIndex].annotations.length + 1,
      account_id: "",
      credit: "",
      debit: "",
    });
    setSolutions(updatedSolutions);
  };

  return (
    <div className="statement-page__entry-expanded">
      <div className="statement-page__entry-expanded--date">
        <label className="statement-page__date-label" htmlFor="entry_date">Fecha:</label>
        <input
          id="entry_date"
          type="date"
          name="entry_date"
          value={entry.entry_date || getCurrentDate()}
          onChange={handleEntryChange}
          className="statement-page__date-input"
          required
        />
      </div>

      <div className="statement-page__entry-columns">
        <span>Apt</span>
        <span>N° Cuenta</span>
        <span>Nombre Cuenta</span>
        <span>Debe</span>
        <span>Haber</span>
        <span>Acción</span>
      </div>

      {entry.annotations.map((annotation, annotationIndex) => (
        <AnnotationForm
          key={annotationIndex}
          solutionIndex={solutionIndex}
          entryIndex={entryIndex}
          annotation={annotation}
          annotationIndex={annotationIndex}
          solutions={solutions}
          setSolutions={setSolutions}
        />
      ))}

      <button
        type="button"
        onClick={addAnnotation}
        className="statement-page__button statement-page__button-add"
      >
        + Apunte
      </button>
    </div>
  );
};

export default EntryForm;