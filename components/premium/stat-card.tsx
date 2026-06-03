import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
  sparkline?: number[];
}

const colorClasses = {
  primary: 'from-blue-500/10 to-blue-600/10 border-blue-200/30',
  success: 'from-green-500/10 to-green-600/10 border-green-200/30',
  warning: 'from-amber-500/10 to-amber-600/10 border-amber-200/30',
  danger: 'from-red-500/10 to-red-600/10 border-red-200/30',
  accent: 'from-cyan-500/10 to-cyan-600/10 border-cyan-200/30',
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
};

export function StatCard({
  label,
  value,
  unit,
  change,
  trend,
  icon,
  color = 'primary',
  sparkline,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClasses[color]} p-6 backdrop-blur-sm`}
    >
      {/* Background accent */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative z-10 space-y-4">
        {/* Header with icon and label */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          {icon && <div className="text-2xl text-gray-400">{icon}</div>}
        </div>

        {/* Value section */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </div>
        </div>

        {/* Trend indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            {trend === 'up' && <TrendingUp className={`h-4 w-4 ${trendColors.up}`} />}
            {trend === 'down' && <TrendingDown className={`h-4 w-4 ${trendColors.down}`} />}
            <span className={`text-sm font-semibold ${trendColors[trend || 'up']}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}

        {/* Sparkline placeholder */}
        {sparkline && (
          <div className="mt-4 h-12 rounded-lg bg-white/30 backdrop-blur-sm" />
        )}
      </div>
    </motion.div>
  );
}
