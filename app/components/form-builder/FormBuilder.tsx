import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useFormStore, FieldType, FormField } from '~/store/formStore';
import { DraggableField } from './DraggableField';
import { FieldConfigPanel } from './FieldConfigPanel';
import { Button } from '~/components/ui/Button';
import { FormFieldRenderer } from '~/components/form-fields/FormFieldRenderer';

const fieldTypes: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'text',
    label: 'Text',
    icon: (
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
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    ),
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: (
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
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    ),
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: (
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
          d="M19 9l-7 7-7-7"
        />
      </svg>
    ),
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: (
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
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: (
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    type: 'date',
    label: 'Date',
    icon: (
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
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    type: 'email',
    label: 'Email',
    icon: (
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
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: (
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
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    type: 'number',
    label: 'Number',
    icon: (
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
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        />
      </svg>
    ),
  },
  {
    type: 'password',
    label: 'Password',
    icon: (
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
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
];

export const FormBuilder: React.FC = () => {
  const {
    currentForm,
    currentStep,
    activeFieldId,
    isDragging,
    addField,
    updateField,
    deleteField,
    reorderFields,
    setActiveField,
    setDragging,
    addStep,
    updateStep,
    deleteStep,
    setCurrentStep,
    updateForm,
    undo,
    redo,
  } = useFormStore();

  const [draggedField, setDraggedField] = useState<FormField | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          No form selected. Please create or select a form to start building.
        </p>
      </div>
    );
  }

  const currentStepData = currentForm.steps[currentStep];
  const activeField = currentStepData?.fields.find((f) => f.id === activeFieldId) || null;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setDragging(true);
    const draggedField = currentStepData.fields.find((f) => f.id === active.id);
    if (draggedField) {
      setDraggedField(draggedField);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDragging(false);
    setDraggedField(null);

    if (over && active.id !== over.id) {
      const oldIndex = currentStepData.fields.findIndex((f) => f.id === active.id);
      const newIndex = currentStepData.fields.findIndex((f) => f.id === over.id);
      reorderFields(currentStepData.id, oldIndex, newIndex);
    }
  };

  const handleAddField = (type: FieldType) => {
    addField(currentStepData.id, type);
  };

  const handleUpdateField = (field: FormField) => {
    updateField(currentStepData.id, field);
  };

  const handleDeleteField = (fieldId: string) => {
    deleteField(currentStepData.id, fieldId);
  };

  const handleUpdateStepTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStep(currentStepData.id, e.target.value);
  };

  const handleUpdateFormTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm({
      ...currentForm,
      title: e.target.value,
    });
  };

  const handleUpdateFormDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateForm({
      ...currentForm,
      description: e.target.value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Sidebar - Field Types */}
      <div className="md:col-span-1">
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
            Add Fields
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {fieldTypes.map((fieldType) => (
              <button
                key={fieldType.type}
                type="button"
                onClick={() => handleAddField(fieldType.type)}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <span className="text-gray-500 dark:text-gray-400">{fieldType.icon}</span>
                <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  {fieldType.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
              Form Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="form-title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Form Title
                </label>
                <input
                  type="text"
                  id="form-title"
                  value={currentForm.title}
                  onChange={handleUpdateFormTitle}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="form-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Form Description
                </label>
                <textarea
                  id="form-description"
                  value={currentForm.description || ''}
                  onChange={handleUpdateFormDescription}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-2">
            <Button onClick={undo} variant="secondary" size="sm">
              Undo
            </Button>
            <Button onClick={redo} variant="secondary" size="sm">
              Redo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Form Builder */}
      <div className="md:col-span-1">
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={currentStepData.title}
                onChange={handleUpdateStepTitle}
                className="block w-full text-lg font-medium border-0 border-b border-transparent focus:border-gray-300 focus:ring-0 dark:bg-gray-800 dark:text-white"
                placeholder="Step Title"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={addStep}
                variant="secondary"
                size="sm"
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                }
              >
                Add Step
              </Button>
              {currentForm.steps.length > 1 && (
                <Button
                  onClick={() => deleteStep(currentStepData.id)}
                  variant="danger"
                  size="sm"
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  }
                >
                  Delete Step
                </Button>
              )}
            </div>
          </div>

          {/* Step Navigation */}
          {currentForm.steps.length > 1 && (
            <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
              {currentForm.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentStep === index
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {index + 1}. {step.title}
                </button>
              ))}
            </div>
          )}

          {/* Form Fields */}
          <div className="min-h-[300px]">
            {currentStepData.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-md dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  Drag and drop fields here
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Or select a field type from the left panel
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentStepData.fields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {currentStepData.fields.map((field) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      isActive={field.id === activeFieldId}
                      onClick={() => setActiveField(field.id)}
                      onDelete={() => handleDeleteField(field.id)}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {draggedField ? (
                    <div className="border rounded-md p-4 bg-white shadow-md dark:bg-gray-800 dark:border-gray-700">
                      <FormFieldRenderer
                        field={draggedField}
                        value=""
                        onChange={() => {}}
                        disabled={true}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Field Configuration */}
      <div className="md:col-span-1">
        {activeField ? (
          <FieldConfigPanel field={activeField} onUpdate={handleUpdateField} />
        ) : (
          <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              Select a field to configure its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
