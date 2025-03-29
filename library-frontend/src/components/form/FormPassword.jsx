"use client";

import React, { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";

/**
 * Reusable form password input component with show/hide functionality
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Input placeholder
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.errors - React Hook Form errors object
 * @param {string} props.name - Field name for register
 * @param {Object} props.validation - Validation rules
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.className - Additional CSS classes
 */
const FormPassword = ({
  id,
  label,
  placeholder = "Password",
  register,
  errors,
  name,
  validation,
  disabled = false,
  className = "",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      <div className="mt-1 relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`appearance-none block w-full px-3 py-2 border ${
            errors && errors[name]
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none pr-10`}
          {...register(name, validation)}
          {...rest}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
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

export default FormPassword;
