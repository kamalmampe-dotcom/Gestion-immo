// Property Types
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  type: "apartment" | "house" | "commercial" | "land";
  purchasePrice: number;
  currentValue: number;
  area: number; // m²
  rooms: number;
  acquired: string; // date
  description: string;
  status: "available" | "occupied" | "maintenance" | "unavailable";
  imageUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Tenant {
  id: string;
  propertyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rentAmount: number;
  leasedFrom: string;
  leasedTo: string;
  status: "active" | "inactive" | "pending";
  guarantor?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  method?: "cash" | "transfer" | "check" | "mobile";
}

export interface Maintenance {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  cost?: number;
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
}

export interface Analytics {
  totalProperties: number;
  totalRevenue: number;
  occupancyRate: number;
  averageRent: number;
  maintenanceCosts: number;
  vacancyRate: number;
  expiringSoonLeases: number;
  overduePayments: number;
}

export interface AnalyticsMetric {
  date: string;
  revenue: number;
  expenses: number;
  occupancy: number;
}

export interface AnomalyDetection {
  type: "payment_delay" | "maintenance_spike" | "occupancy_drop" | "price_anomaly";
  severity: "low" | "medium" | "high";
  message: string;
  data: Record<string, any>;
  detectedAt: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  currency: string;
  dateFormat: string;
  timezone: string;
  notifications: {
    paymentReminders: boolean;
    maintenanceAlerts: boolean;
    analyticsDaily: boolean;
  };
}
