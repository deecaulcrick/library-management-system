/**
 * Extract meaningful error messages from API error responses
 * Handles various error formats including Express validator errors
 * 
 * @param {Error} error - The error object from API response
 * @returns {string} A human-readable error message
 */
export const extractErrorMessage = (error) => {
  // Default error message
  let errorMessage = "An unexpected error occurred";
  
  // Check if it's an Axios error with a response
  if (error?.response?.data) {
    const { data } = error.response;
    
    // Case 1: Express validator format (array of validation errors)
    if (Array.isArray(data) && data.length > 0) {
      // Join all validation error messages
      const validationErrors = data.map(err => {
        if (err.msg && err.path) {
          return `${err.path}: ${err.msg}`;
        }
        return err.msg || String(err);
      });
      
      return validationErrors.join(', ');
    }
    
    // Case 2: Error message directly in data
    if (data.message) {
      return data.message;
    }
    
    // Case 3: Error object with errors array
    if (data.errors && Array.isArray(data.errors)) {
      const errorMsgs = data.errors.map(err => err.msg || String(err));
      return errorMsgs.join(', ');
    }
    
    // Case 4: Data is a string
    if (typeof data === 'string') {
      return data;
    }
    
    // Case 5: Data is a plain error object
    if (data.error) {
      return data.error;
    }
  }
  
  // Handle network errors
  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Use error message if available
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }
  
  return errorMessage;
};

/**
 * Format validation errors for display in forms
 * Particularly useful with React Hook Form
 * 
 * @param {Object|Array} errors - Error response from the API
 * @returns {Object} An object with field names as keys and error messages as values
 */
export const formatValidationErrors = (errors) => {
  const formattedErrors = {};
  
  if (Array.isArray(errors)) {
    errors.forEach(err => {
      if (err.path) {
        formattedErrors[err.path] = err.msg;
      }
    });
  } else if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([key, value]) => {
      formattedErrors[key] = typeof value === 'string' ? value : 'Invalid value';
    });
  }
  
  return formattedErrors;
};
