import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyId: string;
  moveInDate: Date;
  moveOutDate?: Date;
  rentAmount: number;
  depositAmount: number;
  status: 'active' | 'inactive' | 'pending' | 'terminated';
  paymentHistory: PaymentRecord[];
  documents: Document[];
  notes: string;
  creditScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRecord {
  id: string;
  date: Date;
  amount: number;
  method: 'cash' | 'check' | 'transfer' | 'card';
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
}

export interface Document {
  id: string;
  type: 'lease' | 'id' | 'reference' | 'other';
  url: string;
  uploadedAt: Date;
}

interface TenantStore {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;

  setTenants: (tenants: Tenant[]) => void;
  selectTenant: (tenant: Tenant | null) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  addPayment: (tenantId: string, payment: PaymentRecord) => void;
  getTenantsByProperty: (propertyId: string) => Tenant[];
  getActiveTenants: () => Tenant[];
}

export const useTenantStore = create<TenantStore>()(
  devtools(
    persist(
      (set, get) => ({
        tenants: [],
        selectedTenant: null,
        isLoading: false,
        error: null,

        setTenants: (tenants) => set({ tenants }),
        selectTenant: (tenant) => set({ selectedTenant: tenant }),
        
        addTenant: (tenant) => set((state) => ({
          tenants: [tenant, ...state.tenants],
        })),
        
        updateTenant: (id, updates) => set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
          selectedTenant:
            state.selectedTenant?.id === id
              ? { ...state.selectedTenant, ...updates }
              : state.selectedTenant,
        })),
        
        deleteTenant: (id) => set((state) => ({
          tenants: state.tenants.filter((t) => t.id !== id),
          selectedTenant: state.selectedTenant?.id === id ? null : state.selectedTenant,
        })),
        
        addPayment: (tenantId, payment) => set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId
              ? { ...t, paymentHistory: [payment, ...t.paymentHistory] }
              : t
          ),
        })),
        
        getTenantsByProperty: (propertyId) => {
          return get().tenants.filter((t) => t.propertyId === propertyId);
        },
        
        getActiveTenants: () => {
          return get().tenants.filter((t) => t.status === 'active');
        },
      }),
      {
        name: 'tenant-store',
        version: 1,
      }
    )
  )
);
