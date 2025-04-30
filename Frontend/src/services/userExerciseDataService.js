import http from "../http-common";

const getAll = async (page = 1, per_page = 5, only_active = true) => {
  const response = await http.get(`/student_exercises`, {
    params: {
      page,
      per_page,
      only_active
    }
  });
  return response;
};

const getById = async (exerciseId) => {
  try {
    const response = await http.get(`/student_exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el ejercicio:", error);
    return null;
  }
};

const create = async (exerciseData) => {
  try {
    const response = await http.post("/student_exercises", exerciseData);
    return response;
  } catch (error) {
    console.error("Error en la creación de la tarea del usuario:", error);
    return null;
  }
};

const start = async (exerciseId) => {
  try {
    const response = await http.post(`/student_exercises/${exerciseId}/start`);
    return response;
  } catch (error) {
    console.error("Error al iniciar el examen:", error);
    return null; 
  }
};

const finish = async (exerciseId) => {
  try {
    const response = await http.put(`/student_exercises/${exerciseId}/finish`);
    return response;
  } catch (error) {
    console.error("Error al finalizar el examen:", error);
    return null;
  }
};

const update = async (exerciseId, data) => {
  try {
    const response = await http.put(`/student_exercises/${exerciseId}`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};

const update_student_exercise = async (exerciseId, data) => {
  try {
    const response = await http.put(`/student_exercises/${exerciseId}/update_student_exercise`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};

const updateTask = async (exerciseId, data) => {
  try {
    const response = await http.put(`/student_exercises/${exerciseId}/update_student_task`, data);
    
    // Normalizar respuesta
    const normalizedData = {
      exercise: {
        marks: [],
        ...response.data?.exercise,
        marks: (response.data?.exercise?.marks || []).map(mark => ({
          ...mark,
          student_entries: (mark.student_entries || []).map(entry => ({
            ...entry,
            student_annotations: entry.student_annotations || []
          }))
        }))
      }
    };

    return {
      ...response,
      data: normalizedData
    };
  } catch (error) {
    console.error("Error en la actualización:", error);
    return {
      data: { exercise: { marks: [] } },
      status: error.response?.status || 500
    };
  }
};

const remove = async (id) => {
  try {
    const response = await http.delete(`/student_entries/${id}`);
    return response;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    return null;
  }
};

const getAllCalification = async (params) => {
  const response = await http.get('/student_exercises/find_mark_exercise_by_user', { params });
  // console.log("all exercise info of user - gelAllCalification ", response) // Depuración
  return response;
};


export default {
  getAll,
  getAllCalification,
  update_student_exercise,
  updateTask,
  getById,
  create,
  update,
  start,
  finish,
};