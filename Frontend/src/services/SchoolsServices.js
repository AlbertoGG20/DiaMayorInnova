import http from "../http-common";


const getAll = async (page=1, perPage = 10, school_name = "") => {
  try {
    const response = await http.get("/school_centers", {
      params: {page, per_page: perPage, school_name}
    });
    return response.data;
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    throw error;
  }
};

const get = async (id) => {
  try {
    const response = await http.get(`/school_centers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en la petición get:", error);
    throw error;
  }
};

const create = async (data) => {
  try {
    const response = await http.post("/school_centers", { school_center: data });
    return response.data;
  } catch (error) {
    console.error("Error en la creación:", error);
    throw error;
  }
};

const update = async (id, data) => {
  try {
    const response = await http.put(`/school_centers/${id}`, { school_center: data });
    return response.data;
  } catch (error) {
    console.error("Error en la actualización:", error);
    throw error;
  }
};

const remove = async (schoolId) => {
  try {
    const response = await http.delete(`/school_centers/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    throw error;
  }
};

const removeAll = async () => {
  try {
    const response = await http.delete(`/school_centers`);
    return response.data;
  } catch (error) {
    console.error("Error en la eliminación de todos:", error);
    throw error;
  }
};

const findByName = async (name) => {
  try {
    const response = await http.get(`/school_centers?school_name=${name}`);
    return response.data;
  } catch (error) {
    console.error("Error en la búsqueda por nombre:", error);
    throw error;
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
