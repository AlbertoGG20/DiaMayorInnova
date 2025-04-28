import http from "../http-common";

const getAll = (id) => {

  const exercises = http.get(`/exercises?user_id=${id}`)
  return exercises;

};

const get = async (id) => {
  try {
    const response = await http.get(`/exercises?exercise_id${id}`);
    return response;
  } catch (error) {
    console.error("Error en la petición get:", error);
    return null;
  }
};

const create = async (data) => {
  try {
    const response = await http.post("/school_centers", data);
    return response;
  } catch (error) {
    console.error("Error en la creación:", error);
    return null;
  }
};

const update = async (id, data) => {
  try {
    const response = await http.put(`/school_centers/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};

const remove = async (id) => {
  try {
    const response = await http.delete(`/school_centers/${id}`);
    return response;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    return null;
  }
};

const removeAll = async () => {
  try {
    const response = await http.delete(`/school_centers`);
    return response;
  } catch (error) {
    console.error("Error en la eliminación de todos:", error);
    return null;
  }
};

const findByName = async (name) => {
  try {
    const response = await http.get(`/school_centers?school_name=${name}`);
    return response;
  } catch (error) {
    console.error("Error en la búsqueda por módulo:", error);
    return null;
  }
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName
};
