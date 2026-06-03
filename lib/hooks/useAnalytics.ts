import { useQuery } from "@tanstack/react-query";
import { useAnalyticsStore } from "@/lib/stores/analyticsStore";
import { usePropertyStore } from "@/lib/stores/propertyStore";

export function useAnalytics() {
  const { analytics, metrics, anomalies, calculateAnalytics, generateMetrics, detectAnomalies } = useAnalyticsStore();
  const { properties, payments, maintenance, tenants } = usePropertyStore();

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", properties, payments, maintenance, tenants],
    queryFn: async () => {
      calculateAnalytics(properties, payments, maintenance, tenants);
      generateMetrics();
      detectAnomalies();
      return { analytics, metrics, anomalies };
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    analytics: data?.analytics || analytics,
    metrics: data?.metrics || metrics,
    anomalies: data?.anomalies || anomalies,
    isLoading,
  };
}
