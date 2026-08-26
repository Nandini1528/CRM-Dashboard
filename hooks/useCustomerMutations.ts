import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer, deleteCustomer } from "@/lib/api";
import { customersQueryKey } from "@/hooks/useCustomers";
import type { CustomerInput } from "@/types/customer";

export function useCustomerMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (input: CustomerInput) => createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) =>
      updateCustomer(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKey });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}