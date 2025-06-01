import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { useEffect } from "react";
import FormBuilder from "~/components/form-builder/FormBuilder";
import AppLayout from "~/components/layout/AppLayout";
import { useFormStore } from "~/store/formStore";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Builder - Edit Form" },
    { name: "description", content: "Create and customize your form with our drag-and-drop builder" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { formId } = params;
  
  if (!formId) {
    return redirect("/forms");
  }
  
  return json({ formId });
};

export default function BuilderPage() {
  const { formId } = useLoaderData<typeof loader>();
  const params = useParams();
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
        <FormBuilder />
      </div>
    </AppLayout>
  );
}
