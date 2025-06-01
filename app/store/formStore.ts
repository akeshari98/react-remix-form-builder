import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'number'
  | 'email'
  | 'phone'
  | 'password';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: FieldOption[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  steps: FormStep[];
  createdAt: number;
  updatedAt: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: number;
}

export interface Template extends Form {
  templateId: string;
}

interface FormState {
  forms: Form[];
  responses: FormResponse[];
  currentForm: Form | null;
  currentStep: number;
  activeFieldId: string | null;
  isDragging: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  theme: 'light' | 'dark';
  activeFormId: string | null;
  templates: Template[];
  history: {
    past: Form[];
    future: Form[];
  };
  
  // Form operations
  createForm: () => void;
  updateForm: (form: Form) => void;
  deleteForm: (formId: string) => void;
  duplicateForm: (formId: string) => void;
  setCurrentForm: (formId: string) => void;
  setActiveFormId: (formId: string | null) => void;
  resetCurrentForm: () => void;
  importForms: (forms: Form[]) => void;
  
  // Step operations
  addStep: () => void;
  updateStep: (stepId: string, title: string) => void;
  deleteStep: (stepId: string) => void;
  setCurrentStep: (step: number) => void;
  
  // Field operations
  addField: (stepId: string, type: FieldType) => void;
  updateField: (stepId: string, field: FormField) => void;
  deleteField: (stepId: string, fieldId: string) => void;
  reorderFields: (stepId: string, sourceIndex: number, destinationIndex: number) => void;
  setActiveField: (fieldId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  
  // Preview operations
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  
  // Template operations
  loadTemplate: (templateId: string) => void;
  saveAsTemplate: () => void;
  createFormFromTemplate: (templateId: string) => void;
  saveFormAsTemplate: (formId: string, name: string, description: string) => void;
  deleteTemplate: (templateId: string) => void;
  
  // Response operations
  addResponse: (formId: string, data: Record<string, any>) => void;
  getResponses: (formId: string) => FormResponse[];
  
  // Theme operations
  toggleTheme: () => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
}

const createDefaultForm = (): Form => ({
  id: uuidv4(),
  title: 'Untitled Form',
  steps: [
    {
      id: uuidv4(),
      title: 'Step 1',
      fields: [],
    },
  ],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

// Function to get the initial theme from localStorage if available
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    try {
      // Try to get theme from localStorage
      const storedState = localStorage.getItem('form-builder-storage');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        if (parsedState.state && parsedState.state.theme) {
          return parsedState.state.theme;
        }
      }
      
      // If no stored theme, check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
    }
  }
  
  // Default to light theme
  return 'light';
};

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      forms: [],
      responses: [],
      currentForm: null,
      currentStep: 0,
      activeFieldId: null,
      isDragging: false,
      previewMode: 'desktop',
      theme: getInitialTheme(),
      activeFormId: null,
      templates: [],
      history: {
        past: [],
        future: [],
      },
      
      // Form operations
      createForm: () => {
        const newForm = createDefaultForm();
        set((state) => ({
          forms: [...state.forms, newForm],
          currentForm: newForm,
          currentStep: 0,
          activeFieldId: null,
          history: {
            past: [],
            future: [],
          },
        }));
      },
      
      updateForm: (form) => {
        const updatedForm = {
          ...form,
          updatedAt: Date.now(),
        };
        
        set((state) => {
          // Add current state to history for undo
          const past = [...state.history.past, state.currentForm];
          
          return {
            forms: state.forms.map((f) => (f.id === form.id ? updatedForm : f)),
            currentForm: updatedForm,
            history: {
              past,
              future: [],
            },
          };
        });
      },
      
      deleteForm: (formId) => {
        set((state) => ({
          forms: state.forms.filter((f) => f.id !== formId),
          currentForm: state.currentForm?.id === formId ? null : state.currentForm,
        }));
      },
      
      setCurrentForm: (formId) => {
        const form = get().forms.find((f) => f.id === formId) || null;
        set({
          currentForm: form,
          activeFormId: formId,
          currentStep: 0,
          activeFieldId: null,
          history: {
            past: [],
            future: [],
          },
        });
      },
      
      setActiveFormId: (formId) => {
        set({ activeFormId: formId });
      },
      
      duplicateForm: (formId) => {
        const formToDuplicate = get().forms.find(f => f.id === formId);
        if (!formToDuplicate) return;
        
        const newForm = {
          ...JSON.parse(JSON.stringify(formToDuplicate)),
          id: uuidv4(),
          title: `${formToDuplicate.title} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set(state => ({
          forms: [...state.forms, newForm]
        }));
      },
      
      importForms: (forms) => {
        // Ensure each imported form has a unique ID
        const importedForms = forms.map(form => ({
          ...form,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        }));
        
        set(state => ({
          forms: [...state.forms, ...importedForms]
        }));
      },
      
      resetCurrentForm: () => {
        set({
          currentForm: null,
          currentStep: 0,
          activeFieldId: null,
        });
      },
      
      // Step operations
      addStep: () => {
        if (!get().currentForm) return;
        
        const newStep = {
          id: uuidv4(),
          title: `Step ${get().currentForm.steps.length + 1}`,
          fields: [],
        };
        
        set((state) => {
          if (!state.currentForm) return state;
          
          const updatedForm = {
            ...state.currentForm,
            steps: [...state.currentForm.steps, newStep],
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      updateStep: (stepId, title) => {
        set((state) => {
          if (!state.currentForm) return state;
          
          const updatedSteps = state.currentForm.steps.map((step) =>
            step.id === stepId ? { ...step, title } : step
          );
          
          const updatedForm = {
            ...state.currentForm,
            steps: updatedSteps,
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      deleteStep: (stepId) => {
        set((state) => {
          if (!state.currentForm) return state;
          
          // Don't delete if it's the only step
          if (state.currentForm.steps.length <= 1) return state;
          
          const updatedSteps = state.currentForm.steps.filter((step) => step.id !== stepId);
          
          const updatedForm = {
            ...state.currentForm,
            steps: updatedSteps,
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            currentStep: Math.min(state.currentStep, updatedSteps.length - 1),
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      
      // Field operations
      addField: (stepId, type) => {
        set((state) => {
          if (!state.currentForm) return state;
          
          const newField: FormField = {
            id: uuidv4(),
            type,
            label: `New ${type} field`,
            placeholder: '',
            required: false,
            ...(type === 'dropdown' || type === 'radio'
              ? {
                  options: [
                    { id: uuidv4(), label: 'Option 1', value: 'option1' },
                    { id: uuidv4(), label: 'Option 2', value: 'option2' },
                  ],
                }
              : {}),
          };
          
          const updatedSteps = state.currentForm.steps.map((step) =>
            step.id === stepId
              ? { ...step, fields: [...step.fields, newField] }
              : step
          );
          
          const updatedForm = {
            ...state.currentForm,
            steps: updatedSteps,
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            activeFieldId: newField.id,
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      updateField: (stepId, field) => {
        set((state) => {
          if (!state.currentForm) return state;
          
          const updatedSteps = state.currentForm.steps.map((step) =>
            step.id === stepId
              ? {
                  ...step,
                  fields: step.fields.map((f) => (f.id === field.id ? field : f)),
                }
              : step
          );
          
          const updatedForm = {
            ...state.currentForm,
            steps: updatedSteps,
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      deleteField: (stepId, fieldId) => {
        set((state) => {
          if (!state.currentForm) return state;
          
          const updatedSteps = state.currentForm.steps.map((step) =>
            step.id === stepId
              ? {
                  ...step,
                  fields: step.fields.filter((f) => f.id !== fieldId),
                }
              : step
          );
          
          const updatedForm = {
            ...state.currentForm,
            steps: updatedSteps,
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            activeFieldId: state.activeFieldId === fieldId ? null : state.activeFieldId,
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      reorderFields: (stepId, sourceIndex, destinationIndex) => {
        set((state) => {
          if (!state.currentForm) return state;
          
          const step = state.currentForm.steps.find((s) => s.id === stepId);
          if (!step) return state;
          
          const newFields = [...step.fields];
          const [removed] = newFields.splice(sourceIndex, 1);
          newFields.splice(destinationIndex, 0, removed);
          
          const updatedSteps = state.currentForm.steps.map((s) =>
            s.id === stepId ? { ...s, fields: newFields } : s
          );
          
          const updatedForm = {
            ...state.currentForm,
            steps: updatedSteps,
            updatedAt: Date.now(),
          };
          
          return {
            currentForm: updatedForm,
            forms: state.forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)),
          };
        });
      },
      
      setActiveField: (fieldId) => {
        set({ activeFieldId: fieldId });
      },
      
      setDragging: (isDragging) => {
        set({ isDragging });
      },
      
      // Preview operations
      setPreviewMode: (mode) => {
        set({ previewMode: mode });
      },
      
      // Template operations
      loadTemplate: (templateId) => {
        // This would load a predefined template
        // For now, we'll just create a simple Contact Us form
        if (templateId === 'contact-us') {
          const contactForm: Form = {
            id: uuidv4(),
            title: 'Contact Us',
            description: 'Get in touch with our team',
            steps: [
              {
                id: uuidv4(),
                title: 'Contact Information',
                fields: [
                  {
                    id: uuidv4(),
                    type: 'text',
                    label: 'Name',
                    placeholder: 'Enter your full name',
                    required: true,
                  },
                  {
                    id: uuidv4(),
                    type: 'email',
                    label: 'Email',
                    placeholder: 'Enter your email address',
                    required: true,
                    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                  },
                  {
                    id: uuidv4(),
                    type: 'phone',
                    label: 'Phone',
                    placeholder: 'Enter your phone number',
                    required: false,
                  },
                ],
              },
              {
                id: uuidv4(),
                title: 'Message',
                fields: [
                  {
                    id: uuidv4(),
                    type: 'dropdown',
                    label: 'Subject',
                    placeholder: 'Select a subject',
                    required: true,
                    options: [
                      { id: uuidv4(), label: 'General Inquiry', value: 'general' },
                      { id: uuidv4(), label: 'Support', value: 'support' },
                      { id: uuidv4(), label: 'Feedback', value: 'feedback' },
                    ],
                  },
                  {
                    id: uuidv4(),
                    type: 'textarea',
                    label: 'Message',
                    placeholder: 'Enter your message',
                    required: true,
                    minLength: 10,
                    maxLength: 500,
                  },
                ],
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          
          set((state) => ({
            forms: [...state.forms, contactForm],
            currentForm: contactForm,
            currentStep: 0,
            activeFieldId: null,
          }));
        }
      },
      
      saveAsTemplate: () => {
        // Implementation - this is a placeholder function
        // We'll use the more specific saveFormAsTemplate instead
        const form = get().currentForm;
        if (!form) return;
        // Just delegate to saveFormAsTemplate
        // Using non-null assertion because we've checked that form is not null
        get().saveFormAsTemplate(form!.id, form!.title, form!.description || '');
      },
      
      saveFormAsTemplate: (formId, name, description) => {
        const form = get().forms.find(f => f.id === formId);
        if (!form) return;
        
        const template = {
          ...JSON.parse(JSON.stringify(form)),
          templateId: uuidv4(),
          title: name,
          description: description || ''
        };
        
        set(state => ({
          templates: [...state.templates, template]
        }));
      },
      
      createFormFromTemplate: (templateId) => {
        const template = get().templates.find(t => t.templateId === templateId);
        if (!template) return;
        
        const newForm = {
          ...JSON.parse(JSON.stringify(template)),
          id: uuidv4(),
          templateId: undefined,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        
        set(state => ({
          forms: [...state.forms, newForm],
          currentForm: newForm,
          activeFormId: newForm.id,
          currentStep: 0
        }));
      },
      
      deleteTemplate: (templateId) => {
        set(state => ({
          templates: state.templates.filter(t => t.templateId !== templateId)
        }));
      },
      
      // Response operations
      addResponse: (formId, data) => {
        const newResponse: FormResponse = {
          id: uuidv4(),
          formId,
          data,
          submittedAt: Date.now(),
        };
        
        set((state) => ({
          responses: [...state.responses, newResponse],
        }));
      },
      
      getResponses: (formId) => {
        return get().responses.filter((r) => r.formId === formId);
      },
      
      // Theme operations
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          console.log('Toggling theme from', state.theme, 'to', newTheme);
          return { theme: newTheme };
        });
      },
      
      // History operations
      undo: () => {
        set((state) => {
          if (state.history.past.length === 0 || !state.currentForm) return state;
          
          const newPast = [...state.history.past];
          const previous = newPast.pop();
          
          if (!previous) return state;
          
          return {
            currentForm: previous,
            forms: state.forms.map((f) => (f.id === previous.id ? previous : f)),
            history: {
              past: newPast,
              future: [state.currentForm, ...state.history.future],
            },
          };
        });
      },
      
      redo: () => {
        set((state) => {
          if (state.history.future.length === 0 || !state.currentForm) return state;
          
          const [next, ...newFuture] = state.history.future;
          
          if (!next) return state;
          
          return {
            currentForm: next,
            forms: state.forms.map((f) => (f.id === next.id ? next : f)),
            history: {
              past: [...state.history.past, state.currentForm],
              future: newFuture,
            },
          };
        });
      },
    }),
    {
      name: 'form-builder-storage',
    }
  )
);
