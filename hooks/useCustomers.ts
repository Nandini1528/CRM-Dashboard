import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/lib/api";

export const customersQueryKey = ["customers"] as const;

export function useCustomers() {
  return useQuery({
    queryKey: customersQueryKey,
    queryFn: getCustomers,
  });
}