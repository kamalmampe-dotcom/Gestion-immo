import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  occupancyRate: number;
  averageRent: number;
  delinquencyRate: number;
  propertyCount: number;
  tenantCount: number;
  portfolioValue: number;
  roi: number;
  capRate: number;
}

export interface TimeSeriesData {
  date: Date;
  value: number;
}

export interface InsightData {
  type: 'alert' | 'opportunity' | 'insight' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: Date;
}

interface AnalyticsStore {
  metrics: AnalyticsMetrics | null;
  revenueData: TimeSeriesData[];
  expenseData: TimeSeriesData[];
  insights: InsightData[];
  isLoading: boolean;
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';

  setMetrics: (metrics: AnalyticsMetrics) => void;
  setRevenueData: (data: TimeSeriesData[]) => void;
  setExpenseData: (data: TimeSeriesData[]) => void;
  setInsights: (insights: InsightData[]) => void;
  setLoading: (loading: boolean) => void;
  setTimeRange: (range: '7d' | '30d' | '90d' | '1y' | 'all') => void;
  calculateMetrics: (properties: any[], tenants: any[]) => void;
  generateInsights: () => void;
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools((set, get) => ({
    metrics: null,
    revenueData: [],
    expenseData: [],
    insights: [],
    isLoading: false,
    timeRange: '30d',

    setMetrics: (metrics) => set({ metrics }),
    setRevenueData: (data) => set({ revenueData: data }),
    setExpenseData: (data) => set({ expenseData: data }),
    setInsights: (insights) => set({ insights }),
    setLoading: (loading) => set({ isLoading: loading }),
    setTimeRange: (range) => set({ timeRange: range }),

    calculateMetrics: (properties, tenants) => {
      const totalRevenue = properties.reduce((sum, p) => sum + p.revenue, 0);
      const totalExpenses = properties.reduce((sum, p) => sum + p.expenses, 0);
      const netProfit = totalRevenue - totalExpenses;
      const occupancyRate = properties.length > 0
        ? properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length
        : 0;
      const averageRent = properties.length > 0
        ? properties.reduce((sum, p) => sum + p.price, 0) / properties.length
        : 0;
      const delinquencyRate = tenants.length > 0
        ? (tenants.filter((t) => t.status === 'delinquent').length / tenants.length) * 100
        : 0;
      const portfolioValue = properties.reduce((sum, p) => sum + p.price, 0);
      const roi = portfolioValue > 0 ? (netProfit / portfolioValue) * 100 : 0;
      const capRate = portfolioValue > 0 ? (totalRevenue / portfolioValue) * 100 : 0;

      set({
        metrics: {
          totalRevenue,
          totalExpenses,
          netProfit,
          occupancyRate,
          averageRent,
          delinquencyRate,
          propertyCount: properties.length,
          tenantCount: tenants.length,
          portfolioValue,
          roi,
          capRate,
        },
      });
    },

    generateInsights: () => {
      const state = get();
      const insights: InsightData[] = [];

      if (state.metrics) {
        if (state.metrics.occupancyRate < 0.8) {
          insights.push({
            type: 'alert',
            title: 'Low Occupancy Rate',
            description: `Your occupancy rate is ${(state.metrics.occupancyRate * 100).toFixed(1)}%. Consider marketing strategies.`,
            impact: 'high',
            actionable: true,
            timestamp: new Date(),
          });
        }

        if (state.metrics.delinquencyRate > 5) {
          insights.push({
            type: 'warning',
            title: 'Delinquent Payments',
            description: `${state.metrics.delinquencyRate.toFixed(1)}% of tenants have delinquent payments.`,
            impact: 'high',
            actionable: true,
            timestamp: new Date(),
          });
        }

        if (state.metrics.roi > 0.15) {
          insights.push({
            type: 'insight',
            title: 'Strong Returns',
            description: 'Your portfolio is generating excellent returns. Consider expansion opportunities.',
            impact: 'medium',
            actionable: true,
            timestamp: new Date(),
          });
        }
      }

      set({ insights });
    },
  }))
);
