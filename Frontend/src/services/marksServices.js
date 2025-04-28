import http from "../http-common";


const getAll = (id) => {
  try {
    console.log("servicio de mark", id)
    const marks = http.get(`/marks?exercise_id=${id}`)
    console.log("marks getall", marks)
    return marks;
  } catch (error) {
    console.log("Error en la petición getAll: ", error);
    return null;
  }
};

const create = async (data) => {
  try {
    const response = await http.post("/marks", { mark: data });
    return response;
  } catch (error) {
    console.error("Error en la creación:", error);
    return null;
  }
};

const update = async (id, data) => {
  try {
    const response = await http.put(`/marks/${id}`, { mark: data });
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};

const manual_update_mark = async (marks) => {
  try {
    // Verifica que la URL es correcta y los datos son los esperados
    console.log("Enviando datos:", marks);

    const response = await http.put("/marks/update_multiple", { marks: marks });
    // Devuelve la respuesta
    return response.data;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};




const remove = async (id) => {
  try {
    const response = await http.delete(`/mark/${id}`);
    return response;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    return null;
  }
};



export default {
  getAll,
  create,
  manual_update_mark,
};