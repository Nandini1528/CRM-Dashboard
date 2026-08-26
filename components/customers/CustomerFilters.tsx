"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronsUpDown, Check } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSavedFilters, type SavedFilter } from "@/hooks/useSavedFilters";
import { SortableSavedFilterItem } from "@/components/customers/SortableSavedFilterItem";
import {
  CUSTOMER_STATUSES,
  DEFAULT_FILTERS,
  type CustomerFilters as CustomerFiltersType,
} from "@/types/customer";

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: CustomerFiltersType;
  onFiltersChange: (filters: CustomerFiltersType) => void;
  companyOptions: string[];
}

function countActiveFilters(filters: CustomerFiltersType): number {
  let count = 0;
  if (filters.status.length > 0) count++;
  if (filters.companies.length > 0) count++;
  if (filters.dateFrom || filters.dateTo) count++;
  if (filters.phone) count++;
  if (filters.email) count++;
  return count;
}

export function CustomerFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  companyOptions,
}: CustomerFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CustomerFiltersType>(filters);
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false);
  const [saveNameInput, setSaveNameInput] = useState("");

  const { savedFilters, saveFilter, deleteFilter, reorderSavedFilters } =
    useSavedFilters();

  const sensors = useSensors(useSensor(PointerSensor));

  // Which saved filter (if any) matches what's currently selected in the draft.
  // Recalculated on every render, so it updates the instant you click one,
  // and clears itself if you then manually change a field.
  const activeSavedFilterId =
    savedFilters.find((sf) => JSON.stringify(sf.filters) === JSON.stringify(draft))
      ?.id ?? null;

  const activeCount = countActiveFilters(filters);

  function handleOpen() {
    setDraft(filters);
    setOpen(true);
  }

  function toggleStatus(status: CustomerFiltersType["status"][number]) {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  }

  function toggleCompany(company: string) {
    setDraft((prev) => ({
      ...prev,
      companies: prev.companies.includes(company)
        ? prev.companies.filter((c) => c !== company)
        : [...prev.companies, company],
    }));
  }

  function handleApply() {
    onFiltersChange(draft);
    setOpen(false);
  }

  function handleClearAll() {
    setDraft(DEFAULT_FILTERS);
    onFiltersChange(DEFAULT_FILTERS);
    setOpen(false);
  }

  function handleApplySavedFilter(savedFilter: SavedFilter) {
    setDraft(savedFilter.filters);
  }

  function handleSaveCurrentDraft() {
    const name = saveNameInput.trim();
    if (!name) return;
    saveFilter(name, draft);
    setSaveNameInput("");
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = savedFilters.findIndex((sf) => sf.id === active.id);
    const newIndex = savedFilters.findIndex((sf) => sf.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    reorderSavedFilters(arrayMove(savedFilters, oldIndex, newIndex));
  }

  const companyTriggerLabel =
    draft.companies.length === 0
      ? "Select companies..."
      : draft.companies.length === 1
      ? draft.companies[0]
      : `${draft.companies.length} companies selected`;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search name, email, company..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          onClick={handleOpen}
          className="gap-2"
        >
          <SlidersHorizontal size={16} />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </Button>

        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-4 py-4 overflow-y-auto">
            <div>
              <Label className="mb-2 block">Status</Label>
              <div className="flex flex-col gap-2">
                {CUSTOMER_STATUSES.map((status) => (
                  <label key={status} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={draft.status.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Company</Label>
              <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={companyPopoverOpen}
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate">{companyTriggerLabel}</span>
                    <ChevronsUpDown size={14} className="opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search companies..." />
                    <CommandList>
                      <CommandEmpty>No company found.</CommandEmpty>
                      <CommandGroup>
                        {companyOptions.map((company) => {
                          const selected = draft.companies.includes(company);
                          return (
                            <CommandItem
                              key={company}
                              onSelect={() => toggleCompany(company)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {company}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {draft.companies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {draft.companies.map((company) => (
                    <span
                      key={company}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                    >
                      {company}
                      <button
                        type="button"
                        onClick={() => toggleCompany(company)}
                        aria-label={`Remove ${company}`}
                        className="hover:text-destructive"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2 block">Date Range (Last Contact Date)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={draft.dateFrom}
                  onChange={(e) => setDraft((prev) => ({ ...prev, dateFrom: e.target.value }))}
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="date"
                  value={draft.dateTo}
                  onChange={(e) => setDraft((prev) => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filter-phone" className="mb-2 block">Phone</Label>
              <Input
                id="filter-phone"
                placeholder="e.g. 98765"
                value={draft.phone}
                onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="filter-email" className="mb-2 block">Email contains</Label>
              <Input
                id="filter-email"
                placeholder="e.g. @gmail.com"
                value={draft.email}
                onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label className="mb-2 block">Saved Filters</Label>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={savedFilters.map((sf) => sf.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-1.5">
                    {savedFilters.map((sf) => (
                      <SortableSavedFilterItem
                        key={sf.id}
                        savedFilter={sf}
                        isActive={sf.id === activeSavedFilterId}
                        onApply={handleApplySavedFilter}
                        onDelete={deleteFilter}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex items-center gap-2 mt-3">
                <Input
                  placeholder="Name this filter..."
                  value={saveNameInput}
                  onChange={(e) => setSaveNameInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveCurrentDraft}
                  disabled={!saveNameInput.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row gap-2">
            <Button type="button" variant="ghost" onClick={handleClearAll} className="gap-1">
              <X size={14} />
              Clear All
            </Button>
            <Button type="button" onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
