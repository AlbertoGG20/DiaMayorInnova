import { useState, useEffect } from "react";
import statementService from "../services/statementService";

const useStatements = () => {
  const [statements, setStatements] = useState([]);
  const [allStatements, setAllStatements] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Paginated list
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        setLoading(true);
        const response = await statementService.getAllStatements(currentPage, 10);
        setStatements(response.data.statements);
        setTotalPages(response.data?.meta?.total_pages || 1);

        setAllStatements((prev) => {
          const newStatements = response.data.statements.filter(
            (s) => !prev.some((prevS) => prevS.id === s.id)
          );
          return [...prev, ...newStatements];
        });
      } catch (error) {
        console.error("Error al cargar los enunciados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatements();
  }, [currentPage]);

  //All list
  useEffect(() => {
    const fetchAllStatements = async () => {
      try {
        let allFetchedStatements = [];
        let page = 1;
        let totalPages = 1;
  
        while (page <= totalPages) {
          const response = await statementService.getAllStatements(page, 10);
          allFetchedStatements = [...allFetchedStatements, ...response.data.statements];
  
          totalPages = response.data?.meta?.total_pages || 1;
          page++;
        }
  
        setAllStatements(allFetchedStatements);
      } catch (error) {
        console.error("Error al cargar todos los enunciados:", error);
      }
    };
  
    fetchAllStatements();
  }, []);

  const handleEditSolutions = (statementId) => {
    if (editMode === statementId) {
      setEditMode(null);
    } else {
      setEditMode(statementId);
    }
  };

  return {
    statements,
    solutions,
    editMode,
    loading,
    currentPage,
    totalPages,
    setCurrentPage,
    handleEditSolutions,
    allStatements
  };
};

export default useStatements;
