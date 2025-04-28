import http from "../http-common";

const getStudentsMarkList = async (task_id,  page = 1, per_page = 10) => {
    try {
        const response = http.get(`/student_exercises/students_mark_list?task_id=${task_id}&page=${page}&per_page=${per_page}`);
        return response
    }
    catch (error) {
        console.error('Error fetching students mark list', error);
        return null
    }
}

export default getStudentsMarkList;