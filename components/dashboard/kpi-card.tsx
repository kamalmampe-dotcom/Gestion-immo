import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  accentColor?: "accent" | "secondary" | "success" | "warning" | "alert";
}

const colorMap = {
  accent: "border-l-accent",
  secondary: "border-l-secondary",
  success: "border-l-success",
  warning: "border-l-warning",
  alert: "border-l-alert",
};

const iconBgMap = {
  accent: "bg-blue-50",
  secondary: "bg-cyan-50",
  success: "bg-green-50",
  warning: "bg-amber-50",
  alert: "bg-red-50",
};

const iconColorMap = {
  accent: "text-accent",
  secondary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  alert: "text-alert",
};

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  accentColor = "accent",
}: KPICardProps) {
  const isPositive = change && change > 0;

  return (
    <Card className={`border-l-4 ${colorMap[accentColor]} overflow-hidden`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted">{title}</p>
            <h3 className="text-3xl font-bold text-primary mt-2">{value}</h3>
            {change !== undefined && (
              <p className={`text-xs font-medium mt-2 ${isPositive ? "text-success" : "text-alert"}`}>
                {isPositive ? "↑" : "↓"} {Math.abs(change)}% vs mois dernier
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${iconBgMap[accentColor]}`}>
              <Icon className={`w-6 h-6 ${iconColorMap[accentColor]}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
