import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { useFormStore } from "~/store/formStore";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "My Forms - Form Builder" },
    { name: "description", content: "Manage your forms and templates" },
  ];
};

export const loader = async () => {
  // In a real app, we would fetch forms from a database
  // For now, we'll use the client-side store
  return json({});
};

export default function Forms() {
  const { } = useLoaderData<typeof loader>();
  const { forms, createForm, deleteForm, duplicateForm } = useFormStore();

  // Reset active form when navigating to forms list
  useEffect(() => {
    useFormStore.getState().setActiveFormId(null);
  }, []);

  return (
    <AppLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Forms</h1>
          <button
            onClick={() => createForm()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No forms yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first form to get started</p>
            <button
              onClick={() => createForm()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{form.title || "Untitled Form"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {form.description || "No description"}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {form.steps.length} step{form.steps.length !== 1 ? "s" : ""} · {form.steps.reduce((acc, step) => acc + step.fields.length, 0)} field{form.steps.reduce((acc, step) => acc + step.fields.length, 0) !== 1 ? "s" : ""}
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`/builder/${form.id}`}
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors text-center"
                    >
                      Edit
                    </a>
                    <a
                      href={`/preview/${form.id}`}
                      className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                    >
                      Preview
                    </a>
                    <div className="relative group">
                      <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block">
                        <div className="py-1">
                          <button
                            onClick={() => duplicateForm(form.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Duplicate
                          </button>
                          <a
                            href={`/responses/${form.id}`}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            View Responses
                          </a>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this form?")) {
                                deleteForm(form.id);
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
      </div>
    </AppLayout>
  );
}
