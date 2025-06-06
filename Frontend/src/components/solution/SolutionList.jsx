import React, { useState } from "react";
import SolutionForm from "./SolutionForm.jsx";
import solutionService from "../../services/solutionService";
import "./SolutionList.css";

const SolutionList = ({ solutions, onEditSolution, onDeleteSolution, solutionToDeleteIndex, refreshSolutions }) => {
  const [isToggling, setIsToggling] = useState(null); // État pour suivre la solution en cours de bascule

  const handleToggleExample = async (solutionId, isCurrentlyExample) => {
    if (isToggling === solutionId) return;
    setIsToggling(solutionId);

    try {
      const solution = solutions.find(s => s.id === solutionId);
      if (!solution) throw new Error("No se encontró la solución");

      const statementId = solution.statement_id;

      if (isCurrentlyExample) {
        await solutionService.unmarkAsExample(statementId, solutionId);
      } else {
        // Envía solo los datos necesarios para marcar como ejemplo
        await solutionService.markAsExample(statementId, solutionId, {
          account_id: solution.entries[0]?.annotations[0]?.account_id || 42
          // creditMoves y debitMoves probablemente no son necesarios
        });
      }

      await refreshSolutions();
    } catch (error) {
      console.error("Detalles del error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      const errorMessage = error.response?.data?.errors?.join('\n') ||
        error.response?.data?.message ||
        "Error al actualizar el estado de ejemplo";
      alert(errorMessage);
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <div className="statement-page__solutions">
      <h3 className="statement-page__solutions-header">Soluciones del Enunciado</h3>
      <ul className="statement-page__list">
        {solutions.map((solution, index) => (
          <li key={index} className={`statement-page__list-item ${solutionToDeleteIndex === index ? 'statement-page__list-item--deleting' : ''}`}>
            <div className="statement-page__statement-container">
              <h4 className="statement-page__definition-solution">
                {`Solución ${index + 1}`}
                {solution.is_example && (
                  <span className="help-example-indicator" title="Ejemplo de ayuda">

                  </span>
                )}
              </h4>
            </div>
            <div className="statement-page__actions">
              <button onClick={() => onEditSolution(index)} className="statement-page__button-text">
                Editar
              </button>

              <button
                onClick={() => handleToggleExample(solution.id, solution.is_example)}
                className={`statement-page__button-text ${solution.is_example ? 'button-example-active' : ''}`}
                disabled={isToggling === solution.id} // Désactive le bouton pendant le traitement
              >
                {solution.is_example ? (
                  <>
                    <span className="help-example-indicator">●</span> Desmarcar ejemplo
                  </>
                ) : (
                  "Marcar como ejemplo"
                )}
              </button>
              <button onClick={() => onDeleteSolution(index)} className="statement-page__button-text--delete">
                <i className="fi fi-rr-trash"></i>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolutionList;
