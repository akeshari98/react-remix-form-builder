import React from 'react';
import { Link } from '@remix-run/react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface ButtonLinkProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

const getVariantClasses = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  }
};

const getSizeClasses = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return 'text-xs px-2.5 py-1.5';
    case 'md':
      return 'text-sm px-4 py-2';
    case 'lg':
      return 'text-base px-6 py-3';
    default:
      return 'text-sm px-4 py-2';
  }
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors relative inline-flex items-center justify-center',
        getVariantClasses(variant),
        getSizeClasses(size),
        fullWidth ? 'w-full' : '',
        isLoading ? 'opacity-70 cursor-not-allowed' : '',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      <span className={clsx(isLoading ? 'invisible' : 'visible', 'flex items-center')}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </span>
    </button>
  );
};

export const ButtonLink = ({
  to,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
}: ButtonLinkProps) => {
  return (
    <Link
      to={to}
      className={clsx(
        'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors inline-flex items-center justify-center',
        getVariantClasses(variant),
        getSizeClasses(size),
        fullWidth ? 'w-full' : '',
        className
      )}
    >
      <span className="flex items-center">
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </span>
    </Link>
  );
};
