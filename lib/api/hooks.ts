import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { Property } from '@/lib/stores/property.store';
import { Tenant } from '@/lib/stores/tenant.store';

// Properties
export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => apiClient.get<Property[]>('/properties'),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => apiClient.get<Property>(`/properties/${id}`),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<Property>('/properties', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Property>) =>
      apiClient.patch<Property>(`/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Tenants
export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => apiClient.get<Tenant[]>('/tenants'),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ['tenants', id],
    queryFn: () => apiClient.get<Tenant>(`/tenants/${id}`),
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<Tenant>('/tenants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Tenant>) =>
      apiClient.patch<Tenant>(`/tenants/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/tenants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

// Analytics
export function useAnalytics(propertyId?: string) {
  return useQuery({
    queryKey: ['analytics', propertyId],
    queryFn: () =>
      apiClient.get<any>(`/analytics${propertyId ? `?propertyId=${propertyId}` : ''}`),
    staleTime: 1000 * 60 * 10,
  });
}
