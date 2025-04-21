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

  console.log("Solución editada:", editedSolution);
  console.log("Índice de la solución editada:", solutionIndex);
  console.log("Soluciones antes de guardar:", solutions);
  console.log("Soluciones después de guardar:", solutions);

  return (
    <SolutionForm
      solution={editedSolution}
      solutionIndex={solutionIndex}
      solutions={solutions}
      setSolutions={setSolutions}
      setEditedSolution={setEditedSolution}
    />
  );
};

export default EditSolutionModal;
