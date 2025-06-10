import http from "../http-common";

const addSolution = (statementId, solutionData) => {
  return http.post(`/statements/${statementId}/add_solution`, solutionData);
};

const updateSolution = (solutionId, solutionData) => {
  return http.put(`/solutions/${solutionId}`, { solution: solutionData });
};

const markAsExample = (statementId, solutionId, payload = {}) => {
  return http.post(`/statements/${statementId}/solutions/${solutionId}/mark_as_example`, payload);
};

const unmarkAsExample = (statementId, solutionId) => {
  return http.post(`/statements/${statementId}/solutions/${solutionId}/unmark_as_example`);
};

const getExampleSolution = async (statementId) => {
  try {
    const response = await http.get(`/statements/${statementId}/example_solution`);
    return response.data;
  } catch (error) {
    console.error('Error fetching example solution:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw error; // Re-throw the error so calling code can handle it
  }
};

export default {
  addSolution,
  updateSolution,
  markAsExample,
  unmarkAsExample,
  getExampleSolution
};