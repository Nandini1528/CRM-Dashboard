"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CustomerAvatar } from "@/components/customers/CustomerAvatar";
import { getAvatarBannerColor } from "@/lib/avatar";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();

  if (!customer) return null;

  const formattedLastContact = customer.lastContactDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(customer.lastContactDate))
    : "No contact yet";

  const body = (
    <>
      {/* Banner + Customer Identity */}
      <div className="shrink-0">
        <div
          className={cn(
            "h-24",
            getAvatarBannerColor(customer.name)
          )}
        />

        <div className="-mt-12 flex flex-col items-center px-8 text-center">
          <CustomerAvatar
            name={customer.name}
            size="lg"
            className="relative z-10 ring-4 ring-background shadow-sm"
          />

          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="flex flex-col items-center gap-0.5">
              <p className="text-xl font-semibold leading-tight tracking-tight">
                {customer.name}
              </p>

              <p className="max-w-70 truncate text-sm leading-tight text-muted-foreground">
                {customer.email}
              </p>
            </div>

            <div className="pt-1">
              <StatusBadge status={customer.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Customer Details */}
      <div className="flex-1 overflow-y-auto px-8">
        <div className="my-6 border-t" />

        <section className="divide-y">
          <DetailRow
            label="Phone"
            value={customer.phone || "Not provided"}
          />

          <DetailRow
            label="Company"
            value={customer.company || "Not provided"}
          />

          <DetailRow
            label="Last contact"
            value={formattedLastContact}
          />
        </section>

        {/* Notes */}
        <section className="mt-6 rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Notes
          </p>

          <p className="mt-2 text-sm leading-6 text-foreground">
            {customer.notes || "No notes added for this customer."}
          </p>
        </section>

        {/* Extra bottom padding so content clears the sticky footer */}
        <div className="h-4" />
      </div>
    </>
  );

  const actions = (
    <>
      <Button
        type="button"
        variant="ghost"
        className="bg-destructive/10 px-5 py-5 text-destructive hover:bg-destructive/20 hover:text-destructive dark:bg-destructive/20 dark:text-red-400 dark:hover:bg-destructive/30 dark:hover:text-red-300"
        onClick={() => onDelete(customer)}
      >
        Delete
      </Button>

      <Button
        type="button"
        className="flex-1 px-5 py-5 md:flex-none"
        onClick={() => onEdit(customer)}
      >
        Edit Customer
      </Button>
    </>
  );

  /* =========================
     Mobile: Bottom Sheet
     ========================= */
  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(next) => !next && onClose()}
      >
        <SheetContent
          side="bottom"
          className="flex h-[92vh] flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{customer.name}</SheetTitle>
          </SheetHeader>

          {body}

          <SheetFooter className="flex-row items-center gap-3 border-t bg-muted/20 px-4 py-4">
            {actions}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  /* =========================
     Desktop: Dialog
     ========================= */
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && onClose()}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>{customer.name}</DialogTitle>
        </DialogHeader>

        {body}

        <DialogFooter className="flex-row items-center justify-end gap-3 border-t bg-muted/20 px-8 py-6">
  <div className="-translate-y-1 flex items-center gap-3">
    {actions}
  </div>
</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   Detail Row
   ========================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <p className="shrink-0 text-sm text-muted-foreground">
        {label}
      </p>

      <p className="truncate text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: Customer["status"];
}) {
  const normalizedStatus = String(status).toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",

        normalizedStatus === "active" &&
          "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/30",

        normalizedStatus === "inactive" &&
          "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-400/15 dark:text-slate-300 dark:ring-slate-400/30",

        normalizedStatus === "lead" &&
          "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/15 dark:text-blue-400 dark:ring-blue-500/30",

        !["active", "inactive", "lead"].includes(normalizedStatus) &&
          "bg-muted text-muted-foreground ring-border"
      )}
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",

          normalizedStatus === "active" &&
            "bg-emerald-500",

          normalizedStatus === "inactive" &&
            "bg-slate-400",

          normalizedStatus === "lead" &&
            "bg-blue-500",

          !["active", "inactive", "lead"].includes(normalizedStatus) &&
            "bg-muted-foreground"
        )}
      />

      {String(status)}
    </span>
  );
}