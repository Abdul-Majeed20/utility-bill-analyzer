// Validate form data for Pakistani bills
export const validateForm = (data) => {
  const newErrors = {};
  
  // Check if required fields are filled
  if (!data.units) newErrors.units = 'Units consumed is required';
  if (!data.tariffRate) newErrors.tariffRate = 'Tariff rate is required';
  
  // Check if values are positive numbers
  if (data.units && (isNaN(data.units) || Number(data.units) <= 0)) {
    newErrors.units = 'Units must be a positive number';
  }
  if (data.tariffRate && (isNaN(data.tariffRate) || Number(data.tariffRate) <= 0)) {
    newErrors.tariffRate = 'Tariff rate must be a positive number';
  }
  if (data.extraCharges && (isNaN(data.extraCharges) || Number(data.extraCharges) < 0)) {
    newErrors.extraCharges = 'Extra charges must be 0 or a positive number';
  }
  
  return newErrors;
};