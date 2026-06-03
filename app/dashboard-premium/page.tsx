"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Home, Users, DollarSign, AlertCircle, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/premium/DashboardShell";
import { PremiumCard, CardHeader, CardTitle, CardDescription } from "@/components/premium/PremiumCard";
import { StatsCard } from "@/components/premium/StatsCard";
import { DataTable } from "@/components/premium/DataTable";
import { PremiumButton } from "@/components/premium/PremiumButton";
import { usePropertyStore } from "@/lib/stores/propertyStore";
import { useAnalyticsStore } from "@/lib/stores/analyticsStore";

export default function PremiumDashboard() {
  const { properties, tenants, payments, maintenance } = usePropertyStore();
  const { analytics, calculateAnalytics, generateMetrics, detectAnomalies, metrics, anomalies } = useAnalyticsStore();

  useEffect(() => {
    calculateAnalytics(properties, payments, maintenance, tenants);
    generateMetrics();
    detectAnomalies();
  }, [properties, tenants, payments, maintenance]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const revenueData = metrics.slice(-6).map((m) => ({
    date: new Date(m.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
    revenue: m.revenue / 1000,
    expenses: m.expenses / 1000,
  }));

  const occupancyData = [
    { name: "Occupées", value: properties.filter((p) => p.status === "occupied").length },
    { name: "Libres", value: properties.filter((p) => p.status !== "occupied").length },
  ];

  const propertyColumns = [
    { key: "name" as const, label: "Propriété", width: "180px" },
    { key: "city" as const, label: "Ville", width: "120px" },
    { 
      key: "type" as const, 
      label: "Type", 
      width: "100px",
      render: (v: string) => {
        const types: Record<string, string> = {
          apartment: "Appartement",
          house: "Maison",
          commercial: "Commercial",
          land: "Terrain"
        };
        return types[v] || v;
      }
    },
    { 
      key: "currentValue" as const, 
      label: "Valeur", 
      width: "120px",
      render: (v: number) => `${(v / 1000000).toFixed(1)}M FCFA` 
    },
    { 
      key: "status" as const, 
      label: "Statut", 
      width: "110px",
      render: (v: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          v === "occupied"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {v === "occupied" ? "Occupée" : "Libre"}
        </span>
      ),
    },
  ];

  return (
    <DashboardShell>
      <motion.div
        className="space-y-8 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="mt-2 text-gray-600">Vue d&apos;ensemble de votre portefeuille immobilier</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Propriétés"
              value={properties.length}
              description={`${properties.filter((p) => p.status === "occupied").length} occupées`}
              change={8}
              trend="up"
              icon={<Home className="w-6 h-6" />}
              variant="primary"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Locataires Actifs"
              value={tenants.filter((t) => t.status === "active").length}
              description={`${tenants.length} total`}
              change={5}
              trend="up"
              icon={<Users className="w-6 h-6" />}
              variant="success"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Revenu Mensuel"
              value={`${(analytics.totalRevenue / 12 / 1000000).toFixed(1)}M`}
              description="Moyenne par mois"
              change={12}
              trend="up"
              icon={<DollarSign className="w-6 h-6" />}
              variant="success"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Taux d&apos;Occupation"
              value={`${Math.round(analytics.occupancyRate)}%`}
              description={`${analytics.vacancyRate.toFixed(0)}% vacants`}
              change={-3}
              trend="down"
              icon={<TrendingUp className="w-6 h-6" />}
              variant="warning"
            />
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Revenue Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <PremiumCard
              header={
                <CardHeader>
                  <CardTitle>Revenus & Dépenses</CardTitle>
                  <CardDescription>Tendance des 6 derniers mois</CardDescription>
                </CardHeader>
              }
              padding="lg"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenus"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={0.1}
                    name="Dépenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </PremiumCard>
          </motion.div>

          {/* Occupancy Chart */}
          <motion.div variants={itemVariants}>
            <PremiumCard
              header={
                <CardHeader>
                  <CardTitle>Occupation</CardTitle>
                  <CardDescription>État des propriétés</CardDescription>
                </CardHeader>
              }
              padding="lg"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </PremiumCard>
          </motion.div>
        </motion.div>

        {/* Properties Table */}
        <motion.div variants={itemVariants}>
          <PremiumCard
            header={
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Propriétés</CardTitle>
                  <CardDescription>Liste complète de vos propriétés</CardDescription>
                </div>
                <PremiumButton variant="primary" size="sm">
                  Ajouter Propriété
                </PremiumButton>
              </div>
            }
            padding="lg"
          >
            {properties.length > 0 ? (
              <DataTable columns={propertyColumns} data={properties} striped hoverable />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucune propriété enregistrée</p>
                <PremiumButton variant="primary" size="sm" className="mt-4">
                  Créer votre première propriété
                </PremiumButton>
              </div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Alerts & Anomalies */}
        {anomalies.length > 0 && (
          <motion.div variants={itemVariants}>
            <PremiumCard
              header={
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Alertes et Anomalies
                  </CardTitle>
                </CardHeader>
              }
              padding="lg"
            >
              <div className="space-y-3">
                {anomalies.map((anomaly, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      anomaly.severity === "high"
                        ? "bg-red-50 border-red-300"
                        : anomaly.severity === "medium"
                        ? "bg-amber-50 border-amber-300"
                        : "bg-blue-50 border-blue-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{anomaly.message}</p>
                    <p className="text-sm text-gray-600 mt-1">Détecté: {new Date(anomaly.detectedAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                ))}
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </motion.div>
    </DashboardShell>
  );
}
