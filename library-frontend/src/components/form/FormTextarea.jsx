"use client";

import React from "react";
import { ErrorMessage } from "@hookform/error-message";

/**
 * Reusable form textarea component
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Textarea ID
 * @param {string} props.label - Textarea label
 * @param {string} props.placeholder - Textarea placeholder
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.errors - React Hook Form errors object
 * @param {string} props.name - Field name for register
 * @param {Object} props.validation - Validation rules
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.rows - Number of rows
 */
const FormTextarea = ({
  id,
  label,
  placeholder = "",
  register,
  errors,
  name,
  validation,
  disabled = false,
  className = "",
  rows = 3,
  ...rest
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={`appearance-none block w-full px-3 py-2.5 border ${
            errors && errors[name]
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          } rounded-md placeholder-gray-400 focus:outline-none`}
          {...register(name, validation)}
          {...rest}
        />
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

export default FormTextarea;
