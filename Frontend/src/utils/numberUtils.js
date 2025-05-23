export const formatNumber = (value) => {
  if (!value) return '';
  const number = parseFloat(value);
  if (isNaN(number)) return '';
  return number.toFixed(2);
}; 