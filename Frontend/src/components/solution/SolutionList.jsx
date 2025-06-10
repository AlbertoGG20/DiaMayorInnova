import { useState } from "react";
import solutionService from "../../services/solutionService";
import "./SolutionList.css";

const SolutionList = ({ solutions, onEditSolution, onDeleteSolution, solutionToDeleteIndex, refreshSolutions }) => {
  // Status to track the solution being changed
  const [isToggling, setIsToggling] = useState(null);

  const handleToggleExample = async (solutionId, isCurrentlyExample) => {
    if (isToggling === solutionId) return;
    setIsToggling(solutionId);

    try {
      const solution = solutions.find(s => s.id === solutionId);
      if (!solution) throw new Error("No se encontró la solución");
      const accountId = solution.entries?.[0]?.annotations?.[0]?.account_id;
      if (!accountId) throw new Error("No se encontró el asiento contable asociado a la solución");

      const statementId = solution.statement_id;

      if (isCurrentlyExample) {
        await solutionService.unmarkAsExample(statementId, solutionId);
      } else {
        // Send only the necessary data to mark as example
        await solutionService.markAsExample(statementId, solutionId, {
          account_id: accountId,
        });
      }

      await refreshSolutions();
    } catch (error) {
      console.error("Error details:", {
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
          <li key={solution.id} className={`statement-page__list-item ${solutionToDeleteIndex === index ? 'statement-page__list-item--deleting' : ''}`}>
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
                disabled={isToggling === solution.id} // Disables the button during processing
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
