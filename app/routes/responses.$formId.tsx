import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { useFormStore } from "~/store/formStore";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Responses" },
    { name: "description", content: "View responses submitted to your form" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { formId } = params;
  
  if (!formId) {
    return redirect("/forms");
  }
  
  return json({ formId });
};

export default function ResponsesPage() {
  const { formId } = useLoaderData<typeof loader>();
  const { forms, responses, setActiveFormId } = useFormStore();
  const [activeForm, setActiveForm] = useState<any>(null);
  const [formResponses, setFormResponses] = useState<any[]>([]);
  
  useEffect(() => {
    // Set the active form when the component mounts
    if (formId) {
      const form = forms.find(form => form.id === formId);
      
      if (!form) {
        // Redirect to forms page if form doesn't exist
        window.location.href = "/forms";
        return;
      }
      
      setActiveFormId(formId);
      setActiveForm(form);
      
      // Filter responses for this form
      const filteredResponses = responses.filter(response => response.formId === formId);
      setFormResponses(filteredResponses);
    }
  }, [formId, forms, responses, setActiveFormId]);
  
  // Function to get field label by ID
  const getFieldLabel = (fieldId: string) => {
    if (!activeForm) return "Unknown Field";
    
    for (const step of activeForm.steps) {
      const field = step.fields.find((f: any) => f.id === fieldId);
      if (field) {
        return field.label || field.placeholder || field.name || "Unlabeled Field";
      }
    }
    
    return "Unknown Field";
  };
  
  return (
    <AppLayout>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {activeForm ? `Responses: ${activeForm.title || "Untitled Form"}` : "Form Responses"}
          </h1>
          <a
            href={`/builder/${formId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Form
          </a>
        </div>
        
        {formResponses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No responses yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Share your form to collect responses
            </p>
            <a
              href={`/preview/${formId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Preview Form
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submission Date
                  </th>
                  {activeForm && activeForm.steps.flatMap((step: any) => step.fields).map((field: any) => (
                    <th key={field.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {field.label || field.placeholder || field.name || "Unlabeled Field"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {formResponses.map((response) => (
                  <tr key={response.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                    {activeForm && activeForm.steps.flatMap((step: any) => step.fields).map((field: any) => (
                      <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {response.data[field.id] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
