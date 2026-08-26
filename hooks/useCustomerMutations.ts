import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer, deleteCustomer } from "@/lib/api";
import { customersQueryKey } from "@/hooks/useCustomers";
import type { Customer, CustomerInput } from "@/types/customer";

export function useCustomerMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (input: CustomerInput) => createCustomer(input),

    onMutate: async (input: CustomerInput) => {
      await queryClient.cancelQueries({ queryKey: customersQueryKey });
      const previous = queryClient.getQueryData<Customer[]>(customersQueryKey);

      const optimisticCustomer: Customer = {
        ...input,
        id: `temp-${Date.now()}`,
      } as Customer;

      queryClient.setQueryData<Customer[]>(customersQueryKey, (old) =>
        old ? [optimisticCustomer, ...old] : [optimisticCustomer]
      );

      return { previous };
    },

    onError: (_err, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(customersQueryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) =>
      updateCustomer(id, input),

    onMutate: async ({ id, input }: { id: string; input: CustomerInput }) => {
      await queryClient.cancelQueries({ queryKey: customersQueryKey });
      const previous = queryClient.getQueryData<Customer[]>(customersQueryKey);

      queryClient.setQueryData<Customer[]>(customersQueryKey, (old) =>
        old?.map((c) => (c.id === id ? { ...c, ...input } : c))
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(customersQueryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: customersQueryKey });
      const previous = queryClient.getQueryData<Customer[]>(customersQueryKey);

      queryClient.setQueryData<Customer[]>(customersQueryKey, (old) =>
        old?.filter((c) => c.id !== id)
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(customersQueryKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKey });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}