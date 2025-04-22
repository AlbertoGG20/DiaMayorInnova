import http from "../http-common";

const getAll = async () => {
  const response = await http.get(`/student_exercises`);
  // console.log("all exercise info of user ", response) // Depuración
  return response;
};


const getByTaskId = async (id) => {
  try {
    const response = await http.get(`/exercises/find_by_task_id?task_id=${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

const getByExerciseId = async (id) => {
  try {
    const response = await http.get(`/exercises/find_by_exercise_id?exercise_id=${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

const create = async (data) => {
  console.log(data)
  try {
    const response = await http.post("/exercises", data);
    return response;
  } catch (error) {
    console.error("Error en la creación de la tarea del usuario:", error);
    return null;
  }
};


const deleteOnGroup = async (data) => {
  try {
    console.log(data)
    const response = await http.delete(`/exercises/destroy_on_group`, { data });
    return response;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    return null;
  }
};


export default {
  getAll,
  create,
  getByTaskId,
  getByExerciseId,
  deleteOnGroup,
};