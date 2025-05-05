import http from "../http-common";

// Obtiene todos los enunciados
const getAllStatements = async (page = 1, perPage = 10, search = "") => {
  try {
    const response = await http.get("/statements", {
      params: { page, per_page: perPage, search},
    });
    return response;
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    return null;
  }
};

// Añadir una solución a un enunciado
const addSolution = (statementId, solutionData) => http.post(`/statements/${statementId}/add_solution`, { solution: solutionData });

// Actualizar una solución
const updateSolution = (solutionId, solutionData) => http.patch(`/solutions/${solutionId}`, { solution: solutionData });

// Eliminar una solución
const deleteSolution = (solutionId) => http.delete(`/solutions/${solutionId}`);

const getStatementsByTask = (taskId) => http.get(`/tasks/${taskId}/statements`); // Obtiene todos los enunciados de una tarea concreta
const getStatement = (statementId) => http.get(`/statements/${statementId}`); // Obtiene un enunciado concreto
const createStatement = (statementData) => http.post("/statements", { statement: statementData }); // Crea enunciados
const updateStatement = (id, data) => http.put(`/statements/${id}`, { statement: data }); // Modifica enunciado
const deleteStatement = (id) => http.delete(`/statements/${id}`);  // Borra enunciado
const getSolutions = (statementId) => http.get(`/statements/${statementId}/solutions`); // Obtiene las soluciones para un enunciado

export default {
  getAllStatements,
  getStatementsByTask,
  createStatement,
  updateStatement,
  deleteStatement,
  getStatement,
  getSolutions,
  addSolution,
  updateSolution,
  deleteSolution,
};