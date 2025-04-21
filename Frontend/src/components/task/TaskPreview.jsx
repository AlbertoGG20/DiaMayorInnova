import React from "react";
import "./TaskPage.css";
import useStatements from "../../hooks/useStatements";

const TaskPreview = ({
  title,
  openingDate,
  closingDate,
  selectedStatements,
  handleRemoveStatement,
  additionalInformation,
  isExam,
  isHelpAvailable,
}) => {

  const { allStatements } = useStatements();

  const validSelectedStatements = selectedStatements.map((statementId) =>
    allStatements.find((s) => s.id === statementId) || { id: statementId, definition: "Cargando..." }
  );

  return (
    <section className="task-page__preview">
      <div className="task-page__preview--content">
        <h2 className="task-page__header--h2">{title}</h2>
        <div className="task-page__dates-container">
          <div className="task-page__dates--date-wrapper">
            <p>
              <strong>Fecha de apertura:</strong>{" "}
              {new Date(openingDate).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}
            </p>
            <p>
              <strong>Fecha de cierre:</strong>{" "}
              {new Date(closingDate).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}
            </p>
          </div>
          {additionalInformation &&
            <p><strong>Información adicional:</strong> {additionalInformation || "No se ha añadido información adicional."}</p>}
          <div className="task-page__checkbox--container">
            <p><strong>Examen:</strong> {isExam ? "Sí" : "No"}</p>
            <p><strong>Ayuda disponible:</strong> {isHelpAvailable ? "Sí" : "No"}</p>
          </div>
        </div>
        {validSelectedStatements.length > 0 ? (
          <ul className="task-page__list">
            {validSelectedStatements.map((statement) => {


              if (!statement) {
                console.warn(`No se encontró un enunciado con el ID: ${statement.id}`);
                return null;
              }

              return (
                <li className="task-page__list-item" key={statement.id}>
                  <span>{statement.definition}</span>
                  <button
                    type="button"
                    className="task-page__button--remove"
                    onClick={() => handleRemoveStatement(statement.id)}
                  >
                    <i className="fi fi-rr-trash trash"></i>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="task-page__no-statement">
            <span >No se han seleccionado enunciados.</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskPreview;
