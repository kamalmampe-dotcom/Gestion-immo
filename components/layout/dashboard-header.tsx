"use client";

import { GlobalSearch } from "@/components/search/global-search";
import { NotificationCenter } from "@/components/notifications/notification-center";
import { Menu } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu size={20} className="text-primary" />
      </button>

      <div className="flex-1 flex items-center justify-between gap-4">
        <GlobalSearch />
        <div className="flex items-center gap-2">
          <NotificationCenter />
        </div>
      </div>
    </header>
  );
}
