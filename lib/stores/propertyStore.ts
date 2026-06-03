import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Property, Tenant, Payment, Maintenance } from "./types";
import { nanoid } from "nanoid";

interface PropertyStore {
  properties: Property[];
  tenants: Tenant[];
  payments: Payment[];
  maintenance: Maintenance[];
  loading: boolean;
  error: string | null;

  // Properties
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Omit<Property, "id">) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;

  // Tenants
  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Omit<Tenant, "id">) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenantsByProperty: (propertyId: string) => Tenant[];

  // Payments
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Omit<Payment, "id">) => void;
  recordPayment: (id: string, paidDate: string) => void;
  getPaymentsByProperty: (propertyId: string) => Payment[];
  getOverduePayments: () => Payment[];

  // Maintenance
  setMaintenance: (maintenance: Maintenance[]) => void;
  addMaintenance: (maintenance: Omit<Maintenance, "id" | "createdAt">) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  getMaintenanceByProperty: (propertyId: string) => Maintenance[];

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialProperties: Property[] = [
  {
    id: "prop_1",
    name: "Villa Prestige",
    address: "123 Rue de l'Indépendance",
    city: "Yaoundé",
    type: "house",
    purchasePrice: 150000000,
    currentValue: 165000000,
    area: 850,
    rooms: 5,
    acquired: "2022-01-15",
    description: "Luxurious villa in Yaoundé with modern amenities",
    status: "occupied",
    imageUrl: "https://via.placeholder.com/400x300?text=Villa+Prestige",
  },
  {
    id: "prop_2",
    name: "Immeuble Moderne",
    address: "456 Avenue Kennedy",
    city: "Douala",
    type: "apartment",
    purchasePrice: 85000000,
    currentValue: 95000000,
    area: 450,
    rooms: 12,
    acquired: "2021-06-20",
    description: "Modern apartment building with 12 units",
    status: "occupied",
    imageUrl: "https://via.placeholder.com/400x300?text=Immeuble+Moderne",
  },
];

export const usePropertyStore = create<PropertyStore>()(
  devtools(
    persist(
      (set, get) => ({
        properties: initialProperties,
        tenants: [],
        payments: [],
        maintenance: [],
        loading: false,
        error: null,

        // Properties
        setProperties: (properties) => set({ properties }),
        addProperty: (property) =>
          set((state) => ({
            properties: [
              ...state.properties,
              { ...property, id: nanoid() } as Property,
            ],
          })),
        updateProperty: (id, property) =>
          set((state) => ({
            properties: state.properties.map((p) =>
              p.id === id ? { ...p, ...property } : p
            ),
          })),
        deleteProperty: (id) =>
          set((state) => ({
            properties: state.properties.filter((p) => p.id !== id),
          })),
        getProperty: (id) => get().properties.find((p) => p.id === id),

        // Tenants
        setTenants: (tenants) => set({ tenants }),
        addTenant: (tenant) =>
          set((state) => ({
            tenants: [...state.tenants, { ...tenant, id: nanoid() } as Tenant],
          })),
        updateTenant: (id, tenant) =>
          set((state) => ({
            tenants: state.tenants.map((t) =>
              t.id === id ? { ...t, ...tenant } : t
            ),
          })),
        deleteTenant: (id) =>
          set((state) => ({
            tenants: state.tenants.filter((t) => t.id !== id),
          })),
        getTenantsByProperty: (propertyId) =>
          get().tenants.filter((t) => t.propertyId === propertyId),

        // Payments
        setPayments: (payments) => set({ payments }),
        addPayment: (payment) =>
          set((state) => ({
            payments: [...state.payments, { ...payment, id: nanoid() } as Payment],
          })),
        recordPayment: (id, paidDate) =>
          set((state) => ({
            payments: state.payments.map((p) =>
              p.id === id ? { ...p, paidDate, status: "paid" } : p
            ),
          })),
        getPaymentsByProperty: (propertyId) =>
          get().payments.filter((p) => p.propertyId === propertyId),
        getOverduePayments: () =>
          get().payments.filter(
            (p) =>
              p.status === "pending" &&
              new Date(p.dueDate) < new Date()
          ),

        // Maintenance
        setMaintenance: (maintenance) => set({ maintenance }),
        addMaintenance: (maintenance) =>
          set((state) => ({
            maintenance: [
              ...state.maintenance,
              {
                ...maintenance,
                id: nanoid(),
                createdAt: new Date().toISOString(),
              } as Maintenance,
            ],
          })),
        updateMaintenance: (id, maintenance) =>
          set((state) => ({
            maintenance: state.maintenance.map((m) =>
              m.id === id ? { ...m, ...maintenance } : m
            ),
          })),
        getMaintenanceByProperty: (propertyId) =>
          get().maintenance.filter((m) => m.propertyId === propertyId),

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "property-store",
      }
    )
  )
);
