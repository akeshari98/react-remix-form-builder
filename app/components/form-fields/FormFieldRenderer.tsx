import React from 'react';
import { FormField, FieldType } from '~/store/formStore';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';
import { DropdownField } from './DropdownField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';
import { DateField } from './DateField';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string | null;
  disabled?: boolean;
  isPreview?: boolean;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
  isPreview = false,
}) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'password':
    case 'number':
      return (
        <TextField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          isPreview={isPreview}
        />
      );
    case 'textarea':
      return (
        <TextAreaField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          isPreview={isPreview}
        />
      );
    case 'dropdown':
      return (
        <DropdownField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          isPreview={isPreview}
        />
      );
    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          isPreview={isPreview}
        />
      );
    case 'radio':
      return (
        <RadioField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          isPreview={isPreview}
        />
      );
    case 'date':
      return (
        <DateField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          isPreview={isPreview}
        />
      );
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
};
