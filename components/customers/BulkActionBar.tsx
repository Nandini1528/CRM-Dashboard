"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CUSTOMER_STATUSES } from "@/types/customer";
import type { CustomerStatus } from "@/types/customer";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusChange: (status: CustomerStatus) => void;
  onBulkDelete: () => void;
  isUpdatingStatus?: boolean;
  isDeleting?: boolean;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkStatusChange,
  onBulkDelete,
  isUpdatingStatus = false,
  isDeleting = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClearSelection}
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium text-foreground">
          {selectedCount} selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => onBulkStatusChange(value as CustomerStatus)}
          disabled={isUpdatingStatus}
        >
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Set status" />
          </SelectTrigger>
          <SelectContent>
            {CUSTOMER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8"
          onClick={onBulkDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}