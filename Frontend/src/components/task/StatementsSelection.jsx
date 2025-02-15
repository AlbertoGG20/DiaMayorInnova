import React, { useState } from "react";
import SolutionsViewer from "../solution/SolutionsViewer";
import statementService from "../../services/statementService";
import "./TaskPage.css";

const StatementsSelection = ({
  statements,
  selectedStatements,
  handleStatementSelection,
  handleEditSolutions,
  solutions,
  editMode,
  showCheckboxes = true,
}) => {
  const [currentSolutions, setCurrentSolutions] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState(null);

  const viewSolutions = (statementId) => {
    console.log("ID del enunciado:", statementId);
    if (solutions[statementId]) {
      console.log("Soluciones ya cargadas:", solutions[statementId]);
      setCurrentSolutions(solutions[statementId]);
      setSelectedStatementId(statementId);
      setIsModalOpen(true);
    } else {
      console.log("Soluciones no cargadas. Realizando solicitud...");
      setLoading(true);
      statementService.getSolutions(statementId)
        .then(response => {
          console.log("Soluciones cargadas:", response.data);
          setCurrentSolutions(response.data);
          setSelectedStatementId(statementId);
          setIsModalOpen(true);
        })
        .catch(error => {
          console.error("Error al cargar soluciones:", error);

        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const hideSolutions = () => {
    setIsModalOpen(false);
    setCurrentSolutions([]);
  };

  if (!Array.isArray(statements)) {
    return <div>Error: No se recibieron enunciados válidos</div>;
  }

  return (
    <section className="task-page__selection">
      <div className="task-page__selection--content">
        <h2 className="task-page__header">Enunciados</h2>
        <ul className="task-page__list">
          {statements.map((statement) => (
            <li className="task-page__list-item" key={statement.id}>
              <div className="task-page__statement-container">
                <span className="task-page__statement">{statement.definition}</span>
                <div className="task-page__actions">
                  {showCheckboxes && (
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedStatements.includes(statement.id)}
                        onChange={() => handleStatementSelection(statement)}
                      />
                      <span className="task-page__button-text">Añadir</span>
                    </label>
                  )}
                  <button className="task-page__button--edit" type="button" onClick={() => viewSolutions(statement.id)}>
                    <i className="fi fi-rr-interrogation interrogation"></i>
                    <span className="task-page__button-text">Ver Soluciones</span>
                  </button>
                  <button className="task-page__button--edit" type="button" onClick={() => handleEditSolutions(statement.id)}>
                    <i className="fi fi-rr-pencil pencil"></i>
                    <span className="task-page__button-text">{editMode === statement.id ? "Cancelar Edición" : "Editar Soluciones"}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <section className="modal-solutionViewer__container">
                <div className="modal-solutionViewer__statement-content">
                  <div className="modal-solutionViewer__head">
                    <h3 className="modal-solutionViewer__statement-title">Enunciado</h3>
                    <button className="btn light" onClick={hideSolutions}>X</button>
                  </div>
                  <div className="modal-solutionViewer__statement-info">
                    <span>{statements.find(statement => statement.id === selectedStatementId)?.definition}</span>
                  </div>
                </div>
                <SolutionsViewer solutions={currentSolutions} />
              </section>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatementsSelection;
