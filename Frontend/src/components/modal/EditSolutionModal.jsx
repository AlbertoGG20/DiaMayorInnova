import React, { useState, useEffect } from "react";
import SolutionForm from "../solution/SolutionForm";
import "./EditSolutionModal.css";

const EditSolutionModal = ({ solution, solutionIndex, solutions, setSolutions, onClose }) => {
  const [editedSolution, setEditedSolution] = useState(solution);

  // Si la solución recibida cambia, actualizamos el estado de editedSolution
  useEffect(() => {
    setEditedSolution(solution);
  }, [solution]);

  const handleSave = () => {
    setSolutions((prevSolutions) => {
      const updatedSolutions = [...prevSolutions];
      updatedSolutions[solutionIndex] = editedSolution;
      return updatedSolutions;
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h4>Editar Solución</h4>
        <SolutionForm
          solution={editedSolution}
          solutionIndex={solutionIndex}
          solutions={solutions}
          setSolutions={setSolutions}
          setEditedSolution={setEditedSolution}
        />
        <div className="modal-buttons__actions">
          <button className="modal-close" onClick={onClose}>
            Cerrar
          </button>
          <button className="modal-save" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSolutionModal;
