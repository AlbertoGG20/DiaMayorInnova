import http from "../http-common";

const getStudentsMarkList = async (task_id,  page = 1, per_page = 10) => {
    try {
        const response = http.get(`/student_exercises/students_mark_list?task_id=${task_id}&page=${page}&per_page=${per_page}`);
        return response
    }
    catch (error) {
        console.error('Error fetching students mark list', error);
        return null;
    }
};

const exportMarksToXlsx = async (task_id) => {
    try {
        const response = await http.get(`/student_exercises/export_to_xlsx?task_id=${task_id}`, {
            responseType: 'blob', // Indique que la réponse est un fichier binaire (XLSX)
        });

        // Créer un URL temporaire pour le blob et déclencher le téléchargement
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `notas_tarea_${task_id}_${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Nettoyer l'URL temporaire
    } catch (error) {
        console.error('Error exporting marks to XLSX', error);
        throw error;
    }
};

export { getStudentsMarkList, exportMarksToXlsx };