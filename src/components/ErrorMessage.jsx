import React from 'react';

const ErrorMessage = ({ message, type = 'error' }) => {
  if (!message) return null;
  
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600'
  };
  
  return (
    <div className={`mt-4 p-4 border rounded-lg ${styles[type]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;