import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { FormPreview } from "~/components/preview/FormPreview";
import { PreviewModeSelector } from "~/components/preview/PreviewModeSelector";
import { useFormStore } from "~/store/formStore";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Preview" },
    { name: "description", content: "Preview your form before sharing" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { formId } = params;
  
  if (!formId) {
    return redirect("/forms");
  }
  
  return json({ formId });
};

export default function PreviewPage() {
  const { formId } = useLoaderData<typeof loader>();
  const { forms, setActiveFormId } = useFormStore();
  
  useEffect(() => {
    // Set the active form when the component mounts
    if (formId) {
      const formExists = forms.some(form => form.id === formId);
      
      if (!formExists) {
        // Redirect to forms page if form doesn't exist
        window.location.href = "/forms";
        return;
      }
      
      setActiveFormId(formId);
    }
  }, [formId, forms, setActiveFormId]);
  
  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <div className="flex justify-center p-4 border-b border-gray-200 dark:border-gray-700">
          <PreviewModeSelector />
        </div>
        <div className="flex-1 flex justify-center p-4 overflow-auto">
          <FormPreview isPublic={false} />
        </div>
      </div>
    </AppLayout>
  );
}
