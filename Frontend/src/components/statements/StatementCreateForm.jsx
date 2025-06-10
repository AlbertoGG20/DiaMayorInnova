import { useState, useRef } from "react";
import statementService from "../../services/statementService";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import ButtonBack from "../button-back/ButtonBack";
import EditSolutionModal from "../modal/EditSolutionModal";
import SolutionList from "../solution/SolutionList";
import StatementForm from "./StatementForm";
import StatementList from "./StatementList";
import "./StatementPage.css";

const StatementCreateForm = () => {
  const statementListRef = useRef();
  const [solutions, setSolutions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [solutionToDeleteIndex, setSolutionToDeleteIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(undefined);

  const showMessage = (text, isError = undefined) => {
    setIsError(isError);
    setMessage(text);
    setTimeout(() => setMessage(""), 5000);
  };

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
        console.error("Error refreshing solutions:", error);
        showMessage("Error al cargar soluciones.", true);
      }
    }
  };

  const normalizeSolution = (solution) => ({
    ...solution,
    entries: solution.entries?.map(entry => ({
      ...entry,
      annotations: entry.annotations?.map(annotation => ({
        ...annotation,
        account_name: annotation.account_name || "",
        account_id: annotation.account_id
      })) || [],
    })) || [],
  });

  const handleSelectStatement = async (statement) => {
    setSelectedStatement(statement);
    setSolutions(statement?.solutions?.map(normalizeSolution) || []);
  };

  const handleStatementCreated = () => {
    // Reset states
    setSelectedStatement(null);
    setSolutions([]);
    showMessage("Enunciado guardado correctamente.");

    // Update list
    if (statementListRef.current) {
      statementListRef.current.refreshList();
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
        showMessage("Solución eliminada con éxito.");
      } catch (error) {
        console.error("Error deleting solution:", error);
        showMessage("Error al eliminar la solución. Intenta de nuevo.", true);
      }
    } else {
      setSolutions((prevSolutions) => prevSolutions.filter((_, i) => i !== index));
      showMessage("Solución eliminada localmente. Debes guardar el enunciado para confirmar.");
    }
    setSolutionToDeleteIndex(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSolutionIndex(null);
  };

  const handleSaveSolution = async (updatedSolution) => {
    const updatedSolutions = [...solutions];
    updatedSolutions[selectedSolutionIndex] = normalizeSolution(updatedSolution);

    if (updatedSolution.id) {
      try {
        await statementService.updateSolution(updatedSolution.id, updatedSolution);
        setSolutions(updatedSolutions);
        showMessage("Solución actualizada con éxito.");
      } catch (error) {
        console.error("Error updating solution:", error);
        showMessage("Error al actualizar la solución. Intenta de nuevo.", true);
      }
    } else {
      setSolutions(updatedSolutions);
      showMessage("Solución actualizada localmente. Debes guardar el enunciado para persistirla.");
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
        <div className={isError ? "error-message" : "success-message"}>
          {message}
        </div>
      )}

      <section className="statement-page__form">
        <StatementForm
          onStatementCreated={handleStatementCreated}
          solutions={solutions}
          setSolutions={setSolutions}
          statement={selectedStatement}
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
        {isModalOpen && solutions[selectedSolutionIndex] && (
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
        <StatementList
          ref={statementListRef}
          onSelectStatement={handleSelectStatement}
          onStatementCreated={handleStatementCreated}
        />
      </section>
    </main>
  );
};

export default StatementCreateForm;