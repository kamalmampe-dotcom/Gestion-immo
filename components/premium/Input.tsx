import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-600">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 rounded-lg border-2 transition-all
              focus:outline-none focus:ring-0
              placeholder:text-gray-400 text-gray-900
              ${
                error
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : "border-gray-300 focus:border-blue-500 bg-white"
              }
              ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}
              ${icon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${className || ""}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-gray-600">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
