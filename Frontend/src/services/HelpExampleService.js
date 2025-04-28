import http from "../http-common";

const getAll = async () => {
  try {
    const response = http.get("/help_examples");
    return response;
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    return null;
  }
};

const get = async (id) => {
  try {
    const response = await http.get(`/help_examples/${id}`);
    return response;
  } catch (error) {
    return null;
  }
}

const create = async (data) => {
  try {
    const response = await http.post("/help_examples", data);
    return response;

  } catch (error) {
    console.error("Error en la creación", error);
    return null;
  }
};

const update = async (id, data) => {
  try {
    const response = await http.put(`/help_examples/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización", error);
    return null;
  }
};

const remove = async (id) => {
  try {
    const response = await http.delete(`/help_examples/${id}`)
    return response;
  } catch (error) {
    console.error("Error en la eliminación", error);
    return null;
  }
};

const removeAll = async () => {
  try {
    const response = await http.delete("/help_examples");
    return response;
  } catch (error) {
    console.error("Error en la eliminación global", error);
    return null;
  }
};

const findByAccount = async (account) => {
  try {
    const response = await http.get(`/help_examples/find_by_account_id?account_id=${account}`);
    return response;
  } catch (error) {
    console.error("Error en la búsqueda por cuenta", error);
    return null;
  }
};

const HelpExampleService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByAccount
};

export default HelpExampleService;

// # A