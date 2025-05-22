import React, { useState } from "react";
import SolutionForm from "./SolutionForm.jsx";
import solutionService from "../../services/solutionService";

const SolutionList = ({ solutions, onEditSolution, onDeleteSolution, solutionToDeleteIndex, refreshSolutions }) => {
  const [isToggling, setIsToggling] = useState(null); // État pour suivre la solution en cours de bascule

  const handleToggleExample = async (solutionId, isCurrentlyExample) => {
    if (isToggling === solutionId) return;
    setIsToggling(solutionId);

    try {
      const solution = solutions.find(s => s.id === solutionId);
      if (!solution) {
        throw new Error("No se encontró la solución");
      }

      if (isCurrentlyExample) {
        await solutionService.unmarkAsExample(solutionId);
      } else {
        // Primero actualizamos la solución con sus datos actuales
        const solutionData = {
          description: solution.description,
          entries_attributes: solution.entries.map(entry => ({
            id: entry.id,
            entry_number: entry.entry_number,
            entry_date: entry.entry_date,
            annotations_attributes: entry.annotations.map(annotation => ({
              id: annotation.id,
              number: annotation.number,
              credit: annotation.credit,
              debit: annotation.debit,
              account_id: annotation.account_id
            }))
          }))
        };

        await solutionService.updateSolution(solutionId, solutionData);

        // Luego la marcamos como ejemplo
        await solutionService.markAsExample(solutionId, {
          creditMoves: "0",
          debitMoves: "0",
          account_id: 42,
          solution: solutionData
        });
      }
      
      // Refrescamos las soluciones después de la actualización
      await refreshSolutions();
    } catch (error) {
      console.error("Error detallado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(error.response?.data?.message || error.message || "Ocurrió un error al procesar la solicitud");
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

      <style jsx>{`
        .help-example-indicator {
          color: #28a745;
          margin-right: 6px;
          font-size: 1.2em;
          vertical-align: middle;
        }
        .button-example-active {
          color: #28a745;
          font-weight: bold;
        }
      `}</style>
      
    </div>
  );
};

export default SolutionList;
