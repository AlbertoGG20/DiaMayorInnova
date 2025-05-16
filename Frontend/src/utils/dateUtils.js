export const getCurrentDate = () => new Date().toISOString().split('T')[0];
export const getCurrentDateTime = () => new Date().toISOString().slice(0, 16); 