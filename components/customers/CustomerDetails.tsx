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
      <DialogContent className="sm:max-w-md">
        {customer && (
          <>
            <DialogHeader>
              <DialogTitle>{customer.name}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-5 py-2">
              <div>
                <StatusBadge status={customer.status} />
              </div>

              <DetailRow label="Email" value={customer.email} />
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

            <DialogFooter className="flex-row gap-2 sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete(customer)}
              >
                Delete
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => onEdit(customer)}
              >
                Edit Customer
              </Button>
            </DialogFooter>
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