import React from "react";
import SolutionForm from "./SolutionForm.jsx";
import Modal from "../modal/Modal.jsx";
import EditSolutionModal from "../modal/EditSolutionModal.jsx";

const SolutionList = ({ solutions, onEditSolution, onDeleteSolution, solutionToDeleteIndex, solutionIndex, setSolutions, onSave, onClose, solution }) => {
  console.log(solutionIndex, " solution list")

  const handleSave = () => {
    setSolutions((prevSolutions) => {
      const updatedSolutions = [...prevSolutions];
      updatedSolutions[solutionIndex] = editedSolution;
      console.log('BBBB', updatedSolutions);
      return updatedSolutions;
    });
    onClose();
  };
  return (
    <>
      <h3 className="statement-page__solutions-header">Soluciones del Enunciado</h3>
      <ul className="statement-page__list">
        {solutions.map((solution, index) => (
          <li key={index} className={`statement-page__list-item ${solutionToDeleteIndex === index ? 'statement-page__list-item--deleting' : ''}`}>
            <div className="statement-page__statement-container">
              <h4 className="statement-page__definition-solution">{`Solución ${index + 1}`}</h4>
            </div>
            <div className="statement-page__actions">
              <Modal
                saveBtn={true}
                btnNoBg={true}
                btnText={<i className="fi fi-rr-pencil"></i>}
                modalTitle="Editar Solución"
                auxFunction={handleSave}
              >
                <EditSolutionModal
                  solution={solution}
                  solutionIndex={index}
                  solutions={solutions}
                  setSolutions={setSolutions}
                  onClose={onClose}
                  onSave={onSave}
                />
              </Modal>
              <button onClick={() => onDeleteSolution(index)} className="statement-page__button-text--delete btn__icon"><i className="fi fi-rr-trash"></i></button>
            </div>
          </li>
        ))}
        {
          (solutions.length < 1) ?
            <div className="statement-page__list--empty">
              <p>No se han Añadido soluciones.</p>
            </div>
            : null
        }
      </ul>
    </>
  );
};

export default SolutionList;
