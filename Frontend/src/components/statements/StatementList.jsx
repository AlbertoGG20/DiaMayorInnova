import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import statementService from "../../services/statementService";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";
import Table from "../table/Table";
import PaginationMenu from "../pagination-menu/PaginationMenu";
import { SearchBar } from "../search-bar/SearchBar";

const StatementsList = ({ onSelectStatement }) => {
  const { user, loading: authLoading } = useAuth();
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statementToDelete, setStatementToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        setLoading(true);
        const response = await statementService.getAllStatements(currentPage, itemsPerPage, searchTerm);

        if (Array.isArray(response.data.statements)) {
          const filteredStatements = response.data.statements.filter(
            (statement) => statement.is_public || statement.user_id === user?.id
          );
          setStatements(filteredStatements);
          setTotalPages(response.data.meta.total_pages || 1);
        } else {
          console.error("Error: La respuesta no es un arreglo válido.");
        }
      } catch (error) {
        console.error("Error al cargar los enunciados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatements();
  }, [user, currentPage, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await statementService.deleteStatement(id);
      setStatements((prevStatements) =>
        prevStatements.filter((statement) => statement.id !== id)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("No tienes permiso para eliminar este enunciado.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error al eliminar el enunciado.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    }
  };

  const openDeleteModal = (statementId) => {
    const statement = statements.find(s => s.id === statementId);
    setStatementToDelete(statement);
    setIsDeleteModalOpen(true);
  };

  const toggleVisibility = async (id, newVisibility) => {
    try {
      await statementService.updateStatement(id, { is_public: newVisibility });
      setStatements((prevStatements) =>
        prevStatements.map((statement) =>
          statement.id === id
            ? { ...statement, is_public: newVisibility }
            : statement
        )
      );
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage("No puedes cambiar la visibilidad de enunciados ajenos.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      } else {
        setErrorMessage("Error al cambiar visibilidad.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
      console.error("Error al cambiar visibilidad:", error);
    }
  };

  const handleStatementSelection = (statementId) => {
    const statement = statements.find(s => s.id === statementId);
    setSelectedStatement(statement);
    onSelectStatement(statement);
  };

  if (authLoading || !user) {
    return <p>Cargando usuario...</p>;
  }

  if (!statements.length) {
    return <p>No hay enunciados disponibles.</p>;
  }

  const handleStatementCreated = (newStatement) => {
    setStatements((prevStatements) => [...prevStatements, newStatement]);
    setFormVisible(false);
  };

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="statement-page__selection--content">
      <div className="statement-page__row" style={{ display: "flex", gap: "var(--gap-m)", alignItems: "center", width: "100%" }}>
        <h2 className="statement-page__list--header">Enunciados</h2>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <SearchBar
        value={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      <Table
        titles={["Definición", "Acciones"]}
        data={statements.map(statement => ({
          ...statement,
          current_user_id: user.id
        }))}
        actions={true}
        openModal={handleStatementSelection}
        deleteItem={openDeleteModal}
        onToggleVisibility={toggleVisibility}
        columnConfig={[
          { field: 'definition', sortable: true }
        ]}
      />

      <PaginationMenu
        currentPage={currentPage}
        setCurrentPage={changePage}
        totalPages={totalPages}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="¿Estás seguro de que deseas eliminar este enunciado?"
        message={`El enunciado "${statementToDelete?.definition}" será eliminado permanentemente.`}
        onDelete={() => handleDelete(statementToDelete?.id)}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default StatementsList;
