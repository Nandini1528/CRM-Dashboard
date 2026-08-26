"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkDeleteDialogProps {
  count: number;
  open: boolean;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkDeleteDialog({
  count,
  open,
  isDeleting = false,
  onConfirm,
  onCancel,
}: BulkDeleteDialogProps) {
  const plural = count === 1 ? "customer" : "customers";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
            <Trash2 className="h-6 w-6 text-destructive dark:text-red-400" />
          </div>

          <DialogTitle>Delete {count} {plural}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong className="font-bold text-foreground">
              {count} {plural}
            </strong>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            className="px-5 py-5"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="px-5 py-5"
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