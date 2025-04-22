import React, { useState, useEffect } from "react";
import SolutionForm from "../solution/SolutionForm";
import "./EditSolutionModal.css";

const EditSolutionModal = ({ solution, solutionIndex, solutions, setSolutions, onClose }) => {
  const [editedSolution, setEditedSolution] = useState(solution);
  console.log("editsolutionmodal", solutionIndex)

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
