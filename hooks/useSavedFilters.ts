"use client";

import { useEffect, useState } from "react";
import { DEFAULT_FILTERS, type CustomerFilters } from "@/types/customer";

export interface SavedFilter {
  id: string;
  name: string;
  filters: CustomerFilters;
  isTemplate?: boolean; // pre-built, cannot be deleted by the user
}

const STORAGE_KEY = "crm:savedFilters";
const ORDER_STORAGE_KEY = "crm:savedFilterOrder";

const BUILT_IN_TEMPLATES: SavedFilter[] = [
  {
    id: "template-active",
    name: "Active Customers",
    isTemplate: true,
    filters: { ...DEFAULT_FILTERS, status: ["Active"] },
  },
  {
    id: "template-recent",
    name: "Recent Contacts",
    isTemplate: true,
    filters: {
      ...DEFAULT_FILTERS,
      dateFrom: getDateDaysAgo(30),
      dateTo: getTodayISO(),
    },
  },
  {
    id: "template-inactive",
    name: "Inactive Leads",
    isTemplate: true,
    filters: { ...DEFAULT_FILTERS, status: ["Inactive"] },
  },
];

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function loadUserFilters(): SavedFilter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedFilter[]) : [];
  } catch {
    return [];
  }
}

function persistUserFilters(filters: SavedFilter[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // localStorage unavailable (private browsing, quota, etc) — fail silently
  }
}

function loadFilterOrder(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function persistFilterOrder(order: string[]) {
  try {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // localStorage unavailable (private browsing, quota, etc) — fail silently
  }
}

export function useSavedFilters() {
  const [userFilters, setUserFilters] = useState<SavedFilter[]>([]);
  const [filterOrder, setFilterOrder] = useState<string[]>([]);

  // Load from localStorage once, after mount. This intentionally runs in an
  // effect (not a lazy useState initializer) to avoid a hydration mismatch:
  // the server has no access to localStorage, so both server and first
  // client render must return [] before this effect updates it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserFilters(loadUserFilters());
    setFilterOrder(loadFilterOrder());
  }, []);

  function saveFilter(name: string, filters: CustomerFilters) {
    const newFilter: SavedFilter = {
      id: `saved_${Date.now()}`,
      name,
      filters,
    };
    const next = [...userFilters, newFilter];
    setUserFilters(next);
    persistUserFilters(next);
  }

  function deleteFilter(id: string) {
    const next = userFilters.filter((f) => f.id !== id);
    setUserFilters(next);
    persistUserFilters(next);
    const nextOrder = filterOrder.filter((filterId) => filterId !== id);
    setFilterOrder(nextOrder);
    persistFilterOrder(nextOrder);
  }

  function reorderSavedFilters(newOrder: SavedFilter[]) {
    const nextOrder = newOrder.map((filter) => filter.id);
    setFilterOrder(nextOrder);
    persistFilterOrder(nextOrder);
  }

  const savedFilters = [...BUILT_IN_TEMPLATES, ...userFilters].sort((a, b) => {
    const aIndex = filterOrder.indexOf(a.id);
    const bIndex = filterOrder.indexOf(b.id);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return {
    savedFilters,
    saveFilter,
    deleteFilter,
    reorderSavedFilters,
  };
}
