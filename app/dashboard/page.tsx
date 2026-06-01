"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Building2, Users, DollarSign, AlertCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect("/auth/login");
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Mock data for charts
  const revenueData = [
    { month: "Jan", revenue: 85000 },
    { month: "Fév", revenue: 92000 },
    { month: "Mar", revenue: 78000 },
    { month: "Avr", revenue: 95000 },
    { month: "Mai", revenue: 110000 },
    { month: "Juin", revenue: 118000 },
  ];

  const occupancyData = [
    { name: "Occupée", value: 34 },
    { name: "Libre", value: 8 },
  ];

  const colors = ["#10b981", "#f59e0b"];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Bienvenue à ImmoGestion</h1>
          <p className="text-muted mt-1">Aperçu de vos propriétés et revenus</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Propriétés"
            value="42"
            change={12}
            icon={Building2}
            accentColor="accent"
          />
          <KPICard
            title="Locataires"
            value="34"
            change={8}
            icon={Users}
            accentColor="secondary"
          />
          <KPICard
            title="Revenus (Juin)"
            value="118 K FCFA"
            change={7}
            icon={DollarSign}
            accentColor="success"
          />
          <KPICard
            title="Sinistres"
            value="2"
            change={-50}
            icon={AlertCircle}
            accentColor="warning"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Revenus mensuels" description="Tendance des 6 derniers mois">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenus (FCFA)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Taux d'occupation" description="État des propriétés">
            <ResponsiveContainer width="100%" height="100%">
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
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenus par propriété" description="Top 5 meilleures sources">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { property: "Villa YDE", revenue: 450000 },
                  { property: "Immeuble KIN", revenue: 380000 },
                  { property: "Appt 3BR", revenue: 250000 },
                  { property: "Studio BSM", revenue: 150000 },
                  { property: "Petit studio", revenue: 80000 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="property" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#06b6d4" name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Évolution des paiements" description="Dernier trimestre">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { semaine: "S1", paiements: 28 },
                  { semaine: "S2", paiements: 32 },
                  { semaine: "S3", paiements: 30 },
                  { semaine: "S4", paiements: 35 },
                  { semaine: "S5", paiements: 37 },
                  { semaine: "S6", paiements: 41 },
                  { semaine: "S7", paiements: 39 },
                  { semaine: "S8", paiements: 42 },
                  { semaine: "S9", paiements: 44 },
                  { semaine: "S10", paiements: 46 },
                  { semaine: "S11", paiements: 48 },
                  { semaine: "S12", paiements: 50 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="paiements"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Paiements reçus"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribution des sinistres" description="Par type de dégâts">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Plomberie", value: 35 },
                    { name: "Électricité", value: 25 },
                    { name: "Structure", value: 20 },
                    { name: "Autres", value: 20 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {["#2563eb", "#06b6d4", "#10b981", "#f59e0b"].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
