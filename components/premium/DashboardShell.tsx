import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Building2, Users, DollarSign, Settings, LogOut, Bell } from "lucide-react";
import { useUIStore } from "@/lib/stores/uiStore";
import { usePropertyStore } from "@/lib/stores/propertyStore";

interface DashboardShellProps {
  children: React.ReactNode;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Building2, label: "Propriétés", href: "/properties" },
  { icon: Users, label: "Locataires", href: "/tenants" },
  { icon: DollarSign, label: "Finances", href: "/finance" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
];

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { properties } = usePropertyStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:static w-64 h-full bg-white border-r border-gray-200 shadow-lg lg:shadow-none z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ImmoGestion
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-200 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            className="p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
