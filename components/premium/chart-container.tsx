import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  description?: string;
  trend?: number;
  children: React.ReactNode;
  onExport?: () => void;
}

export function ChartContainer({
  title,
  description,
  trend,
  children,
  onExport,
}: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {trend !== undefined && (
            <div className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">{trend}%</span>
            </div>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">{children}</div>
    </motion.div>
  );
}
