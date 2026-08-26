"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomerAvatar } from "@/components/customers/CustomerAvatar";
import type { Customer } from "@/types/customer";

interface CustomerDetailsProps {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerDetails({
  customer,
  open,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {customer && (
          <>
            {/* Cover banner */}
            <div className="h-20 bg-muted" />

            <div className="px-6">
              {/* Avatar and customer summary overlapping the banner */}
              <div className="-mt-10 mb-5 flex items-end gap-3">
                <CustomerAvatar
                  name={customer.name}
                  size="lg"
                  className="ring-4 ring-background"
                />
                <DialogHeader className="min-w-0 flex-1 text-left p-0 pb-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <DialogTitle className="truncate text-xl">{customer.name}</DialogTitle>
                    <StatusBadge status={customer.status} />
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{customer.email}</p>
                </DialogHeader>
              </div>

              <div className="flex flex-col gap-5 pb-6">
                <DetailRow label="Phone" value={customer.phone} />
                <DetailRow label="Company" value={customer.company} />
                <DetailRow label="Last Contact Date" value={customer.lastContactDate} />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">
                    {customer.notes || (
                      <span className="text-muted-foreground italic">No notes yet.</span>
                    )}
                  </p>
                </div>
              </div>

              <DialogFooter className="flex-row items-center gap-2 sm:justify-between border-t -mx-6 px-6 pt-4 pb-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onDelete(customer)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                >
                  Delete
                </Button>
                <Button type="button" onClick={() => onEdit(customer)}>
                  Edit Customer
                </Button>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
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
