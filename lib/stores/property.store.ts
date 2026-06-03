import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial' | 'industrial';
  price: number;
  occupancy: number;
  tenants: number;
  revenue: number;
  expenses: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastInspection: Date;
  nextMaintenance?: Date;
  location: { lat: number; lng: number };
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PropertyFilter {
  type?: string;
  condition?: string;
  occupancyMin?: number;
  occupancyMax?: number;
  priceMin?: number;
  priceMax?: number;
}

interface PropertyStore {
  properties: Property[];
  selectedProperty: Property | null;
  filters: PropertyFilter;
  isLoading: boolean;
  error: string | null;

  setProperties: (properties: Property[]) => void;
  selectProperty: (property: Property | null) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  setFilters: (filters: PropertyFilter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getFilteredProperties: () => Property[];
}

export const usePropertyStore = create<PropertyStore>()(
  devtools(
    persist(
      (set, get) => ({
        properties: [],
        selectedProperty: null,
        filters: {},
        isLoading: false,
        error: null,

        setProperties: (properties) => set({ properties }),
        selectProperty: (property) => set({ selectedProperty: property }),
        
        addProperty: (property) => set((state) => ({
          properties: [property, ...state.properties],
        })),
        
        updateProperty: (id, updates) => set((state) => ({
          properties: state.properties.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          selectedProperty:
            state.selectedProperty?.id === id
              ? { ...state.selectedProperty, ...updates }
              : state.selectedProperty,
        })),
        
        deleteProperty: (id) => set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
          selectedProperty:
            state.selectedProperty?.id === id ? null : state.selectedProperty,
        })),
        
        setFilters: (filters) => set({ filters }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        
        getFilteredProperties: () => {
          const { properties, filters } = get();
          return properties.filter((p) => {
            if (filters.type && p.type !== filters.type) return false;
            if (filters.condition && p.condition !== filters.condition) return false;
            if (filters.occupancyMin !== undefined && p.occupancy < filters.occupancyMin) return false;
            if (filters.occupancyMax !== undefined && p.occupancy > filters.occupancyMax) return false;
            if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
            if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
            return true;
          });
        },
      }),
      {
        name: 'property-store',
        version: 1,
      }
    )
  )
);
