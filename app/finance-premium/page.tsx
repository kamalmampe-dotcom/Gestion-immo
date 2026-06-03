"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardShell } from "@/components/premium/DashboardShell";
import { PremiumCard, CardHeader, CardTitle, CardDescription } from "@/components/premium/PremiumCard";
import { StatsCard } from "@/components/premium/StatsCard";
import { PremiumButton } from "@/components/premium/PremiumButton";
import { DataTable } from "@/components/premium/DataTable";
import { Modal } from "@/components/premium/Modal";
import { Input } from "@/components/premium/Input";
import { usePropertyStore } from "@/lib/stores/propertyStore";
import { useAnalyticsStore } from "@/lib/stores/analyticsStore";

export default function FinancePage() {
  const { payments, tenants, properties, addPayment, recordPayment } = usePropertyStore();
  const { analytics, calculateAnalytics, metrics } = useAnalyticsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid" | "overdue">("all");

  useEffect(() => {
    calculateAnalytics(properties, payments, [], tenants);
  }, [properties, payments, tenants]);

  const overduePayments = payments.filter(
    (p) => p.status === "pending" && new Date(p.dueDate) < new Date()
  );

  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "all") return true;
    return p.status === filterStatus;
  });

  const expensesByCategory = [
    { name: "Maintenance", value: analytics.maintenanceCosts * 0.4 },
    { name: "Impôts & Frais", value: analytics.maintenanceCosts * 0.3 },
    { name: "Assurances", value: analytics.maintenanceCosts * 0.2 },
    { name: "Services", value: analytics.maintenanceCosts * 0.1 },
  ];

  const paymentColumns = [
    { 
      key: "tenantId" as const, 
      label: "Locataire", 
      width: "180px",
      render: (id: string) => {
        const tenant = tenants.find((t) => t.id === id);
        return tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unknown";
      }
    },
    { 
      key: "amount" as const, 
      label: "Montant", 
      width: "120px",
      render: (v: number) => `${v.toLocaleString()} FCFA`
    },
    { 
      key: "dueDate" as const, 
      label: "Échéance", 
      width: "120px",
      sortable: true,
      render: (v: string) => new Date(v).toLocaleDateString("fr-FR")
    },
    { 
      key: "paidDate" as const, 
      label: "Date de Paiement", 
      width: "140px",
      render: (v?: string) => v ? new Date(v).toLocaleDateString("fr-FR") : "-"
    },
    {
      key: "status" as const,
      label: "Statut",
      width: "100px",
      render: (v: string) => {
        const colors: Record<string, string> = {
          paid: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          overdue: "bg-red-100 text-red-800",
          cancelled: "bg-gray-100 text-gray-800",
        };
        const labels: Record<string, string> = {
          paid: "Payé",
          pending: "En attente",
          overdue: "En retard",
          cancelled: "Annulé",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[v]}`}>
            {labels[v] || v}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardShell>
      <motion.div className="space-y-8 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finances</h1>
              <p className="mt-2 text-gray-600">Gérez vos revenus et dépenses</p>
            </div>
            <PremiumButton
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
              onClick={() => setIsModalOpen(true)}
            >
              Ajouter Paiement
            </PremiumButton>
          </div>
        </motion.div>

        {/* Financial Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Revenus Totaux"
              value={`${(analytics.totalRevenue / 1000000).toFixed(1)}M`}
              change={15}
              trend="up"
              icon={<CreditCard className="text-green-600" />}
              variant="success"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Dépenses"
              value={`${(analytics.maintenanceCosts / 1000000).toFixed(1)}M`}
              change={5}
              trend="down"
              variant="warning"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Paiements en Retard"
              value={overduePayments.length}
              change={-2}
              trend="down"
              icon={<AlertCircle className="text-red-600" />}
              variant="danger"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Taux Collecte"
              value={`${((payments.filter((p) => p.status === "paid").length / Math.max(payments.length, 1)) * 100).toFixed(0)}%`}
              change={8}
              trend="up"
              icon={<TrendingUp className="text-blue-600" />}
              variant="primary"
            />
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          {/* Revenue Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PremiumCard
              header={
                <CardHeader>
                  <CardTitle>Tendance des Revenus</CardTitle>
                  <CardDescription>12 derniers mois</CardDescription>
                </CardHeader>
              }
              padding="lg"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.slice(-12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </PremiumCard>
          </motion.div>

          {/* Expenses Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PremiumCard
              header={
                <CardHeader>
                  <CardTitle>Répartition des Dépenses</CardTitle>
                  <CardDescription>Par catégorie</CardDescription>
                </CardHeader>
              }
              padding="lg"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${(value / 1000000).toFixed(1)}M`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </PremiumCard>
          </motion.div>
        </motion.div>

        {/* Payments Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <PremiumCard
            header={
              <div className="flex items-center justify-between">
                <CardHeader>
                  <CardTitle>Paiements</CardTitle>
                  <CardDescription>Historique de tous les paiements</CardDescription>
                </CardHeader>
                <div className="flex gap-2">
                  {["all", "pending", "paid", "overdue"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        filterStatus === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all" ? "Tous" : status === "pending" ? "En attente" : status === "paid" ? "Payés" : "En retard"}
                    </button>
                  ))}
                </div>
              </div>
            }
            padding="lg"
          >
            {filteredPayments.length > 0 ? (
              <DataTable columns={paymentColumns} data={filteredPayments} striped hoverable />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun paiement trouvé</p>
              </div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Add Payment Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ajouter un Paiement"
          size="md"
          footer={
            <div className="flex gap-3">
              <PremiumButton variant="ghost" fullWidth onClick={() => setIsModalOpen(false)}>
                Annuler
              </PremiumButton>
              <PremiumButton variant="primary" fullWidth>
                Ajouter
              </PremiumButton>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Locataire</label>
              <select className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500">
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Montant (FCFA)"
              type="number"
              placeholder="0"
            />
            <Input
              label="Date de Paiement"
              type="date"
            />
          </div>
        </Modal>
      </motion.div>
    </DashboardShell>
  );
}
