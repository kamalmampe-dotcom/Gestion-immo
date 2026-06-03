import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-xl border bg-white transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-200 shadow-sm hover:shadow-md",
        elevated: "border-gray-100 shadow-lg hover:shadow-xl",
        interactive: "border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer",
        subtle: "border-gray-100 bg-gray-50 shadow-none",
        premium: "border-gradient-to-r from-blue-200 to-cyan-200 shadow-xl hover:shadow-2xl",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

interface PremiumCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const PremiumCard = React.forwardRef<
  HTMLDivElement,
  PremiumCardProps
>(({ className, variant, padding, header, footer, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cardVariants({ variant, padding, className })}
    {...props}
  >
    {header && (
      <div className="border-b border-gray-200 pb-4 mb-4">
        {header}
      </div>
    )}
    {children}
    {footer && (
      <div className="border-t border-gray-200 pt-4 mt-4">
        {footer}
      </div>
    )}
  </div>
));

PremiumCard.displayName = "PremiumCard";

export const CardContent = ({ className, children }: any) => (
  <div className={className}>{children}</div>
);

export const CardHeader = ({ className, children }: any) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);

export const CardTitle = ({ className, children }: any) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children }: any) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);
