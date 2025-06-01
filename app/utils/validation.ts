import { FormField } from '~/store/formStore';

export const validateField = (field: FormField, value: any): string | null => {
  // Check required
  if (field.required && (value === undefined || value === null || value === '')) {
    return `${field.label} is required`;
  }

  // Skip further validation if empty and not required
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    // Min length
    if (field.minLength !== undefined && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    // Max length
    if (field.maxLength !== undefined && value.length > field.maxLength) {
      return `${field.label} must be at most ${field.maxLength} characters`;
    }

    // Pattern matching
    if (field.pattern && !new RegExp(field.pattern).test(value)) {
      return `${field.label} is not in the correct format`;
    }

    // Email validation
    if (field.type === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return 'Please enter a valid email address';
    }

    // Phone validation
    if (field.type === 'phone' && !/^\+?[0-9\s\-()]{7,}$/.test(value)) {
      return 'Please enter a valid phone number';
    }
  }

  return null;
};

export const validateForm = (
  fields: FormField[],
  values: Record<string, any>
): Record<string, string | null> => {
  const errors: Record<string, string | null> = {};

  fields.forEach((field) => {
    const value = values[field.id];
    const error = validateField(field, value);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
};
