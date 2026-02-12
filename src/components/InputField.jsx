import React from 'react';

const InputField = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  prefix,
  step,
  min,
  required = false
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-2 text-gray-500">{prefix}</span>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${prefix ? 'pl-8' : 'px-4'} pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}`}
          step={step}
          min={min}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;