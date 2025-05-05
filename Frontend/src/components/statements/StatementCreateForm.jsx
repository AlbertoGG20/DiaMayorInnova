import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatementForm from "./StatementForm";
import StatementList from "./StatementList";
import SolutionList from "../solution/SolutionList";
import EditSolutionModal from "../modal/EditSolutionModal";
import statementService from "../../services/statementService";
import http from "../../http-common";
import "./StatementPage.css";
import ButtonBack from "../button-back/ButtonBack";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Modal from "../modal/Modal";

const StatementCreateForm = () => {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [prevSolutions, setPrevSolutions] = useState([]); // Ajout de prevSolutions
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [solutionToDeleteIndex, setSolutionToDeleteIndex] = useState(null);
  const [message, setMessage] = useState("");

  // Nouvelle fonction pour rafraîchir les solutions
  const refreshSolutions = async () => {
    if (selectedStatement?.id) {
      try {
        const response = await statementService.getSolutions(selectedStatement.id);
        const fetchedSolutions = response.data.map(solution => ({
          ...solution,
          entries: solution.entries || [],
        }));
        setSolutions(fetchedSolutions);
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des solutions:", error);
        setMessage("Erreur lors du chargement des solutions.");
        setTimeout(() => setMessage(""), 5000);
      }
    }
  };

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
      const initializedSolutions = statement.solutions.map(solution => ({
        ...solution,
        entries: solution.entries || [],
      }));
      setSolutions(initializedSolutions);
      console.log("Soluciones establecidas:", initializedSolutions);
      const solutionsWithAccounts = [...statement.solutions];
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
      setSolutions([]);
    }
  };

  const handleStatementCreated = (updatedStatement) => {
    // console.log("Enunciado actualizado/creado:", updatedStatement);
    setSelectedStatement(updatedStatement);
    setSolutions(updatedStatement.solutions || []);
    setMessage("Enunciado guardado. Ahora puedes añadir soluciones directamente.");
    setTimeout(() => setMessage(""), 5000);
    navigate("/add-statements");
  };

  const handleAddSolution = async () => {
    const newSolution = {
      description: "",
      entries: [{
        entry_number: 1,
        entry_date: "",
        annotations: [{
          number: 1,
          credit: "",
          debit: "",
          account_number: 0,
        }],
      }],
    };

    if (selectedStatement?.id) {
      try {
        const response = await statementService.addSolution(selectedStatement.id, newSolution);
        setSolutions((prevSolutions) => [...prevSolutions, response.data]);
        setMessage("Solución añadida con éxito.");
        setTimeout(() => setMessage(""), 5000);
      } catch (error) {
        console.error("Error al añadir solución:", error);
        setMessage("Error al añadir la solución. Intenta de nuevo.");
        setTimeout(() => setMessage(""), 5000);
      }
    } else {
      setSolutions((prevSolutions) => [...prevSolutions, newSolution]);
      setMessage("Solución añadida localmente. Debes guardar el enunciado para persistirla.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleEditSolution = (index) => {
    setSelectedSolutionIndex(index);
    setModalOpen(true);
  };

  const handleDeleteSolution = async (index) => {
    const solutionToDelete = solutions[index];
    if (solutionToDelete.id) {
      try {
        await statementService.deleteSolution(solutionToDelete.id);
        setSolutions((prevSolutions) => prevSolutions.filter((_, i) => i !== index));
        setMessage("Solución eliminada con éxito.");
        setTimeout(() => setMessage(""), 5000);
      } catch (error) {
        console.error("Error al eliminar solución:", error);
        setMessage("Error al eliminar la solución. Intenta de nuevo.");
        setTimeout(() => setMessage(""), 5000);
      }
    } else {
      setSolutions((prevSolutions) => prevSolutions.filter((_, i) => i !== index));
      setPrevSolutions((prevSolutions) =>
        prevSolutions.map((solution, i) =>
          i === index ? { ...solution, _destroy: true } : solution
        )
      );
      setMessage("Solución eliminada localmente. Debes guardar el enunciado para confirmar.");
      setTimeout(() => setMessage(""), 5000);
    }
    setSolutionToDeleteIndex(null);
  };

  const handleEditStatement = (statement) => {
    setSelectedStatement(statement);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSolutionIndex(null);
  };

  const handleSaveSolution = async (updatedSolution) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[selectedSolutionIndex] = {
      ...updatedSolution,
      entries: updatedSolution.entries?.map(entry => ({
        ...entry,
        annotations: entry.annotations.map(annotation => ({
          ...annotation,
          account_name: annotation.account_name || "",
          account_number: annotation.account_number || 0
        })),
      })) || [],
    };

    if (updatedSolution.id) {
      try {
        await statementService.updateSolution(updatedSolution.id, updatedSolution);
        setSolutions(updatedSolutions);
        setMessage("Solución actualizada con éxito.");
        setTimeout(() => setMessage(""), 5000);
      } catch (error) {
        console.error("Error al actualizar solución:", error);
        setMessage("Error al actualizar la solución. Intenta de nuevo.");
        setTimeout(() => setMessage(""), 5000);
      }
    } else {
      setSolutions(updatedSolutions);
      setMessage("Solución actualizada localmente. Debes guardar el enunciado para persistirla.");
      setTimeout(() => setMessage(""), 5000);
    }
    handleCloseModal();
  };

  return (
    <main className="statement-page">
      <header className="statement-page__header--header">
        <ButtonBack />
        <Breadcrumbs />
      </header>

      {message && (
        <div className={message.includes("Error") ? "error-message" : "success-message"}>
          {message}
        </div>
      )}

      <section className="statement-page__form">
        <StatementForm
          onStatementCreated={handleStatementCreated}
          onAddSolution={handleAddSolution}
          solutions={solutions}
          setSolutions={setSolutions}
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
          refreshSolutions={refreshSolutions}
        />
        {isModalOpen && selectedSolutionIndex !== null && (
          <EditSolutionModal
            solution={solutions[selectedSolutionIndex]}
            solutionIndex={selectedSolutionIndex}
            solutions={solutions}
            setSolutions={setSolutions}
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
