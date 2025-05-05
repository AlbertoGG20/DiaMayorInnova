import http from "../http-common";

const addSolution = (statementId, solutionData) => {
  return http.post(`/statements/${statementId}/add_solution`, solutionData); // Ajout de return
};

const markAsExample = (solutionId, data) => {
  return http.post(`/solutions/${solutionId}/mark_as_example`, data);
};

const unmarkAsExample = (solutionId) => {
  return http.post(`/solutions/${solutionId}/unmark_as_example`);
};

export default {
  addSolution,
  markAsExample,
  unmarkAsExample,
};