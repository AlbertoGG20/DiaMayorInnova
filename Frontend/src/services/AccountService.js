import http from "../http-common";

const getAll = async (page = 1, perPage = 10, search = "") => {
  try {
    const response = await http.get("/accounts", {
      params: { page, per_page: perPage, search }
    });
    return response.data;
  } catch (error) {
    console.error("Error en la petición getAll: ", error);
    return null;
  }
};



const get = async (id) => {
  try {
    const response = await http.get(`/accounts/${id}`);
    return response;
  } catch (error) {
    return null;
  }
};

const create = async (data) => {
  try {
    const response = await http.post("/accounts", data);
    return response;

  } catch (error) {
    console.error("Error en la creación:", error);
    return null;
  }
};

const update = async (id, data) => {
  try {
    const response = await http.put(`/accounts/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error en la actualización:", error);
    return null;
  }
};

const remove = async (id) => {
  try {
    const response = await http.delete(`/accounts/${id}`)
    return response;
  } catch (error) {
    console.error("Error en la eliminación:", error);
    return null;
  }
};

const removeAll = async () => {
  try {
    const response = await http.delete("/accounts");
    return response;
  } catch (error) {
    console.error("Error en la eliminación de todos:", error);
    return null;
  }
};

const findByNumber = (account_number) => http.get(`/accounts/find_by_account_number?account_number=${account_number}`);

const  findByName =  async (name) => {
  try {
    const response = await http.get(`/accounts?name=${name}`);
    return response;
  }
  catch (error) {
    return null;
  }
};

const AccountService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByNumber,
  findByName,
};

export default AccountService;