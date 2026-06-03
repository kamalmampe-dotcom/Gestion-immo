'use client';

import React, { useEffect } from 'react';
import { usePropertyStore } from '@/lib/stores/property.store';
import { useAnalyticsStore } from '@/lib/stores/analytics.store';
import { StatCard } from '@/components/premium/stat-card';
import { ChartContainer } from '@/components/premium/chart-container';
import { DataTable, Column } from '@/components/premium/data-table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Building2, Users, TrendingUp, AlertCircle, DollarSign, Home } from 'lucide-react';
import { useProperties } from '@/lib/api/hooks';

const COLORS = ['#5d6dff', '#1897cc', '#22c55e', '#f59e0b'];

export default function PremiumDashboard() {
  const properties = usePropertyStore((s) => s.properties);
  const metrics = useAnalyticsStore((s) => s.metrics);
  const insights = useAnalyticsStore((s) => s.insights);
  const calculateMetrics = useAnalyticsStore((s) => s.calculateMetrics);
  const generateInsights = useAnalyticsStore((s) => s.generateInsights);

  useEffect(() => {
    if (properties.length > 0) {
      calculateMetrics(properties, []);
      generateInsights();
    }
  }, [properties, calculateMetrics, generateInsights]);

  // Mock data
  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 33000 },
    { month: 'Apr', revenue: 61000, expenses: 38000 },
    { month: 'May', revenue: 55000, expenses: 36000 },
    { month: 'Jun', revenue: 67000, expenses: 40000 },
  ];

  const occupancyData = [
    { name: 'Occupied', value: 85 },
    { name: 'Vacant', value: 15 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Property Dashboard</h1>
        <p className="mt-2 text-gray-600">Real-time insights into your portfolio performance</p>
      </div>

      {/* Main content */}
      <div className="space-y-6 p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={metrics?.totalRevenue ? `$${(metrics.totalRevenue / 1000).toFixed(0)}k` : '$0'}
            change={12}
            trend="up"
            color="primary"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatCard
            label="Properties"
            value={metrics?.propertyCount || 0}
            change={5}
            trend="up"
            color="accent"
            icon={<Building2 className="h-6 w-6" />}
          />
          <StatCard
            label="Active Tenants"
            value={metrics?.tenantCount || 0}
            change={3}
            trend="up"
            color="success"
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            label="Occupancy Rate"
            value={metrics?.occupancyRate ? `${(metrics.occupancyRate * 100).toFixed(0)}%` : '0%'}
            change={-2}
            trend="down"
            color="warning"
            icon={<Home className="h-6 w-6" />}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartContainer
            title="Revenue Trend"
            description="Monthly revenue vs expenses"
            trend={15}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5d6dff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5d6dff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#5d6dff"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Portfolio Composition" description="Distribution by property type">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Charts Row 2 */}
        <ChartContainer title="Monthly Performance" description="Detailed breakdown of revenue and expenses">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#5d6dff" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Insights Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Key Insights</h2>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-lg bg-gray-50 p-4 border-l-4"
                  style={{
                    borderLeftColor:
                      insight.type === 'alert' ? '#ef4444' : insight.type === 'warning' ? '#f59e0b' : '#22c55e',
                  }}
                >
                  <AlertCircle
                    className="h-5 w-5 flex-shrink-0 mt-1"
                    style={{
                      color:
                        insight.type === 'alert' ? '#ef4444' : insight.type === 'warning' ? '#f59e0b' : '#22c55e',
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{insight.title}</p>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No insights available yet. Add properties to generate insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
