import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
        accent:
          "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 shadow-md hover:shadow-lg",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        outline:
          "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        warning:
          "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800",
      },
      size: {
        xs: "px-3 py-1.5 text-xs",
        sm: "px-3.5 py-2 text-sm",
        md: "px-4 py-2.5 text-base",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-3.5 text-lg",
      },
      fullWidth: {
        true: "w-full",
      },
      isLoading: {
        true: "opacity-70 cursor-wait",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  PremiumButtonProps
>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={buttonVariants({
          variant,
          size,
          fullWidth,
          isLoading,
          className,
        })}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

PremiumButton.displayName = "PremiumButton";
