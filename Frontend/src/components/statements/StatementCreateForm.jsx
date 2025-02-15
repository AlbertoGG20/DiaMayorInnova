import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatementForm from "./StatementForm";
import StatementList from "./StatementList";
import SolutionList from "../solution/SolutionList";
import EditSolutionModal from "../modal/EditSolutionModal";
import "./StatementPage.css";

const StatementCreateForm = () => {
  const navigate = useNavigate();
  const [solutions, setPrevSolutions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [statements, setStatements] = useState([]);
  const [solutionToDeleteIndex, setSolutionToDeleteIndex] = useState(null);

  const handleSelectStatement = (statement) => {
    setSelectedStatement(statement);
    console.log("Enunciado seleccionado:", statement);
    if (statement && statement.solutions) {
      setPrevSolutions(statement.solutions);
      console.log("Soluciones establecidas:", statement.solutions);
    } else {
      setPrevSolutions([]);
    }
  };

  const handleStatementCreated = (updatedStatement) => {
    console.log("Enunciado actualizado/creado:", updatedStatement);
    if (updatedStatement.id === selectedStatement?.id) {
      setSelectedStatement(updatedStatement);
      navigate("/add-statements");
    } else {
      navigate("/add-statements");
    }
  };

  const handleAddSolution = () => {
    const newSolution = {
      description: "",
      entries: [{
        entry_number: 1, entry_date: "", annotations: [{
          number: 1,
          credit: "",
          debit: "",
          account_number: 0,
        },]
      }],
    };
    setPrevSolutions((prevSolutions) => {
      const updatedSolutions = [...prevSolutions, newSolution];
      console.log("Soluciones actualizadas:", updatedSolutions);
      return updatedSolutions;
    });
  };

  const handleEditSolution = (index) => {
    setSelectedSolutionIndex(index);
    setModalOpen(true);
  };

  const handleEditStatement = (statement) => {
    setSelectedStatement(statement);
    console.log("Enunciado seleccionado:", statement);
  };

  const handleDeleteSolution = (index) => {
    setSolutionToDeleteIndex(index);
    setPrevSolutions((prevSolutions) => 
      prevSolutions.map((solution, i) =>
        i === index ? { ...solution, _destroy: true } : solution
      )
    );
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSolutionIndex(null);
  };

  const handleSaveSolution = (updatedSolution) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[selectedSolutionIndex] = {
      ...updatedSolution,
      entries: updatedSolution.entries.map(entry => ({
        ...entry,
        annotations: entry.annotations.map(annotation => ({
          ...annotation,
        })),
      })),
    };
    setPrevSolutions(updatedSolutions);
    handleCloseModal();
  };

  return (
    <main className="statement-page">
      <header className="statement-page__header--header">
        <button className="btn light" onClick={() => navigate("/home")}>
          <i className="fi fi-rr-arrow-small-left"></i>
          Volver
        </button>
        <h1 className="statement-title">Creación de Enunciado</h1>
      </header>

      <section className="statement-page__form">
        <StatementForm
          onStatementCreated={handleStatementCreated}
          onAddSolution={handleAddSolution}
          solutions={solutions}
          setSolutions={setPrevSolutions}
          onSaveSolution={handleSaveSolution}
          statement={selectedStatement}
          onDeleteSolution={handleDeleteSolution}
        />
      </section>

      <aside className="statement-page__solutions">
        <SolutionList
          solutions={solutions}
          onEditSolution={handleEditSolution}
          onDeleteSolution={handleDeleteSolution}
          solutionToDeleteIndex={solutionToDeleteIndex}
        />
        {isModalOpen && selectedSolutionIndex !== null && (
          <EditSolutionModal
            solution={solutions[selectedSolutionIndex]}
            solutionIndex={selectedSolutionIndex}
            solutions={solutions}
            setSolutions={setPrevSolutions}
            onClose={handleCloseModal}
            onSave={handleSaveSolution}
          />
        )}
      </aside>

      <section className="statement-page__selection">
        <StatementList onSelectStatement={handleSelectStatement} />
      </section>
    </main>
  );
};

export default StatementCreateForm;
