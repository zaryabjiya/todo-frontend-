// frontend/src/lib/validation.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password must be at least 8 characters and contain at least one uppercase, lowercase, and number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateTaskTitle = (title: string): boolean => {
  return title.trim().length >= 1 && title.trim().length <= 200;
};

export const validateTaskDescription = (description: string): boolean => {
  return description.length <= 1000;
};

export const validateTask = (title: string, description?: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!validateTaskTitle(title)) {
    errors.push('Title must be between 1 and 200 characters');
  }
  
  if (description && !validateTaskDescription(description)) {
    errors.push('Description must be less than 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};