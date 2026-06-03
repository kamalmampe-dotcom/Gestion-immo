import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled';
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, success, hint, icon, variant = 'default', className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-900">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}

          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.02 }}
            className={`w-full rounded-lg border-2 px-4 py-2.5 font-medium transition-all ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : success
                ? 'border-green-300 bg-green-50/30 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            } ${variant === 'filled' ? 'bg-gray-100' : ''} focus:outline-none ${className}`}
            {...props}
          />

          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
          )}
          {success && !error && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
        </div>

        {error && <p className="text-sm text-red-600 flex items-center gap-1">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
