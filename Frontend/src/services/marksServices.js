import http from "../http-common";


const getAll = (id) => {
  try {
    const marks = http.get(`/marks?exercise_id=${id}`)
    return marks;
  } catch (error) {
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
    const response = await http.put("/marks/update_multiple", { marks: marks });
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