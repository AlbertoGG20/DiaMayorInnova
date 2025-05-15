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
        const response = await http.get(`/student_exercises/export_marks?task_id=${task_id}`, {
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        console.error('Error exporting marks to xlsx', error);
        return null;
    }
};

const togglePublishExercise = async (exerciseId, published) => {
    try {
        const response = await http.put(`/student_exercises/${exerciseId}/toggle_publish`, { published });
        return response;
    } catch (error) {
        console.error('Error toggling exercise publish status', error);
        return null;
    }
};

export { getStudentsMarkList, exportMarksToXlsx, togglePublishExercise };