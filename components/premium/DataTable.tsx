import React, { useState } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { PremiumButton } from "./PremiumButton";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

export const DataTable = React.forwardRef<
  HTMLTableElement,
  DataTableProps<any>
>(
  (
    { columns, data, onRowClick, selectable, striped, hoverable = true },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: "asc" | "desc";
    } | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const handleSort = (key: string) => {
      setSortConfig((prev) => {
        if (prev?.key === key) {
          return {
            key,
            direction: prev.direction === "asc" ? "desc" : "asc",
          };
        }
        return { key, direction: "asc" };
      });
    };

    const sortedData = React.useMemo(() => {
      if (!sortConfig) return data;

      const sorted = [...data].sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a];
        const bVal = b[sortConfig.key as keyof typeof b];

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });

      return sorted;
    }, [data, sortConfig]);

    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table ref={ref} className="w-full border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable &&
                      (sortConfig?.key === column.key ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="opacity-50" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-gray-200 transition-colors ${
                  striped && index % 2 === 0 ? "bg-gray-50" : ""
                } ${hoverable ? "hover:bg-blue-50 cursor-pointer" : ""}`}
              >
                {selectable && (
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      checked={selectedRows.has(index)}
                      onChange={() => {
                        const newSelected = new Set(selectedRows);
                        if (newSelected.has(index)) {
                          newSelected.delete(index);
                        } else {
                          newSelected.add(index);
                        }
                        setSelectedRows(newSelected);
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-3 text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600">Aucune donnée disponible</p>
          </div>
        )}
      </div>
    );
  }
);

DataTable.displayName = "DataTable";
