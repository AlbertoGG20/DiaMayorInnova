import http from "../http-common";

const getAllUsers = (params = {}) => {
  return http.get('/users', { params });
};

const createUser = (formData) => http.post('/users', formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const updateUser = async (id, formData) => {
  const response = await http.put(`/users/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const deleteUser = (userId) => http.delete(`/users/${userId}`);

const findByName = (userName) => http.get(`/users?name=${userName}`);

const getUserByClassId = (id) => http.get(`/users?class_groups_id=${id}`);

const getTeacherClassGroups = async (userId) => {
  try {
    const response = await http.get(`/teacher_class_groups?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los grupos de clase del profesor:", error);
    return [];
  }
};

const getCurrentUser = async () => {
  try {
    const response = await http.get('/users/current');
    return response.data.user; // Asumiendo que el endpoint devuelve { user: { ... } }
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    return null;
  }
};

const getUsersBySchoolCenter = (schoolCenterId) => {
  return http.get(`/users?school_center_id=${schoolCenterId}`);
};

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  findByName,
  getUserByClassId,
  getTeacherClassGroups,
  getCurrentUser,
  getUsersBySchoolCenter,
};