import React, { useState } from 'react';

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
  required = false,
  icon
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative group">
        {/* Icon or Prefix */}
        {icon && !prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
            {icon}
          </div>
        )}
        
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 font-medium">{prefix}</span>
          </div>
        )}
        
        {/* Input */}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          step={step}
          min={min}
          className={`
            w-full 
            ${icon || prefix ? 'pl-10' : 'pl-4'} 
            pr-4 py-3 
            bg-white
            border-2 
            rounded-xl
            text-gray-900
            placeholder-gray-400
            transition-all duration-200
            outline-none
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : isFocused
                ? 'border-blue-500 ring-4 ring-blue-100'
                : 'border-gray-200 hover:border-gray-300'
            }
          `}
        />
        
        {/* Focus Ring Animation */}
        <div className={`
          absolute inset-0 rounded-xl transition-opacity duration-200 pointer-events-none
          ${isFocused ? 'opacity-100' : 'opacity-0'}
        `}></div>
      </div>
      
      {/* Error Message with Animation */}
      {error && (
        <div className="mt-1.5 text-sm text-red-600 flex items-center animate-slideDown">
          <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      {/* Hint for positive numbers */}
      {type === 'number' && min === '0' && !error && (
        <p className="mt-1.5 text-xs text-gray-400 flex items-center">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Positive numbers only
        </p>
      )}
    </div>
  );
};

export default InputField;