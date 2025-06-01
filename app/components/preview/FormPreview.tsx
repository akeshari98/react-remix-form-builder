import React, { useState, useEffect } from 'react';
import { useFormStore, Form, FormField, FormStep } from '~/store/formStore';
import { FormFieldRenderer } from '~/components/form-fields/FormFieldRenderer';
import { validateForm } from '~/utils/validation';
import { Button } from '~/components/ui/Button';
import clsx from 'clsx';

interface FormPreviewProps {
  form?: Form;
  isPublic?: boolean;
  onSubmit?: (data: Record<string, any>) => void;
}

export const FormPreview: React.FC<FormPreviewProps> = ({
  form: externalForm,
  isPublic = false,
  onSubmit,
}) => {
  const { currentForm, currentStep, setCurrentStep, previewMode } = useFormStore();
  const form = externalForm || currentForm;

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(isPublic ? 0 : currentStep);

  useEffect(() => {
    if (!isPublic) {
      setCurrentStepIndex(currentStep);
    }
  }, [currentStep, isPublic]);

  useEffect(() => {
    // Reset form values and errors when form changes
    setFormValues({});
    setErrors({});
    setSubmitted(false);
  }, [form?.id]);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          No form to preview. Please create or select a form first.
        </p>
      </div>
    );
  }

  const currentStepData = form.steps[currentStepIndex];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: null,
      }));
    }
  };

  const validateCurrentStep = () => {
    const stepErrors = validateForm(currentStepData.fields, formValues);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateCurrentStep();
    if (isValid && currentStepIndex < form.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      if (!isPublic) {
        setCurrentStep(currentStepIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      if (!isPublic) {
        setCurrentStep(currentStepIndex - 1);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateCurrentStep();
    
    if (isValid) {
      setSubmitted(true);
      if (onSubmit) {
        onSubmit(formValues);
      }
    }
  };

  const getPreviewWidthClass = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-[320px] w-full';
      case 'tablet':
        return 'max-w-[768px] w-full';
      case 'desktop':
      default:
        return 'max-w-[1024px] w-full';
    }
  };
  
  const getPreviewFrameClass = () => {
    switch (previewMode) {
      case 'mobile':
        return 'p-3 bg-gray-800 rounded-[24px] shadow-lg';
      case 'tablet':
        return 'p-4 bg-gray-800 rounded-[16px] shadow-lg';
      case 'desktop':
      default:
        return '';
    }
  };

  return (
    <div className={clsx('mx-auto transition-all duration-300', getPreviewWidthClass())}>
      <div className={clsx(getPreviewFrameClass(), 'transition-all duration-300')}>
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{form.title}</h2>
          {form.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">{form.description}</p>
          )}

          {/* Progress Indicator for multi-step forms */}
          {form.steps.length > 1 && (
            <div className="mt-6 mb-4">
              <div className="flex items-center justify-between">
                {form.steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                          index < currentStepIndex
                            ? 'bg-blue-600 text-white'
                            : index === currentStepIndex
                            ? 'bg-blue-100 text-blue-600 border-2 border-blue-600 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        )}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={clsx(
                          'mt-1 text-xs',
                          index === currentStepIndex
                            ? 'text-blue-600 font-medium dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < form.steps.length - 1 && (
                      <div
                        className={clsx(
                          'flex-1 h-0.5 mx-2',
                          index < currentStepIndex
                            ? 'bg-blue-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {submitted ? (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 dark:bg-green-900 dark:text-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Form Submitted Successfully!
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Thank you for submitting the form.
              </p>
              {isPublic && (
                <Button
                  onClick={() => {
                    setFormValues({});
                    setErrors({});
                    setSubmitted(false);
                    setCurrentStepIndex(0);
                  }}
                  className="mt-4"
                >
                  Submit Another Response
                </Button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-4">
                {currentStepData.fields.map((field) => (
                  <FormFieldRenderer
                    key={field.id}
                    field={field}
                    value={formValues[field.id] || ''}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id]}
                    isPreview={true}
                  />
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                {currentStepIndex > 0 ? (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    variant="secondary"
                  >
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {currentStepIndex < form.steps.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
