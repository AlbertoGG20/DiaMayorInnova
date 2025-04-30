import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatementForm from "./StatementForm";
import StatementList from "./StatementList";
import SolutionList from "../solution/SolutionList";
import EditSolutionModal from "../modal/EditSolutionModal";
import http from "../../http-common";
import "./StatementPage.css";
import ButtonBack from "../button-back/ButtonBack";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Modal from "../modal/Modal";

const StatementCreateForm = () => {
  const navigate = useNavigate();
  const [solutions, setPrevSolutions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [refreshStatements, setRefreshStatements] = useState(false);
  const [statements, setStatements] = useState([]);
  const [solutionToDeleteIndex, setSolutionToDeleteIndex] = useState(null);

  const getAccountName = async (accountId) => {
    try {
      const response = await http.get(`/accounts/${accountId}`);
      return response.data.name;
    } catch (error) {
      console.error("Error al obtener el nombre de la cuenta:", error);
      return "";
    }
  };

  const handleSelectStatement = async (statement) => {
    setSelectedStatement(statement);
    if (statement && statement.solutions) {
      // Creamos una copia de las soluciones para no modificar el objeto original
      const solutionsWithAccounts = [...statement.solutions];
      
      // Para cada solución, actualizamos los nombres de las cuentas
      for (let solution of solutionsWithAccounts) {
        for (let entry of solution.entries) {
          for (let annotation of entry.annotations) {
            if (annotation.account_id) {
              annotation.account_name = await getAccountName(annotation.account_id);
            }
          }
        }
      }
      
      setPrevSolutions(solutionsWithAccounts);
    } else {
      setPrevSolutions([]);
    }
  };

  const handleStatementCreated = (updatedStatement) => {
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
      return updatedSolutions;
    });
  };

  const handleEditSolution = (index) => {
    setSelectedSolutionIndex(index);
    setModalOpen(true);
  };

  const handleEditStatement = (statement) => {
    setSelectedStatement(statement);
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
          account_name: annotation.account_name || "",
          account_number: annotation.account_number || 0
        })),
      })),
    };
    setPrevSolutions(updatedSolutions);
    handleCloseModal();
  };

  return (
    <main className="statement-page">
      <header className="statement-page__header--header">
        <ButtonBack />
        <Breadcrumbs />
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
