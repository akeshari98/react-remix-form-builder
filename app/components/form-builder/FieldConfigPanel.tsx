import React, { useState } from 'react';
import { FieldOption, FieldType, FormField } from '~/store/formStore';
import { Button } from '~/components/ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface FieldConfigPanelProps {
  field: FormField;
  onUpdate: (updatedField: FormField) => void;
}

export const FieldConfigPanel: React.FC<FieldConfigPanelProps> = ({
  field,
  onUpdate,
}) => {
  const [newOptionLabel, setNewOptionLabel] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name === 'required') {
      onUpdate({
        ...field,
        required: checked as boolean,
      });
    } else {
      onUpdate({
        ...field,
        [name]: value,
      });
    }
  };

  const handleAddOption = () => {
    if (!newOptionLabel.trim()) return;

    const newOption: FieldOption = {
      id: uuidv4(),
      label: newOptionLabel,
      value: newOptionLabel.toLowerCase().replace(/\s+/g, '-'),
    };

    onUpdate({
      ...field,
      options: [...(field.options || []), newOption],
    });

    setNewOptionLabel('');
  };

  const handleDeleteOption = (optionId: string) => {
    onUpdate({
      ...field,
      options: field.options?.filter((option) => option.id !== optionId),
    });
  };

  const handleUpdateOption = (
    optionId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    onUpdate({
      ...field,
      options: field.options?.map((option) =>
        option.id === optionId
          ? {
              ...option,
              [name]: value,
              ...(name === 'label' && !option.value.startsWith('option')
                ? { value: value.toLowerCase().replace(/\s+/g, '-') }
                : {}),
            }
          : option
      ),
    });
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
        Configure {field.type} field
      </h3>

      <div className="space-y-4">
        {/* Label */}
        <div>
          <label
            htmlFor="label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={field.label}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Placeholder */}
        {field.type !== 'checkbox' && field.type !== 'radio' && (
          <div>
            <label
              htmlFor="placeholder"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Placeholder
            </label>
            <input
              type="text"
              id="placeholder"
              name="placeholder"
              value={field.placeholder || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        {/* Help Text */}
        <div>
          <label
            htmlFor="helpText"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Help Text
          </label>
          <textarea
            id="helpText"
            name="helpText"
            value={field.helpText || ''}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Required */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="required"
              name="required"
              type="checkbox"
              checked={field.required}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="required"
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              Required
            </label>
          </div>
        </div>

        {/* Min Length */}
        {(field.type === 'text' || field.type === 'textarea') && (
          <div>
            <label
              htmlFor="minLength"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Minimum Length
            </label>
            <input
              type="number"
              id="minLength"
              name="minLength"
              value={field.minLength || ''}
              onChange={handleChange}
              min={0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        {/* Max Length */}
        {(field.type === 'text' || field.type === 'textarea') && (
          <div>
            <label
              htmlFor="maxLength"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Maximum Length
            </label>
            <input
              type="number"
              id="maxLength"
              name="maxLength"
              value={field.maxLength || ''}
              onChange={handleChange}
              min={0}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        {/* Pattern */}
        {field.type === 'text' && (
          <div>
            <label
              htmlFor="pattern"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Pattern (RegEx)
            </label>
            <input
              type="text"
              id="pattern"
              name="pattern"
              value={field.pattern || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}

        {/* Options for dropdown and radio */}
        {(field.type === 'dropdown' || field.type === 'radio') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">
              Options
            </label>
            <div className="space-y-2 mb-4">
              {field.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="label"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(option.id, e)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(option.id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
                placeholder="Add new option"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddOption}
                variant="secondary"
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
