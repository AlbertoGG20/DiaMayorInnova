import http from "../http-common";

const addSolution = (statementId, solutionData) => {
  return http.post(`/statements/${statementId}/add_solution`, solutionData);
};

const updateSolution = (solutionId, solutionData) => {
  return http.put(`/solutions/${solutionId}`, { solution: solutionData });
};

// solutionService.js
const markAsExample = (statementId, solutionId, data = {}) => {
  return http.post(`/statements/${statementId}/solutions/${solutionId}/mark_as_example`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const unmarkAsExample = (statementId, solutionId) => {
  return http.post(`/statements/${statementId}/solutions/${solutionId}/unmark_as_example`);
};

// const getExampleSolution = (statementId) => {
//   return http.get(`/statements/${statementId}/example_solution`);
// };

const getExampleSolution = async (statementId) => {
  try {
    const response = await http.get(`/statements/${statementId}/example_solution`, {
      headers: {
        'Accept': 'application/json'
      }
    });
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

// const getExampleSolution = async (statementId) => {
//   // Datos mock de ejemplo
//   const mockSolution = {
//     description: "Esta es una solución de ejemplo mockeada",
//     entries: [
//       {
//         entry_number: 1,
//         entry_date: "2023-01-01",
//         annotations: [
//           {
//             account: {
//               account_number: "1105",
//               name: "Caja",
//               description: "Efectivo en caja",
//               charge: "Ingresos",
//               credit: "Egresos"
//             },
//             debit: "1000",
//             credit: ""
//           }
//         ]
//       }
//     ]
//   };

//   return { data: mockSolution };
// };

export default {
  addSolution,
  updateSolution,
  markAsExample,
  unmarkAsExample,
  getExampleSolution
};