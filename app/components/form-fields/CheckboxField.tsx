import React from 'react';
import clsx from 'clsx';
import { FormField } from '~/store/formStore';

interface CheckboxFieldProps {
  field: FormField;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  isPreview?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  isPreview = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={clsx('mb-4', className)}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={field.id}
            name={field.id}
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            disabled={disabled}
            required={field.required}
            className={clsx(
              'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800',
              error ? 'border-red-300' : '',
              disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : ''
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-description` : undefined}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={field.id} className="font-medium text-gray-700 dark:text-gray-200">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.helpText && !error && (
            <p className="text-gray-500 dark:text-gray-400" id={`${field.id}-description`}>
              {field.helpText}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" id={`${field.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};
