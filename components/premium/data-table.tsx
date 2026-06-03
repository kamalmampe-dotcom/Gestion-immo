import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  striped?: boolean;
  hoverable?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  striped = true,
  hoverable = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  let sortedData = [...data];
  if (sortKey && sortDirection) {
    sortedData.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                style={{ width: col.width }}
              >
                <div
                  className={`flex items-center gap-2 ${col.sortable ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span>{col.label}</span>
                  {col.sortable && (
                    <div className="text-gray-400">
                      {sortKey === col.key && sortDirection === 'asc' && (
                        <ChevronUp className="h-4 w-4" />
                      )}
                      {sortKey === col.key && sortDirection === 'desc' && (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      {sortKey !== col.key && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sortedData.map((item, idx) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onRowClick?.(item)}
                className={`border-t border-gray-200 transition-colors ${
                  striped && idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                } ${hoverable ? 'hover:bg-blue-50/50 cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                  </td>
                ))}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {sortedData.length === 0 && (
        <div className="bg-white px-6 py-8 text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}
