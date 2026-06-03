import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePropertyStore } from "@/lib/stores/propertyStore";
import { Property } from "@/lib/stores/types";

export function useProperties() {
  const { properties, setProperties } = usePropertyStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      // Simulate API call
      return properties;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (property: Omit<Property, "id">) => {
      // Simulate API call
      return property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      id,
      property,
    }: {
      id: string;
      property: Partial<Property>;
    }) => {
      // Simulate API call
      return property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  return {
    properties: data || properties,
    isLoading,
    error,
    addProperty: addPropertyMutation.mutate,
    updateProperty: updatePropertyMutation.mutate,
  };
}
