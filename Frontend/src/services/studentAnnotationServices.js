import http from "../http-common";

const getAll = (id) => {
  try {
    const response = http.get(`/student_annotations?student_entry_id=${id}`);
    return response;
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};
const create = async (data) => {
  try {
    const response = await http.post(`/student_annotations`, { student_annotation: data });
    return response || {};
  } catch (error) {
    console.error("Error en la creación:", error);
    return null;
  }
};


const update = async (updatedAnnotation) => {
  try {
    const response = await http.put(`/student_annotations/${updatedAnnotation.id}`, updatedAnnotation);
  } catch (error) {
    console.error("Error updating annotation:", error);
  }
};

const remove = async (id) => {
  try {
    const response = await http.delete(`/student_annotations/${id}`);
    return response;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    return null;
  }
};



export default {
  getAll,
  create,
  update,
};