import http from "../http-common";

const getAllTasks = async (page = 1, perPage = 10, title = "") => {
  try {
    const response = await http.get('/tasks', {
      params: {page, per_page: perPage, title}
    });
    return response.data
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    return null;
  }
};

const getTaskWithStatements = (taskId) => http.get(`/tasks/${taskId}`);

const createTask = (taskData) => http.post("/tasks", taskData);

const deleteStatementFromTask = (taskId, statementId) => http.delete(`/tasks/${taskId}/statements/${statementId}`);

const deleteTask = (taskId) => http.delete(`/tasks/${taskId}`);

const updateTask = (taskId, updatedTaskData) => http.put(`/tasks/${taskId}`, updatedTaskData);

export default {
  getAllTasks,
  getTaskWithStatements,
  createTask,
  deleteStatementFromTask,
  deleteTask,
  updateTask,
};