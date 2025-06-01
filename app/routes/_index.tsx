import { redirect } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Builder - Create and Share Forms" },
    { name: "description", content: "A powerful form builder to create, customize, and share forms with real-time validation." },
  ];
};

export const loader: LoaderFunction = async () => {
  // Redirect to the forms list page
  return redirect("/forms");
};

export default function Index() {
  return null; // This component won't render as we're redirecting
}
