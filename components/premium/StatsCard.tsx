import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  change,
  trend,
  icon,
  variant = "primary",
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "danger":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "danger":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div
      className={`rounded-xl border p-6 transition-all hover:shadow-md ${getBackgroundColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-600">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`text-2xl ${getIconColor()}`}>{icon}</div>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {trend === "up" && (
            <TrendingUp size={16} className={getTrendColor()} />
          )}
          {trend === "down" && (
            <TrendingDown size={16} className={getTrendColor()} />
          )}
          <span className={`text-sm font-semibold ${getTrendColor()}`}>
            {change > 0 ? "+" : ""}{change}%
          </span>
        </div>
      )}
    </div>
  );
};
