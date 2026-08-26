"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CustomerAvatar } from "./CustomerAvatar";
import { getAvatarBannerColor } from "@/lib/avatar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { CUSTOMER_STATUSES, type CustomerInput } from "@/types/customer";

const EMPTY_VALUES: CustomerInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Active",
  lastContactDate: "",
  notes: "",
};

type FormErrors = Partial<Record<keyof CustomerInput, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()+-]{7,}$/;

function validate(values: CustomerInput): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.company.trim()) {
    errors.company = "Company is required.";
  }

  if (!values.lastContactDate) {
    errors.lastContactDate = "Last contact date is required.";
  }

  return errors;
}

interface CustomerFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: CustomerInput;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit: (values: CustomerInput) => void;
  onCancel: () => void;
}

export function CustomerForm({
  open,
  mode,
  initialValues,
  isSubmitting = false,
  submitError = null,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const [values, setValues] = useState<CustomerInput>(
    initialValues ?? EMPTY_VALUES
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const isMobile = useIsMobile();

  function handleOpenChange(next: boolean) {
    if (!next) onCancel();
  }

  function updateField<K extends keyof CustomerInput>(
    key: K,
    value: CustomerInput[K]
  ) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit(values);
    }
  }

  const displayName =
    values.name.trim() || (mode === "create" ? "New Customer" : "");

  /* =========================
     Form Fields
     ========================= */

  const fields = (
    <div className="flex flex-col gap-4">
      <Field label="Name" error={errors.name} required>
        <Input
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Jane Doe"
        />
      </Field>

      <Field label="Email" error={errors.email} required>
        <Input
          type="email"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="jane@company.com"
        />
      </Field>

      <Field label="Phone" error={errors.phone} required>
        <Input
          value={values.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="+91 12345 67890"
        />
      </Field>

      <Field label="Company" error={errors.company} required>
        <Input
          value={values.company}
          onChange={(e) => updateField("company", e.target.value)}
          placeholder="Acme Corp"
        />
      </Field>

      <div className="grid grid-cols-2 items-start gap-4">
        <Field label="Status">
          <Select
            value={values.status}
            onValueChange={(v: string) =>
              updateField(
                "status",
                v as CustomerInput["status"]
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {CUSTOMER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Last Contact Date"
          error={errors.lastContactDate}
          required
        >
          <Input
            type="date"
            value={values.lastContactDate}
            onChange={(e) =>
              updateField("lastContactDate", e.target.value)
            }
          />
        </Field>
      </div>

      <Field label="Notes">
        <Textarea
          value={values.notes}
          onChange={(e) =>
            updateField("notes", e.target.value)
          }
          placeholder="Meeting notes and follow-up items..."
          rows={3}
        />
      </Field>

      {submitError && (
        <p className="text-sm text-destructive">
          {submitError}
        </p>
      )}

      {/* Extra bottom padding so content clears the footer */}
      <div className="h-2" />
    </div>
  );

  /* =========================
     Customer Header
     ========================= */

  const header = (
    <div className="-mt-12 flex shrink-0 flex-col items-center px-8 text-center">
      <CustomerAvatar
        name={displayName || "?"}
        size="lg"
        className="relative z-10 ring-4 ring-background shadow-sm"
      />

      <div className="mt-3 flex flex-col items-center gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {mode === "create" ? "Add Customer" : "Edit Customer"}
        </p>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-xl font-semibold leading-tight tracking-tight">
            {values.name.trim() || "New Customer"}
          </p>

          <p className="max-w-70 truncate text-sm leading-tight text-muted-foreground">
            {values.email.trim() || "No email yet"}
          </p>
        </div>
      </div>
    </div>
  );

  /* =========================
     Actions
     ========================= */

  const actions = (
    <>
      <Button
        type="button"
        variant="outline"
        className="px-5 py-5"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        className="flex-1 px-5 py-5 md:flex-none"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : mode === "create"
            ? "Add Customer"
            : "Save Changes"}
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
        onOpenChange={handleOpenChange}
      >
        <SheetContent
          side="bottom"
          className="flex h-[92vh] flex-col gap-0 overflow-hidden rounded-t-2xl p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>
              {mode === "create"
                ? "Add Customer"
                : "Edit Customer"}
            </SheetTitle>
          </SheetHeader>

          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            {/* Banner */}
            <div
              className={cn(
                "h-24 shrink-0",
                getAvatarBannerColor(displayName || "?")
              )}
            />

            {/* Avatar + Name + Email */}
            {header}

            {/* Scrollable Form */}
            <div className="min-h-0 flex-1 overflow-y-auto px-8">
              <div className="my-6 border-t" />

              {fields}
            </div>

            {/* Footer */}
            <SheetFooter className="flex-row items-center gap-3 border-t bg-muted/20 px-4 py-4">
              {actions}
            </SheetFooter>
          </form>
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
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {mode === "create"
              ? "Add Customer"
              : "Edit Customer"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* Banner */}
          <div
            className={cn(
              "h-24 shrink-0",
              getAvatarBannerColor(displayName || "?")
            )}
          />

          {/* Avatar + Name + Email */}
          {header}

          {/* Scrollable Form */}
          <div className="min-h-0 flex-1 overflow-y-auto px-8">
            <div className="my-6 border-t" />

            {fields}
          </div>

          {/* Footer */}
          <DialogFooter className="flex-row items-center justify-end gap-3 border-t bg-muted/20 px-8 py-6 -translate-y-1">
            {actions}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* =========================
   Field
   ========================= */

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-normal text-muted-foreground">
        {label}{" "}
        {required && (
          <span className="text-destructive">*</span>
        )}
      </Label>

      {children}

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}