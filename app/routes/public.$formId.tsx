import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FormPreview } from "~/components/preview/FormPreview";
import { useFormStore } from "~/store/formStore";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

interface LoaderData {
  formId: string;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  // Since we're only returning formId from the loader, we'll use a generic title
  const formTitle = "Form";
  return [
    { title: `${formTitle} - Fill Out Form` },
    { name: "description", content: "Complete and submit this form" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { formId } = params;
  
  if (!formId) {
    return redirect("/forms");
  }
  
  // In a real app, we would fetch the form from a database
  // For now, we'll use the client-side store
  return json({ formId });
};

export default function PublicFormPage() {
  const { formId } = useLoaderData<typeof loader>();
  const { forms, setActiveFormId } = useFormStore();
  const [form, setForm] = useState<any>(null);
  const [formNotFound, setFormNotFound] = useState(false);
  
  useEffect(() => {
    // Set the active form when the component mounts
    if (formId) {
      const foundForm = forms.find(f => f.id === formId);
      
      if (!foundForm) {
        setFormNotFound(true);
        return;
      }
      
      setForm(foundForm);
      setActiveFormId(formId);
    }
  }, [formId, forms, setActiveFormId]);
  
  if (formNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Form Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {form?.title || "Form"}
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex justify-center p-4 overflow-auto">
        <div className="w-full max-w-3xl">
          <FormPreview isPublic={true} />
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-inner">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Created with Form Builder
        </div>
      </footer>
    </div>
  );
}
