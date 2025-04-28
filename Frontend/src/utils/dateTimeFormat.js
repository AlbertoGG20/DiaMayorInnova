const formatDateForInput = (date) => {
  const dateObj = new Date(date);
  // Ajustamos la fecha para compensar el offset de la zona horaria
  const offset = dateObj.getTimezoneOffset();
  dateObj.setMinutes(dateObj.getMinutes() - offset);
  return dateObj.toISOString().slice(0, 16); // Devuelve el formato "yyyy-MM-ddThh:mm"
};

export default formatDateForInput;