import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Analytics, AnalyticsMetric, AnomalyDetection } from "./types";

interface AnalyticsStore {
  analytics: Analytics;
  metrics: AnalyticsMetric[];
  anomalies: AnomalyDetection[];
  
  // Calculations
  calculateAnalytics: (properties: any[], payments: any[], maintenance: any[], tenants: any[]) => void;
  generateMetrics: () => void;
  detectAnomalies: () => void;
  
  // Getters
  getPortfolioValue: () => number;
  getMonthlyRevenue: () => number;
  getOccupancyTrend: () => number;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools((set, get) => ({
    analytics: {
      totalProperties: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      averageRent: 0,
      maintenanceCosts: 0,
      vacancyRate: 0,
      expiringSoonLeases: 0,
      overduePayments: 0,
    },
    metrics: [],
    anomalies: [],

    calculateAnalytics: (properties, payments, maintenance, tenants) => {
      const totalRevenue = payments
        .filter((p: any) => p.status === "paid")
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const maintenanceCosts = maintenance
        .filter((m: any) => m.status === "completed")
        .reduce((sum: number, m: any) => sum + (m.cost || 0), 0);

      const occupancyRate =
        properties.length > 0
          ? (properties.filter((p: any) => p.status === "occupied").length /
              properties.length) *
            100
          : 0;

      const averageRent =
        tenants.length > 0
          ? tenants.reduce((sum: number, t: any) => sum + t.rentAmount, 0) /
            tenants.length
          : 0;

      const expiringSoonLeases = tenants.filter((t: any) => {
        const daysUntilExpiry = Math.floor(
          (new Date(t.leasedTo).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
      }).length;

      const overduePayments = payments.filter(
        (p: any) =>
          p.status === "pending" &&
          new Date(p.dueDate) < new Date()
      ).length;

      set({
        analytics: {
          totalProperties: properties.length,
          totalRevenue,
          occupancyRate,
          averageRent,
          maintenanceCosts,
          vacancyRate: 100 - occupancyRate,
          expiringSoonLeases,
          overduePayments,
        },
      });
    },

    generateMetrics: () => {
      const metrics: AnalyticsMetric[] = [];
      const now = new Date();

      for (let i = 12; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);

        metrics.push({
          date: date.toISOString().split("T")[0],
          revenue: Math.floor(Math.random() * 500000) + 200000,
          expenses: Math.floor(Math.random() * 100000) + 50000,
          occupancy: Math.floor(Math.random() * 30) + 70,
        });
      }

      set({ metrics });
    },

    detectAnomalies: () => {
      const anomalies: AnomalyDetection[] = [];
      const { analytics, metrics } = get();

      // Check for high overdue payments
      if (analytics.overduePayments > 2) {
        anomalies.push({
          type: "payment_delay",
          severity: "high",
          message: `${analytics.overduePayments} paiements en retard détectés`,
          data: { count: analytics.overduePayments },
          detectedAt: new Date().toISOString(),
        });
      }

      // Check for occupancy drop
      if (metrics.length >= 2) {
        const lastMonth = metrics[metrics.length - 1].occupancy;
        const previousMonth = metrics[metrics.length - 2].occupancy;

        if (previousMonth - lastMonth > 20) {
          anomalies.push({
            type: "occupancy_drop",
            severity: "medium",
            message: `Baisse de taux d'occupation de ${previousMonth - lastMonth}%`,
            data: { drop: previousMonth - lastMonth },
            detectedAt: new Date().toISOString(),
          });
        }
      }

      // Check for high maintenance costs
      if (analytics.maintenanceCosts > analytics.totalRevenue * 0.3) {
        anomalies.push({
          type: "maintenance_spike",
          severity: "high",
          message: "Coûts de maintenance anormalement élevés",
          data: { ratio: analytics.maintenanceCosts / analytics.totalRevenue },
          detectedAt: new Date().toISOString(),
        });
      }

      set({ anomalies });
    },

    getPortfolioValue: () => 0, // Will be calculated from properties
    getMonthlyRevenue: () => get().analytics.totalRevenue / 12,
    getOccupancyTrend: () =>
      get().metrics.length > 0
        ? get().metrics[get().metrics.length - 1].occupancy
        : 0,
  }))
);
