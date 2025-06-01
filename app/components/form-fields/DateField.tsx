import React from 'react';
import clsx from 'clsx';
import { FormField } from '~/store/formStore';

interface DateFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  isPreview?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
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
      <label
        htmlFor={field.id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="date"
        id={field.id}
        name={field.id}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        required={field.required}
        className={clsx(
          'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white',
          error ? 'border-red-300' : '',
          disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : ''
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${field.id}-error` : field.helpText ? `${field.id}-description` : undefined}
      />
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
