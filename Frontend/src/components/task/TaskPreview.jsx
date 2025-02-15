import React from "react";
import "./TaskPage.css";

const TaskPreview = ({ 
  title, 
  openingDate, 
  closingDate, 
  statements, 
  selectedStatements, 
  handleRemoveStatement,
  additionalInformation,
  isExam
}) => {

  const validSelectedStatements = selectedStatements.filter((statementId) =>
    statements.some((s) => s.id === statementId)
  );


  return (
    <section className="task-page__preview">
      <div className="task-page__preview--content">
        <h2 className="task-page__header--h2">Título: {title}</h2>
        <div className="task-page__dates-container">
          <p>
            <strong>Fecha de apertura:</strong>{" "}
            {new Date(openingDate).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}
          </p>
          <p>
            <strong>Fecha de cierre:</strong>{" "}
            {new Date(closingDate).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit', })}
          </p>
          <p><strong>Información adicional:</strong> {additionalInformation || "No se ha añadido información adicional."}</p>
          <p><strong>¿Es un examen?</strong> {isExam ? "Sí" : "No"}</p>
        </div>
        {validSelectedStatements.length > 0 ? (
          <ul className="task-page__list">
            {validSelectedStatements.map((statementId) => {
              const statement = statements.find((s) => s.id === statementId);

              if (!statement) {
                console.warn(`No se encontró un enunciado con el ID: ${statementId}`);
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
                    <span className="task-page__button-text">Borrar</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <span>No se han seleccionado enunciados.</span>
        )}
      </div>
    </section>
  );
};

export default TaskPreview;
