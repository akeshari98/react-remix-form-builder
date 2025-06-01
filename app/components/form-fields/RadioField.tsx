import React from 'react';
import clsx from 'clsx';
import { FormField } from '~/store/formStore';

interface RadioFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  isPreview?: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  isPreview = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={clsx('mb-4', className)}>
      <fieldset>
        <legend className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </legend>
        <div className="mt-2 space-y-2">
          {field.options?.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                id={`${field.id}-${option.id}`}
                name={field.id}
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                disabled={disabled}
                required={field.required}
                className={clsx(
                  'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800',
                  error ? 'border-red-300' : '',
                  disabled ? 'cursor-not-allowed' : ''
                )}
              />
              <label
                htmlFor={`${field.id}-${option.id}`}
                className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      {field.helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" id={`${field.id}-description`}>
          {field.helpText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" id={`${field.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
