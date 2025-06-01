import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { useFormStore } from "~/store/formStore";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Import/Export Forms - Form Builder" },
    { name: "description", content: "Import and export your forms as JSON files" },
  ];
};

export const loader = async () => {
  return json({});
};

export default function ImportExport() {
  const { } = useLoaderData<typeof loader>();
  const { forms, importForms } = useFormStore();
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to export all forms as a JSON file
  const handleExportAll = () => {
    if (forms.length === 0) {
      return;
    }

    const dataStr = JSON.stringify(forms, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `form-builder-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to export a single form as a JSON file
  const handleExportForm = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (!form) return;

    const dataStr = JSON.stringify(form, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `form-${form.title || 'untitled'}-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Check if it's an array of forms or a single form
        if (Array.isArray(data)) {
          // Validate each form has required properties
          const isValid = data.every(form => 
            form && typeof form === 'object' && 
            'id' in form && 'title' in form && 'steps' in form
          );
          
          if (!isValid) {
            setImportError("Invalid form data format in the imported file.");
            return;
          }
          
          importForms(data);
          setImportSuccess(`Successfully imported ${data.length} form${data.length !== 1 ? 's' : ''}.`);
        } else if (data && typeof data === 'object' && 'id' in data && 'title' in data && 'steps' in data) {
          // It's a single form
          importForms([data]);
          setImportSuccess(`Successfully imported form: ${data.title || 'Untitled'}.`);
        } else {
          setImportError("Invalid form data format in the imported file.");
        }
      } catch (error) {
        setImportError("Failed to parse the imported file. Please ensure it's a valid JSON file.");
        console.error("Import error:", error);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.onerror = () => {
      setImportError("An error occurred while reading the file.");
    };
    
    reader.readAsText(file);
  };

  return (
    <AppLayout>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Import & Export Forms</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Export Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Export Forms</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Export your forms as JSON files to back them up or transfer them to another device.
            </p>
            
            <div className="mb-6">
              <button
                onClick={handleExportAll}
                disabled={forms.length === 0}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                Export All Forms ({forms.length})
              </button>
              
              {forms.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  You don't have any forms to export yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {forms.map(form => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                        {form.title || "Untitled Form"}
                      </span>
                      <button
                        onClick={() => handleExportForm(form.id)}
                        className="ml-2 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        Export
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Import Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Import Forms</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Import forms from JSON files that were previously exported.
            </p>
            
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="w-full flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Click to select a file or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                    JSON files only
                  </p>
                </div>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".json,application/json"
                  className="sr-only"
                  onChange={handleImport}
                  ref={fileInputRef}
                />
              </label>
            </div>
            
            {importError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
                <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
              </div>
            )}
            
            {importSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-600 dark:text-green-400">{importSuccess}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
