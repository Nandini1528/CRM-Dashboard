"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  open: boolean;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCustomerDialog({
  customer,
  open,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteCustomerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete customer?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {customer ? <strong>{customer.name}</strong> : "this customer"}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}