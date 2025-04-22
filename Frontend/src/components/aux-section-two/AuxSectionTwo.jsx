import { useState, useEffect } from "react";
import "./AuxSectionTwo.css"

const AuxSectionTwo = ({ statements, examStarted, onSelectStatement, isTaskActive }) => {
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [visitedStatements, setVisitedStatements] = useState([]);

  const isExamMode = typeof examStarted !== 'undefined';

  useEffect(() => {
    if (statements?.length > 0 && !selectedStatement) {
      setSelectedStatement(statements[0]);
      onSelectStatement(statements[0]);
      setVisitedStatements([statements[0].id]);
    }
  }, [statements]);

  const handleStatementClick = (statement) => {
    if ((isExamMode && !examStarted) || (!isExamMode && !isTaskActive)) return;

    if (!visitedStatements.includes(statement.id)) {
      setVisitedStatements([...visitedStatements, statement.id]);
    }
    setSelectedStatement(statement);
    onSelectStatement(statement);
  };
console.log("EXAM_STARTED", examStarted)
console.log("STATEMENTES", statements)
  return (
    <div className='aux-section_two__container'>
      <h2 className='help_secction_tittle'>Enunciados</h2>
      {examStarted &&
        <div className={`aux-section ${isExamMode ? (examStarted ? '' : 'disabled') : (isTaskActive ? '' : 'disabled')}`}>
          <section>
            <div className="statement-grid">
              {statements && statements.map((statement, index) => {
                const isDisabled = isExamMode ? !examStarted : !isTaskActive;
                let buttonClass = "statement-button";

                if (selectedStatement?.id === statement.id) {
                  buttonClass += " selected";
                } else if (visitedStatements.includes(statement.id)) {
                  buttonClass += " visited";
                }
                if (isDisabled) buttonClass += " disabled";
                
                return (
                  <button
                    key={statement.id}
                    className={buttonClass}
                    onClick={() => handleStatementClick(statement)}
                    disabled={isDisabled}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            {selectedStatement && (
              <div className="statement-detail">
                <h3 className="statement-detail__title">Enunciado {statements.indexOf(selectedStatement) + 1}</h3>
                <div className="statement-detail__content">
                  <p><strong>Definición:</strong> {selectedStatement.definition}</p>
                  <p><strong>Explicación:</strong> {selectedStatement.explanation || "Sin explicación."}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      }
    </div>
  );
};

export default AuxSectionTwo;
