"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  if (!values.name.trim()) errors.name = "Name is required.";

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

  if (!values.company.trim()) errors.company = "Company is required.";

  if (!values.lastContactDate) errors.lastContactDate = "Last contact date is required.";

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
  const [values, setValues] = useState<CustomerInput>(initialValues ?? EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  // Re-sync local state whenever the dialog is (re)opened with new initialValues.
  // Using a key on the parent's <CustomerForm> when editing a different customer
  // is the cleanest fix here — see note below.
  function handleOpenChange(next: boolean) {
    if (!next) onCancel();
  }

  function updateField<K extends keyof CustomerInput>(key: K, value: CustomerInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Customer" : "Edit Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div className="grid grid-cols-2 gap-4">
          <Field label="Status">
  <Select
    value={values.status}
    onValueChange={(v: string) => updateField("status", v as CustomerInput["status"])}
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

            <Field label="Last Contact Date" error={errors.lastContactDate} required>
              <Input
                type="date"
                value={values.lastContactDate}
                onChange={(e) => updateField("lastContactDate", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Notes">
            <Textarea
              value={values.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Meeting notes and follow-up items..."
              rows={3}
            />
          </Field>

          {submitError && (
            <p className="text-sm text-destructive">{submitError}</p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Add Customer"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
      <Label className="mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}