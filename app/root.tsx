import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useFormStore } from "./store/formStore";

import "./tailwind.css";

// Declare global window properties for GitHub Pages SPA routing
declare global {
  interface Window {
    __remixRouterNavigate?: (path: string) => void;
  }
}

export const links: LinksFunction = () => [
  // Include SPA redirect script for GitHub Pages
  { rel: "script", href: "/spa-redirect.js", async: true },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Get theme preference from cookie if available
  const cookieHeader = request.headers.get("Cookie");
  const cookies = cookieHeader ? Object.fromEntries(
    cookieHeader.split("; ").map(cookie => {
      const [name, value] = cookie.split("=");
      return [name, value];
    })
  ) : {};

  const theme = cookies.theme || "light";
  
  return json({ theme });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Handle GitHub Pages SPA routing
function handleSpaRouting() {
  // Only run on client
  if (typeof window === 'undefined') return '';

  // Check if we're on GitHub Pages (has the repo name in the path)
  const isGitHubPages = window.location.pathname.includes('/react-remix-form-builder/');
  
  // Make this function available globally for the redirect script
  if (isGitHubPages && typeof window !== 'undefined') {
    window.__remixRouterNavigate = (path) => {
      // This will be defined by the spa-redirect.js script
      console.log('SPA redirect to', path);
    };
  }
  
  return '';
}

export default function App() {
  const { theme: initialTheme } = useLoaderData<typeof loader>();
  const { theme, toggleTheme } = useFormStore();
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Initialize theme from cookie on first load
  useEffect(() => {
    if (!themeLoaded) {
      // This is a hack to prevent hydration mismatch
      // We need to wait for client-side hydration before applying the theme
      setThemeLoaded(true);

      // Apply the initial theme from the server if it exists
      // This ensures the theme is applied even before Zustand is hydrated
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [initialTheme, themeLoaded]);

  // Update document class when theme changes in the store
  useEffect(() => {
    if (themeLoaded) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Save theme preference in cookie
      document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [theme, themeLoaded]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Outlet />
    </div>
  );
}
