import http from "../http-common";

const getAll = async (page = 1, perPage = 10, name = "") => {
    try {
        const response = await http.get("/accounting_plans", {// "Backend/config/routes.rb"
            params: {page, per_page: perPage, name}
        });
        return response.data;
    } catch (error) {
        console.error("Error en la petición getAll: ", error);
        return null;
    }
};

const get = async (id) => {
    try {
        const response = await http.get(`/accounting_plans/${id}`);
        return response;
    } catch (error) {
        console.error("Error en la petición get:", error);
        return null;
    }
};

  
const create = async (data) => {
    try {
        const response = await http.post("/accounting_plans", data);
        return response;
    } catch (error) {
        console.error("Error en la creación:", error);
        return null;
    }
};

const update = async (id, data) => {
    try {
        const response = await http.put(`/accounting_plans/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error en la actualización:", error);
        return null;
    }
};

const remove = async (id) => {
    try {
        const response = await http.delete(`/accounting_plans/${id}`);
        return response;
    } catch (error) {
        console.error("Error en la eliminación:", error);
        return null;
    }
};

const removeAll = async () => {
    try {
        const response = await http.delete("/accounting_plans");
        return response;
    } catch (error) {
        console.error("Error en la eliminación de todos:", error);
        return null;
    }
};

const findByName = async (name) => {
    try {
        const response = await http.get(`/accounting_plans?name=${name}`);
        return response.data;
    } catch (error) {
        console.error("Error en la búsqueda por módulo:", error);
        return null;
    }
};


const getAccountsByPGC = (id) => {
    return http.get(`/accounting_plans/${id}/accounts_by_PGC`);
  };

  
const exportToCSV = async (id) => {
    try {
        const response = await http.get(`/accounting_plans/${id}/export_csv`, {
            headers: {
                "Accept": "text/csv" // csv response
            },
            responseType: "blob", // as file
        });

        // Verify csv
        const contentType = response.headers["content-type"];
        if (!contentType || !contentType.includes("text/csv")) {
            console.error("El archivo no es un csv");
            return;
        }

        // Create url and download file
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `pgc_${id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error exportando CSV:", error);
    }
};

const importCSV = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await http.post("/accounting_plans/import_csv", formData, {
            headers: { 
                "Content-Type": "multipart/form-data"
            },
        });

        if (response.data.success) {
            return response.data;
        }

    } catch (error) {
        console.error("Error importando CSV:", error.response?.data || error.message);
        return null;
    }
};

const exportXLSXByPGC = async (id) => {
    try {
        const response = await http.get(`/accounting_plans/${id}/export_xlsx_by_pgc`, {
            headers: {
                "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
            responseType: "blob"
        });

        const contentType = response.headers["content-type"];
        if (!contentType || !contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
            console.error("El archivo no es un XLSX");
            return;
        }

        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `pgc_${id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error exportando XLSX:", error);
        throw error;
    }
};

const importXLSX = async (formData) => {
    try {
        const response = await http.post("/accounting_plans/import_xlsx", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Error en la importación del archivo XLSX");
    } catch (error) {
        console.error("Error importando XLSX:", error);
        throw error;
    }
};

const downloadTemplateXLSX = async () => {
    try {
        const response = await http.get("/accounting_plans/download_template_xlsx", {
            responseType: "blob",
            headers: {
                "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error descargando la plantilla XLSX:", error);
        throw error;
    }
};

const AccountingPlanService = {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByName,
    getAccountsByPGC,
    exportToCSV,
    importCSV,
    importXLSX,
    exportXLSXByPGC,
    downloadTemplateXLSX,
};


export default AccountingPlanService;
