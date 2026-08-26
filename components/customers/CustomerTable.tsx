"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Customer, CustomerSortField, SortDirection } from "@/types/customer";

interface CustomerTableProps {
  customers: Customer[];
  isLoading?: boolean;
  sortField: CustomerSortField;
  sortDirection: SortDirection;
  onSortChange: (field: CustomerSortField) => void;
  onRowClick: (customer: Customer) => void;
}

const COLUMNS: { key: CustomerSortField | "phone" | "company" | "status"; label: string; sortable: boolean }[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: false },
  { key: "company", label: "Company", sortable: false },
  { key: "status", label: "Status", sortable: false },
  { key: "lastContactDate", label: "Last Contact", sortable: true },
];

export function CustomerTable({
  customers,
  isLoading,
  sortField,
  sortDirection,
  onSortChange,
  onRowClick,
}: CustomerTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 font-medium text-muted-foreground">
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange(col.key as CustomerSortField)}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {col.label}
                    <SortIcon active={sortField === col.key} direction={sortDirection} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <SkeletonRows />
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-muted-foreground">
                No customers found.
                <div className="text-xs mt-1">Try changing your search or filters.</div>
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr
                key={customer.id}
                onClick={() => onRowClick(customer)}
                className="border-b last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium">{customer.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.company}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{customer.lastContactDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  if (!active) return <ArrowUpDown size={14} className="opacity-40" />;
  return direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
}

function StatusBadge({ status }: { status: Customer["status"] }) {
  const isActive = status === "Active";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      )}
    >
      {status}
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b last:border-0">
          {COLUMNS.map((col) => (
            <td key={col.key} className="px-4 py-3">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}