"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { useNavigation } from "@/lib/navigation-context";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomerMutations } from "@/hooks/useCustomerMutations";
import { useDebounce } from "@/hooks/useDebounce";
import { useSelection } from "@/hooks/useSelection";
import { generateCsv, downloadCsv } from "@/lib/csv-export";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { CustomerSearchInput } from "@/components/customers/CustomerSearchInput";
import { CustomerPagination } from "@/components/customers/CustomerPagination";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { DeleteCustomerDialog } from "@/components/customers/DeleteCustomerDialog";
import { BulkActionBar } from "@/components/customers/BulkActionBar";
import { BulkDeleteDialog } from "@/components/customers/BulkDeleteDialog";
import { DashboardOverview } from "@/components/customers/DashboardOverview";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_FILTERS,
  type Customer,
  type CustomerInput,
  type CustomerStatus,
  type CustomerFilters as CustomerFiltersType,
  type CustomerSortField,
  type SortDirection,
} from "@/types/customer";

export default function Home() {
  const { activeSection } = useNavigation();

  if (activeSection === "Dashboard") {
    return <DashboardOverview />;
  }

  if (activeSection !== "Customers") {
    return (
      <div className="p-8">
        <p className="text-sm text-muted-foreground">
          {activeSection} — coming soon.
        </p>
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

function matchesFilters(
  customer: Customer,
  filters: CustomerFiltersType
): boolean {
  if (
    filters.status.length > 0 &&
    !filters.status.includes(customer.status)
  ) {
    return false;
  }

  if (
    filters.companies.length > 0 &&
    !filters.companies.includes(customer.company)
  ) {
    return false;
  }

  if (filters.dateFrom && customer.lastContactDate < filters.dateFrom) {
    return false;
  }

  if (filters.dateTo && customer.lastContactDate > filters.dateTo) {
    return false;
  }

  if (
    filters.phone &&
    !customer.phone.toLowerCase().includes(filters.phone.toLowerCase())
  ) {
    return false;
  }

  if (
    filters.email &&
    !customer.email.toLowerCase().includes(filters.email.toLowerCase())
  ) {
    return false;
  }

  return true;
}

// CSV column definitions for customer export
const CUSTOMER_CSV_COLUMNS: {
  key: keyof Customer;
  label: string;
}[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "status", label: "Status" },
  { key: "lastContactDate", label: "Last Contact Date" },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function CustomersView() {
  const { data: customers = [], isLoading } = useCustomers();

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    bulkUpdateStatusMutation,
    bulkDeleteMutation,
  } = useCustomerMutations();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [filters, setFilters] =
    useState<CustomerFiltersType>(DEFAULT_FILTERS);

  const [sortField, setSortField] =
    useState<CustomerSortField>("name");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] =
    useState<number>(PAGE_SIZE_OPTIONS[0]);

  const [selectedCustomerId, setSelectedCustomerId] =
    useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formMode, setFormMode] =
    useState<"create" | "edit">("create");

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const companyOptions = useMemo(() => {
    return [...new Set(customers.map((c) => c.company))].sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        matchesSearch(c, debouncedSearchTerm) &&
        matchesFilters(c, filters)
    );
  }, [customers, debouncedSearchTerm, filters]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      const result = a[sortField].localeCompare(b[sortField]);

      return sortDirection === "asc"
        ? result
        : -result;
    });
  }, [filteredCustomers, sortField, sortDirection]);

  const filterSignature = JSON.stringify({
    searchTerm: debouncedSearchTerm,
    filters,
  });

  const [prevFilterSignature, setPrevFilterSignature] =
    useState(filterSignature);

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;

    return sortedCustomers.slice(
      start,
      start + pageSize
    );
  }, [sortedCustomers, page, pageSize]);

  // Selection is scoped to the customers visible on the current page, so
  // "select all" always matches what the person can actually see.
  const pageCustomerIds = useMemo(
    () => paginatedCustomers.map((c) => c.id),
    [paginatedCustomers]
  );

  const {
    selectedIds,
    selectedArray,
    selectedCount,
    toggle: toggleSelect,
    toggleAll: toggleSelectAll,
    clear: clearSelection,
    isAllSelected,
    isIndeterminate,
  } = useSelection(pageCustomerIds);

  if (filterSignature !== prevFilterSignature) {
    setPrevFilterSignature(filterSignature);
    setPage(1);
    clearSelection();
  }

  const selectedCustomer = useMemo(
    () =>
      customers.find(
        (c) => c.id === selectedCustomerId
      ) ?? null,
    [customers, selectedCustomerId]
  );

  function handleSortChange(field: CustomerSortField) {
    if (field === sortField) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    clearSelection();
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
    clearSelection();
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
    setSelectedCustomerId(null);
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
          toast.error(
            error.message || "Failed to add customer."
          );
        },
      });
    } else if (editingCustomer) {
      updateMutation.mutate(
        {
          id: editingCustomer.id,
          input: values,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingCustomer(null);
            toast.success(
              "Customer updated successfully."
            );
          },
          onError: (error) => {
            toast.error(
              error.message ||
                "Failed to update customer."
            );
          },
        }
      );
    }
  }

  function handleDelete(customer: Customer) {
    setSelectedCustomerId(null);
    setCustomerToDelete(customer);
  }

  function handleCancelDelete() {
    setCustomerToDelete(null);
  }

  function handleConfirmDelete() {
    if (!customerToDelete) return;

    deleteMutation.mutate(customerToDelete.id, {
      onSuccess: () => {
        toast.success(
          "Customer deleted successfully."
        );
        setCustomerToDelete(null);
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to delete customer."
        );
      },
    });
  }

  function handleBulkStatusChange(status: CustomerStatus) {
    if (selectedArray.length === 0) return;

    bulkUpdateStatusMutation.mutate(
      { ids: selectedArray, status },
      {
        onSuccess: () => {
          toast.success(
            `Updated ${selectedArray.length} customer${
              selectedArray.length === 1 ? "" : "s"
            } to ${status}.`
          );
          clearSelection();
        },
        onError: (error) => {
          toast.error(
            error.message || "Failed to update customers."
          );
        },
      }
    );
  }

  function handleBulkDeleteClick() {
    if (selectedArray.length === 0) return;
    setIsBulkDeleteOpen(true);
  }

  function handleCancelBulkDelete() {
    setIsBulkDeleteOpen(false);
  }

  function handleConfirmBulkDelete() {
    if (selectedArray.length === 0) return;

    bulkDeleteMutation.mutate(selectedArray, {
      onSuccess: () => {
        toast.success(
          `Deleted ${selectedArray.length} customer${
            selectedArray.length === 1 ? "" : "s"
          }.`
        );
        clearSelection();
        setIsBulkDeleteOpen(false);
      },
      onError: (error) => {
        toast.error(
          error.message || "Failed to delete customers."
        );
      },
    });
  }

  function handleExportCsv() {
    if (sortedCustomers.length === 0) {
      toast.error("No customers to export.");
      return;
    }

    const csvContent = generateCsv(
      sortedCustomers,
      CUSTOMER_CSV_COLUMNS
    );

    const timestamp = new Date()
      .toISOString()
      .slice(0, 10);

    downloadCsv(
      `customers-${timestamp}.csv`,
      csvContent
    );

    toast.success(
      `Exported ${sortedCustomers.length} customer${
        sortedCustomers.length === 1 ? "" : "s"
      } to CSV.`
    );
  }

  const activeMutation =
    formMode === "create"
      ? createMutation
      : updateMutation;

  return (
    <div className="flex flex-col gap-4 bg-background p-4 text-foreground sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <h1 className="shrink-0 text-lg font-medium text-foreground sm:text-xl">
            Customers
          </h1>

          <CustomerSearchInput
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="w-full sm:w-80"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <CustomerFilters
            filters={filters}
            onFiltersChange={setFilters}
            companyOptions={companyOptions}
            className="flex-1 px-3 py-2 sm:flex-none sm:px-5 sm:py-5"
          />

          <Button
            variant="outline"
            className="flex-1 px-3 py-2 sm:flex-none sm:px-5 sm:py-5"
            onClick={handleExportCsv}
            disabled={sortedCustomers.length === 0}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>

          <Button
            className="flex-1 bg-[#3B5BDB] px-3 py-2 sm:flex-none sm:px-5 sm:py-5"
            onClick={handleAddClick}
          >
            + Add Customer
          </Button>
        </div>
      </div>

      {selectedCount > 0 && (
        <BulkActionBar
          selectedCount={selectedCount}
          onClearSelection={clearSelection}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkDelete={handleBulkDeleteClick}
          isUpdatingStatus={bulkUpdateStatusMutation.isPending}
          isDeleting={bulkDeleteMutation.isPending}
        />
      )}

      <CustomerTable
        customers={paginatedCustomers}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRowClick={handleRowClick}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        isAllSelected={isAllSelected}
        isIndeterminate={isIndeterminate}
      />

      <CustomerPagination
        page={page}
        pageSize={pageSize}
        totalItems={sortedCustomers.length}
        onPageChange={handlePageChange}
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
        initialValues={
          editingCustomer ?? undefined
        }
        isSubmitting={activeMutation.isPending}
        submitError={
          activeMutation.error?.message ?? null
        }
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

      <BulkDeleteDialog
        count={selectedArray.length}
        open={isBulkDeleteOpen}
        isDeleting={bulkDeleteMutation.isPending}
        onConfirm={handleConfirmBulkDelete}
        onCancel={handleCancelBulkDelete}
      />
    </div>
  );
}