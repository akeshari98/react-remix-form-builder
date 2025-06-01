import React from 'react';
import { useFormStore } from '~/store/formStore';
import clsx from 'clsx';

export const PreviewModeSelector: React.FC = () => {
  const { previewMode, setPreviewMode } = useFormStore();

  return (
    <div className="flex items-center justify-center space-x-4 mb-4">
      <button
        type="button"
        onClick={() => setPreviewMode('desktop')}
        className={clsx(
          'p-2 rounded-md',
          previewMode === 'desktop'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        )}
        title="Desktop View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setPreviewMode('tablet')}
        className={clsx(
          'p-2 rounded-md',
          previewMode === 'tablet'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        )}
        title="Tablet View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setPreviewMode('mobile')}
        className={clsx(
          'p-2 rounded-md',
          previewMode === 'mobile'
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
        )}
        title="Mobile View"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </button>
    </div>
  );
};
