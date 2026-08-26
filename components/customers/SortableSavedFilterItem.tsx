"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedFilter } from "@/hooks/useSavedFilters";

interface SortableSavedFilterItemProps {
  savedFilter: SavedFilter;
  isActive: boolean;
  onApply: (savedFilter: SavedFilter) => void;
  onDelete: (id: string) => void;
}

export function SortableSavedFilterItem({
  savedFilter,
  isActive,
  onApply,
  onDelete,
}: SortableSavedFilterItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: savedFilter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1">
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${savedFilter.name}`}
        className="p-1.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={14} />
      </button>

      <button
        type="button"
        onClick={() => onApply(savedFilter)}
        className={cn(
          "flex-1 text-left text-sm rounded-md border px-3 py-2 transition-colors",
          isActive
            ? "bg-primary/10 border-primary text-primary font-medium"
            : "hover:bg-muted/50"
        )}
      >
        {savedFilter.name}
      </button>

      {!savedFilter.isTemplate && (
        <button
          type="button"
          onClick={() => onDelete(savedFilter.id)}
          aria-label={`Delete ${savedFilter.name}`}
          className="p-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}