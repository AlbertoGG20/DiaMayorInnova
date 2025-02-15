import React from "react";

const SolutionsViewer = ({ solutions }) => {
  if (!solutions || solutions.length === 0) {
    return <p>No hay soluciones disponibles.</p>;
  }

  return (
    <div className="modal-solutionViewer__solution-content">
      <ul className="modal-solutionViewer__solution-items">
        {solutions.map((solution, index) => (
          <li key={solution.id} className="modal-solutionViewer__solution-item">
            <h4 className="modal-solutionViewer__solution--subtitle">
              Solución {index + 1}:
            </h4>
            <span className="modal-solutionViewer__solution-item--description">
              <strong>Descripción:</strong> {solution.description}
            </span>
            <ul className="modal-solutionViewer__entry-items">

            {solution.entries.map((entry) => {
                const totalDebit = entry.annotations.reduce(
                  (sum, annotation) => sum + (parseFloat(annotation.debit) || 0),
                  0
                );
                const totalCredit = entry.annotations.reduce(
                  (sum, annotation) => sum + (parseFloat(annotation.credit) || 0),
                  0
                );

                return (
                  <li key={entry.id} className="modal-solutionViewer__entry-item">
                    <div className="modal-solutionViewer__entry-item--info">
                      <span>
                        <strong>Asiento:</strong> {entry.entry_number}
                      </span>
                      <span>
                        <strong>Fecha:</strong> {entry.entry_date}
                      </span>
                  </div>
                  <ul className="modal-solutionViewer__annotation-items">
                    <div className="modal-solutionViewer__annotation-items-title">
                      <span className="annotation-items--header">
                        <strong>Apunte</strong>
                      </span>
                      <span className="annotation-items--header">
                        <strong>Nº de Cuenta</strong>
                      </span>
                      <span className="annotation-items--header">
                        <strong>Nombre Cuenta</strong>
                      </span>
                      <span className="annotation-items--header">
                        <strong>Debe</strong>
                      </span>
                      <span className="annotation-items--header">
                        <strong>Haber</strong>
                      </span>
                    </div>
                    {entry.annotations.map((annotation) => (
                      <li key={annotation.id} className="modal-solutionViewer__annotation-item">
                        <span className="annotation-item--item">{annotation.number}</span> 
                        <span className="annotation-item--item">{annotation.account.account_number}</span> 
                        <span className="annotation-item--item">{annotation.account_name}</span> 
                        <span className="annotation-item--item">{annotation.debit || "0,0"} €</span>
                        <span className="annotation-item--item">{annotation.credit || "0,0"} €</span> 
                      </li>
                    ))}
                    <li className="modal-solutionViewer__annotation-item total-row">
                        <span className="annotation-item--item empty"></span>
                        <span className="annotation-item--item empty"></span>
                        <span className="annotation-item--item total-label">
                          <strong>Total:</strong>
                        </span>
                        <span className="annotation-item--item total-debit">
                        <strong>{totalDebit.toFixed(2)} €</strong>
                        </span>
                        <span className="annotation-item--item total-credit">
                        <strong>{totalCredit.toFixed(2)} €</strong>
                        </span>
                      </li>
                  </ul>
                </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolutionsViewer;
