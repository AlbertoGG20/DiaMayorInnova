import React, { useEffect, useRef, useState } from "react";
import SolutionsViewer from "../solution/SolutionsViewer";
import statementService from "../../services/statementService";
import "./TaskPage.css";
import useStatements from "../../hooks/useStatements";
import { SearchBar } from "../search-bar/SearchBar";
import Table from "../table/Table";
import { useNavigate } from "react-router-dom";
import PaginationMenu from "../pagination-menu/PaginationMenu";

const StatementsSelection = ({
  selectedStatements,
  handleStatementSelection,
  showCheckboxes = true,
}) => {
  const [currentSolutions, setCurrentSolutions] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatementId, setSelectedStatementId] = useState(null);
  const { statements, solutions, currentPage, totalPages, setCurrentPage, allStatements } = useStatements();
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [localPage, setLocalPage] = useState(1);

  const isSearching = searchTerm.trim().length > 0;

  const filteredStatements = isSearching
    ? allStatements.filter(statement =>
      statement.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : statements;

  const totalLocalPages = Math.ceil(filteredStatements.length / itemsPerPage);

  useEffect(() => {
    setLocalPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (localPage > totalLocalPages) {
      setLocalPage(1);
    }
  }, [totalLocalPages]);

  const startIdx = (localPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedStatements = filteredStatements.slice(startIdx, endIdx);

  const viewSolutions = (statementId) => {
    if (solutions[statementId]) {
      setCurrentSolutions(solutions[statementId]);
      setSelectedStatementId(statementId);
      setIsModalOpen(true);
    } else {
      setLoading(true);
      statementService.getSolutions(statementId)
        .then(response => {
          setCurrentSolutions(response.data);
          setSelectedStatementId(statementId);
          setIsModalOpen(true);
        })
        .catch(error => {
          console.error("Error al cargar soluciones:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const hideSolutions = () => {
    setIsModalOpen(false);
    setCurrentSolutions([]);
  };

  if (!Array.isArray(statements)) {
    return <div>Error: No se recibieron enunciados válidos</div>;
  }

  return (
    <section className="task-page__selection">
      <div className="task-page__selection--content">
        <div className="task-page__header-row">
          <h2 className="task-page__header">Enunciados</h2>
        </div>
        <SearchBar
          value={searchTerm}
          handleSearchChange={setSearchTerm}
        />

        <Table
          titles={["Enunciado", "Acciones"]}
          data={paginatedStatements}
          actions={true}
          show={viewSolutions}
          columnConfig={[
            { field: 'definition', sortable: true }
          ]}
          showCheckboxes={showCheckboxes}
          selectedItems={selectedStatements}
          onItemSelection={handleStatementSelection}
        />

        <PaginationMenu
          currentPage={isSearching ? localPage : currentPage}
          setCurrentPage={isSearching ? setLocalPage : setCurrentPage}
          totalPages={isSearching ? totalLocalPages : totalPages}
        />

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <section className="modal-solutionViewer__container">
                <div className="modal-solutionViewer__statement-content">
                  <div className="modal-solutionViewer__head">
                    <h3 className="modal-solutionViewer__statement-title">Enunciado</h3>
                    <button className="btn light" onClick={hideSolutions}>X</button>
                  </div>
                  <div className="modal-solutionViewer__statement-info">
                    <span>{statements.find(statement => statement.id === selectedStatementId)?.definition}</span>
                  </div>
                </div>
                <SolutionsViewer solutions={currentSolutions} />
              </section>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StatementsSelection;
