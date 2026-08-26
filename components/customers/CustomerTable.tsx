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

// Same palette family as a typical "account initials" avatar -
// deterministic per-name so a given customer always gets the same color.
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function CustomerAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = getInitials(name);
  const colorClasses = getAvatarColor(name);
  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium shrink-0",
        sizeClasses,
        colorClasses
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function CustomerTable({
  customers,
  isLoading,
  sortField,
  sortDirection,
  onSortChange,
  onRowClick,
}: CustomerTableProps) {
  return (
    <>
      {/* Desktop table - md screens and up */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
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
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={customer.name} />
                      <span className="truncate">{customer.name}</span>
                    </div>
                  </td>
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

      {/* Mobile cards - below md */}
      <div className="md:hidden flex flex-col gap-2">
        {isLoading ? (
          <SkeletonCards />
        ) : customers.length === 0 ? (
          <div className="px-4 py-10 text-center text-muted-foreground border rounded-lg">
            No customers found.
            <div className="text-xs mt-1">Try changing your search or filters.</div>
          </div>
        ) : (
          customers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => onRowClick(customer)}
              className="w-full text-left border rounded-lg p-4 flex items-center justify-between gap-3 active:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CustomerAvatar name={customer.name} size="sm" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{customer.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {customer.company} &middot; {customer.lastContactDate}
                  </p>
                </div>
              </div>
              <StatusBadge status={customer.status} />
            </button>
          ))
        )}
      </div>
    </>
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
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
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

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
          </div>
          <div className="h-5 w-14 bg-muted rounded-full animate-pulse shrink-0" />
        </div>
      ))}
    </>
  );
}