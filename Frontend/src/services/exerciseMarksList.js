import http from "../http-common";

const getStudentsMarkList = async (exercise_id) => {
    try {
        const response = await http.get(`/student_exercises/students_mark_list?exercise_id=${exercise_id}`);
        return response;
    } catch (error) {
        console.error('Error fetching students mark list', error);
        throw error;
    }
};

const exportMarksToExcel = async (exercise_id) => {
    try {
        const response = await http.get(`/marks/export_xlsx?exercise_id=${exercise_id}`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'notes_eleves.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erreur lors de l'exportation des notes :", error);
        throw error;
    }
};

export { getStudentsMarkList, exportMarksToExcel };