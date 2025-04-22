import http from "../http-common";

// Obtiene todos los enunciados
const getAllStatements = async (page = 1, perPage = 10) => {
  try {
    const response = await http.get("/statements", {
      params: { page, per_page: perPage},
    });
    return response;
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    return null;
  }
};

const getStatementsByTask = (taskId) => http.get(`/tasks/${taskId}/statements`); // Obtiene todos los enunciados de una tarea concreta
const getStatement = (statementId) => http.get(`/statements/${statementId}`); // Obtiene un enunciado concreto
const createStatement = (statementData) => http.post("/statements", { statement: statementData }); // Crea enunciados
const updateStatement = (id, data) => http.put(`/statements/${id}`, data); // Modifica enunciado
const deleteStatement = (id) => http.delete(`/statements/${id}`);  // Borra enunciado
const getSolutions = (statementId) => http.get(`/statements/${statementId}/solutions`); // Obtiene las soluciones para un enunciado
//const getAccountIdFromNumber = (accountNumber) => http.get(`/accounts/find_by_account_number/${accountNumber}`);

export default {
  getAllStatements,
  getStatementsByTask,
  createStatement,
  updateStatement,
  deleteStatement,
  getStatement,
  getSolutions,
  //getAccountIdFromNumber,
};