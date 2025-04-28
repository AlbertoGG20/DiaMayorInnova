import http from "../http-common";

const getAll = async (page = 1, perPage = 10) => {
    try {
        const response = await http.get("/class_groups", {
            params: { page, per_page: perPage }
        });
        return response;
    } catch (error) {
        console.error("Error en la petición:", error);
        return null;
    }
};

const get = async (id) => {
    try {
        const response = await http.get(`/class_groups/${id}`);
        return response;
    } catch (error) {
        console.error("Error en la petición:", error);
        return null;
    }
};

const create = async (data) => {
    try {
        const response = await http.post("/class_groups", data);
        return response;
    } catch (error) {
        console.error("Error en la creación:", error);
        return null;
    }
};

const update = async (id, data) => {
    try {
        const response = await http.put(`/class_groups/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error en la actualización:", error);
        return null;
    }
};

const remove = async (id) => {
    try {
        const response = await http.delete(`/class_groups/${id}`);
        return response;
    } catch (error) {
        console.error("Error en la eliminación:", error);
        return null;
    }
};

const removeAll = async () => {
    try {
        const response = await http.delete(`/class_groups`);
        return response;
    } catch (error) {
        console.error("Error en la eliminación de todos:", error);
        return null;
    }
};

const findByModule = async (module) => {
    try {
        const response = await http.get(`/class_groups?module=${module}`);
        return response;
    } catch (error) {
        console.error("Error en la búsqueda por módulo:", error);
        return null;
    }
};

const findByTeacherId = async (id) => {
    try {
        const response = await http.get(`class_groups?user_id=${id}`);
        return response;
    } catch (error) {
        console.error("Error al obtener las clases :", error);
        return null;
    }
}

const updateClassGroupUsers = async (id, data) => {
    try {
      const response = await http.put(`/class_groups/${id}/update_users`, {
        users: data.users
      });
      return response;
    } catch (error) {
      console.error("Error actualizando usuarios:", error);
      return null;
    }
  };

  const getClassGroupUsers = async (id) => {
    try {
      const response = await http.get(`/class_groups/${id}/users`);
      return response;
    } catch (error) {
      console.error("Error obteniendo usuarios del grupo:", error);
      return null;
    }
  };

const ClassGroupService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByModule,
    findByTeacherId,
    updateClassGroupUsers,
    getClassGroupUsers,
};

export default ClassGroupService;