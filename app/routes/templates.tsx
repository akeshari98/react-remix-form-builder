import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { useFormStore } from "~/store/formStore";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Templates - Form Builder" },
    { name: "description", content: "Browse and use form templates to quickly create forms" },
  ];
};

export const loader = async () => {
  // In a real app, we would fetch templates from a database
  // For now, we'll use the client-side store
  return json({});
};

export default function Templates() {
  const { } = useLoaderData<typeof loader>();
  const { templates, createFormFromTemplate, saveFormAsTemplate, deleteTemplate } = useFormStore();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const { forms } = useFormStore();

  const handleSaveTemplate = () => {
    if (selectedFormId && templateName) {
      saveFormAsTemplate(selectedFormId, templateName, templateDescription);
      setShowSaveModal(false);
      setTemplateName("");
      setTemplateDescription("");
      setSelectedFormId(null);
    }
  };

  return (
    <AppLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Templates</h1>
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={forms.length === 0}
          >
            Save Form as Template
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No templates yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Save a form as a template to reuse it later</p>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={forms.length === 0}
            >
              Save Form as Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{template.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {template.description || "No description"}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {template.data.steps.length} step{template.data.steps.length !== 1 ? "s" : ""} · 
                    {template.data.steps.reduce((acc, step) => acc + step.fields.length, 0)} field{template.data.steps.reduce((acc, step) => acc + step.fields.length, 0) !== 1 ? "s" : ""}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => createFormFromTemplate(template.id)}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                    <div className="relative group">
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this template?")) {
                                deleteTemplate(template.id);
                              }
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save as Template Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Save as Template</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Form
                </label>
                <select
                  value={selectedFormId || ""}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a form</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.title || "Untitled Form"}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter template name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedFormId || !templateName}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
