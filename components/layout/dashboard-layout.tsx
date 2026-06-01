"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, Home, Building2, Users, FileText, AlertCircle, BarChart3 } from "lucide-react";
import { DashboardHeader } from "./dashboard-header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Building2, label: "Propriétés", href: "/dashboard/properties" },
    { icon: Users, label: "Locataires", href: "/dashboard/tenants" },
    { icon: FileText, label: "Contrats", href: "/dashboard/contracts" },
    { icon: AlertCircle, label: "Sinistres", href: "/dashboard/claims" },
    { icon: BarChart3, label: "Rapports", href: "/dashboard/reports" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-y-auto fixed lg:relative h-full z-40 lg:z-auto ${
          !mobileMenuOpen && "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl font-bold text-primary">ImmoGestion</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary"
              title={item.label}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-alert"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header with search and notifications */}
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
