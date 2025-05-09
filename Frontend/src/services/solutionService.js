import http from "../http-common";

const addSolution = (statementId, solutionData) => {
  return http.post(`/statements/${statementId}/add_solution`, solutionData);
};

const updateSolution = (solutionId, solutionData) => {
  return http.put(`/solutions/${solutionId}`, { solution: solutionData });
};

const markAsExample = (solutionId, data) => {
  return http.post(`/solutions/${solutionId}/mark_as_example`, data);
};

const unmarkAsExample = (solutionId) => {
  return http.post(`/solutions/${solutionId}/unmark_as_example`);
};

const getExampleSolution = (statementId) => {
  return http.get(`/statements/${statementId}/example_solution`);
};

export default {
  addSolution,
  updateSolution,
  markAsExample,
  unmarkAsExample,
  getExampleSolution
};