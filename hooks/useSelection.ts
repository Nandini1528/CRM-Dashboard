"use client";

import { useCallback, useMemo, useState } from "react";

export function useSelection<T extends string>(allIds: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<T>>(new Set());

  const toggle = useCallback((id: T) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allSelected = allIds.length > 0 && allIds.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(allIds);
    });
  }, [allIds]);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const isSelected = useCallback(
    (id: T) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  const isIndeterminate =
    !isAllSelected && allIds.some((id) => selectedIds.has(id));

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);

  return {
    selectedIds,
    selectedArray,
    selectedCount: selectedIds.size,
    toggle,
    toggleAll,
    clear,
    isSelected,
    isAllSelected,
    isIndeterminate,
  };
}