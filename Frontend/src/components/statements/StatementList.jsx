import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import statementService from "../../services/statementService";
import ConfirmDeleteModal from "../modal/ConfirmDeleteModal";

const StatementsList = ({ onSelectStatement }) => {
  const { user, loading: authLoading } = useAuth();
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statementToDelete, setStatementToDelete] = useState(null);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        setLoading(true);
        const response = await statementService.getAllStatements();

        console.log("Datos de enunciados obtenidos:", response.data);
        if (Array.isArray(response.data)) {
          const filteredStatements = response.data.filter(
            (statement) => statement.is_public || statement.user_id === user?.id
          );
          setStatements(filteredStatements);
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
  }, [user]);

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

  const openDeleteModal = (statement) => {
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

  const handleStatementSelection = (statement) => {
    setSelectedStatement(statement);
    onSelectStatement(statement);
  };

  if (authLoading || !user) {
    return <p>Cargando usuario...</p>;
  }

  if (loading) {
    return <p>Cargando enunciados...</p>;
  }

  if (!statements.length) {
    return <p>No hay enunciados disponibles.</p>;
  }

  const handleStatementCreated = (newStatement) => {
    console.log("Nuevo enunciado creado:", newStatement);
    setStatements((prevStatements) => [...prevStatements, newStatement]);
    setFormVisible(false);
  };

  return (
    <div className="statement-page__selection--content">
      <h3 className="statement-page__list--header">Enunciados</h3>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <ul className="statement-page__list">
        {statements.map((statement) => {
          const isPublicAndNotOwned = statement.is_public && statement.user_id !== user.id;

          return (
            <li className="statement-page__list-item" key={statement.id}>
              <div className="statement-page__statement-container">
                <span className="statement-page__definition">{statement.definition}</span>
                <div className="statement-page__actions">
                  <button
                    onClick={() => openDeleteModal(statement)}
                    className={`statement-page__button--delete ${isPublicAndNotOwned ? "disabled" : ""}`}
                    disabled={isPublicAndNotOwned}
                  >
                    <i className="fi-rr-trash"></i>
                    <span className="statement-page__button-text--delete">Borrar</span>
                  </button>
                  <button
                    onClick={() => handleStatementSelection(statement)}
                    className={`statement-page__button--edit ${isPublicAndNotOwned ? "disabled" : ""}`}
                    disabled={isPublicAndNotOwned}
                  >
                    <i className="fi-rr-pencil"></i>
                    <span className="statement-page__button-text">Editar</span>
                  </button>
                  <div className="statement-page__toggle-visibility">
                    <button
                      onClick={() => toggleVisibility(statement.id, false)} // Cambiar a "Privado"
                      className={`toggle-option ${!statement.is_public ? "active" : ""}`}
                      disabled={isPublicAndNotOwned} // Deshabilitar si es público y no es del usuario
                    >
                      Privado
                    </button>
                    <button
                      onClick={() => toggleVisibility(statement.id, true)}
                      className={`toggle-option ${statement.is_public ? "active" : ""}`}
                      disabled={isPublicAndNotOwned}
                    >
                      Público
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
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
