"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigation } from "@/lib/navigation-context";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomerMutations } from "@/hooks/useCustomerMutations";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerPagination } from "@/components/customers/CustomerPagination";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { DeleteCustomerDialog } from "@/components/customers/DeleteCustomerDialog";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_FILTERS,
  type Customer,
  type CustomerInput,
  type CustomerFilters as CustomerFiltersType,
  type CustomerSortField,
  type SortDirection,
} from "@/types/customer";

export default function Home() {
  const { activeSection } = useNavigation();

  if (activeSection !== "Customers") {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">{activeSection} — coming soon.</p>
      </div>
    );
  }

  return <CustomersView />;
}

function matchesSearch(customer: Customer, term: string): boolean {
  if (!term) return true;
  const lower = term.toLowerCase();
  return (
    customer.name.toLowerCase().includes(lower) ||
    customer.email.toLowerCase().includes(lower) ||
    customer.company.toLowerCase().includes(lower)
  );
}

function matchesFilters(customer: Customer, filters: CustomerFiltersType): boolean {
  if (filters.status.length > 0 && !filters.status.includes(customer.status)) {
    return false;
  }
  if (filters.companies.length > 0 && !filters.companies.includes(customer.company)) {
    return false;
  }
  if (filters.dateFrom && customer.lastContactDate < filters.dateFrom) {
    return false;
  }
  if (filters.dateTo && customer.lastContactDate > filters.dateTo) {
    return false;
  }
  if (filters.phone && !customer.phone.toLowerCase().includes(filters.phone.toLowerCase())) {
    return false;
  }
  if (filters.email && !customer.email.toLowerCase().includes(filters.email.toLowerCase())) {
    return false;
  }
  return true;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function CustomersView() {
  const { data: customers = [], isLoading } = useCustomers();
  const { createMutation, updateMutation, deleteMutation } = useCustomerMutations();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<CustomerFiltersType>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<CustomerSortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const companyOptions = useMemo(() => {
    return [...new Set(customers.map((c) => c.company))].sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) => matchesSearch(c, searchTerm) && matchesFilters(c, filters)
    );
  }, [customers, searchTerm, filters]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      const result = a[sortField].localeCompare(b[sortField]);
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredCustomers, sortField, sortDirection]);

  // Reset to page 1 whenever the search/filter combination changes.
  // Done during render (not in a useEffect) per React's guidance for
  // "adjusting state when a prop/derived-value changes":
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const filterSignature = JSON.stringify({ searchTerm, filters });
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setPage(1);
  }

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, page, pageSize]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  function handleSortChange(field: CustomerSortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function handleRowClick(customer: Customer) {
    setSelectedCustomerId(customer.id);
  }

  function handleCloseDetails() {
    setSelectedCustomerId(null);
  }

  function handleAddClick() {
    setFormMode("create");
    setEditingCustomer(null);
    setIsFormOpen(true);
  }

  function handleEdit(customer: Customer) {
    setFormMode("edit");
    setEditingCustomer(customer);
    setSelectedCustomerId(null); // close details, open form
    setIsFormOpen(true);
  }

  function handleFormCancel() {
    setIsFormOpen(false);
    setEditingCustomer(null);
  }

  function handleFormSubmit(values: CustomerInput) {
    if (formMode === "create") {
      createMutation.mutate(values, {
        onSuccess: () => {
          setIsFormOpen(false);
          toast.success("Customer added successfully.");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to add customer.");
        },
      });
    } else if (editingCustomer) {
      updateMutation.mutate(
        { id: editingCustomer.id, input: values },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingCustomer(null);
            toast.success("Customer updated successfully.");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update customer.");
          },
        }
      );
    }
  }

  function handleDelete(customer: Customer) {
    setSelectedCustomerId(null); // close details view
    setCustomerToDelete(customer);
  }

  function handleCancelDelete() {
    setCustomerToDelete(null);
  }

  function handleConfirmDelete() {
    if (!customerToDelete) return;

    deleteMutation.mutate(customerToDelete.id, {
      onSuccess: () => {
        toast.success("Customer deleted successfully.");
        setCustomerToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete customer.");
      },
    });
  }

  const activeMutation = formMode === "create" ? createMutation : updateMutation;

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-slate-900">Customers</h1>
        <Button onClick={handleAddClick}>+ Add Customer</Button>
      </div>

      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        companyOptions={companyOptions}
      />

      <CustomerTable
        customers={paginatedCustomers}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
      />

      <CustomerPagination
        page={page}
        pageSize={pageSize}
        totalItems={sortedCustomers.length}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <CustomerDetails
        customer={selectedCustomer}
        open={selectedCustomerId !== null}
        onClose={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomerForm
        key={editingCustomer?.id ?? "create"}
        open={isFormOpen}
        mode={formMode}
        initialValues={editingCustomer ?? undefined}
        isSubmitting={activeMutation.isPending}
        submitError={activeMutation.error?.message ?? null}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

      <DeleteCustomerDialog
        customer={customerToDelete}
        open={customerToDelete !== null}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}