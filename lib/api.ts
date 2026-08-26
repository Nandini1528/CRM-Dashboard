import { Customer, CustomerInput, CustomerStatus } from "@/types/customer";
import { mockCustomers } from "@/data/customers";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCustomers(): Promise<Customer[]> {
  await delay(500);
  return [...mockCustomers];
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  await delay(600);

  if (!input.name.trim() || !input.email.trim()) {
    throw new Error("Name and email are required.");
  }

  const newCustomer: Customer = {
    ...input,
    id: `cust_${Date.now()}`,
  };
  mockCustomers.unshift(newCustomer);
  return newCustomer;
}

export async function updateCustomer(
  id: string,
  input: CustomerInput
): Promise<Customer> {
  await delay(600);

  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Customer with id "${id}" not found.`);
  }

  const updated: Customer = { ...input, id };
  mockCustomers[index] = updated;
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await delay(500);

  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Customer with id "${id}" not found.`);
  }
  mockCustomers.splice(index, 1);
}

// --- Bulk actions ---

export async function bulkUpdateCustomerStatus(
  ids: string[],
  status: CustomerStatus
): Promise<void> {
  await delay(600);

  const idSet = new Set(ids);
  mockCustomers.forEach((customer, index) => {
    if (idSet.has(customer.id)) {
      mockCustomers[index] = { ...customer, status };
    }
  });
}

export async function bulkDeleteCustomers(ids: string[]): Promise<void> {
  await delay(500);

  const idSet = new Set(ids);
  for (let i = mockCustomers.length - 1; i >= 0; i--) {
    if (idSet.has(mockCustomers[i].id)) {
      mockCustomers.splice(i, 1);
    }
  }
}