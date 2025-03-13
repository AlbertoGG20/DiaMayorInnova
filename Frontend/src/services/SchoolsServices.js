import http from "../http-common";


const getAll = async () => {
  try {
    const response = http.get("/school_centers");
    return response;
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    return null;
  }
};

const get = async (id) => {
  try {
    const response = await http.get(`/school_centers/${id}`);
    return response;
  } catch (error) {
    console.error("Error en la petición get:", error);
    return null;
  }
};

const create = (data) =>  http.post("/school_centers",{ school_center: data });

const update = async (id, data) => {
  try {
    const response = await http.put(`/school_centers/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};

const remove = (schoolId) => http.delete(`/school_centers/${schoolId}`);

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
