import http from "../http-common";

const token = localStorage.getItem("site");
console.log("Token being sent:", token);

const getAll = async () => {
    try {
        const token = await localStorage.getItem("site");
        console.log("Token being sent:", token);
        const authToken = http.get("/class_groups", {
            headers: { "AUTH-TOKEN": token },
        });
        return authToken;
    }
    catch (error) {
        console.error("error ", error)
        return null;
    }
};

const get = id => {
    return http.get(`/class_groups/${id}`);
};

const create = data => {
    return http.post("/class_groups", data);
};

const update = (id, data) => {
    return http.put(`/class_groups/${id}`, data);
};

const remove = id => {
    return http.delete(`/class_groups/${id}`);
};

const removeAll = () => {
    return http.delete(`/class_groups`);
};

const findByModule = module => {
    return http.get(`/class_groups?module=${module}`);
};

const ClassGroupService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByModule
};

export default ClassGroupService;