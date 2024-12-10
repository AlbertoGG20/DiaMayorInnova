import http from "../http-common";

const getAll = async () => {
  try {
    const response = await http.get("/student_entries");
    return response;
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};

const create = async (data) => {
  console.log(data)
  try {
    const response = await http.post("/student_entries", { student_entry: data });
    return response;
  } catch (error) {
    console.error("Error en la creación:", error);
    return null;
  }
};

const update = async (id, data) => {
  try {
    const response = await http.put(`/student_entries/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
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



export default {
  getAll,
  create,
};