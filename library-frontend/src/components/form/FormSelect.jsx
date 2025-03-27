"use client";

import React from "react";
import { ErrorMessage } from "@hookform/error-message";

/**
 * Reusable form select component
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.label - Select label
 * @param {Array} props.options - Array of options [{value: string, label: string}] or string[]
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.errors - React Hook Form errors object
 * @param {string} props.name - Field name for register
 * @param {Object} props.validation - Validation rules
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.className - Additional CSS classes
 */
const FormSelect = ({
  id,
  label,
  options = [],
  register,
  errors,
  name,
  validation,
  disabled = false,
  className = "",
  ...rest
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="mt-1">
        <select
          id={id}
          disabled={disabled}
          className={`appearance-none block w-full px-3 py-2 border ${
            errors && errors[name] 
              ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
          {...register(name, validation)}
          {...rest}
        >
          {options.map((option, index) => {
            // Handle both string options and {value, label} objects
            const value = typeof option === 'object' ? option.value : option;
            const label = typeof option === 'object' ? option.label : option;
            
            return (
              <option key={index} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="mt-1 text-sm text-red-600">{message}</p>
          )}
        />
      </div>
    </div>
  );
};

export default FormSelect;
