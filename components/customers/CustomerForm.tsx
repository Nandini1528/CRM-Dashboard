"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CustomerAvatar } from "./CustomerAvatar";
import { getAvatarBannerColor } from "@/lib/avatar";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  CUSTOMER_STATUSES,
  type CustomerInput,
} from "@/types/customer";

const EMPTY_VALUES: CustomerInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "Active",
  lastContactDate: "",
  notes: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()+-]{7,}$/;

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
  const form = useForm<CustomerInput>({
    defaultValues: initialValues ?? EMPTY_VALUES,
    mode: "onSubmit",
  });

  const isMobile = useIsMobile();

  function handleOpenChange(next: boolean) {
    if (!next) {
      onCancel();
    }
  }

  const onValid: SubmitHandler<CustomerInput> = (values) => {
    onSubmit(values);
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const nameValue = form.watch("name");
  const emailValue = form.watch("email");

  const displayName =
    nameValue.trim() || (mode === "create" ? "New Customer" : "");

  /* =========================
     Form Fields
     ========================= */

  const fields = (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="name"
        rules={{
          required: "Name is required.",
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-normal text-muted-foreground">
              Name <span className="text-destructive">*</span>
            </FormLabel>

            <FormControl>
              <Input placeholder="Jane Doe" {...field} />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        rules={{
          required: "Email is required.",
          validate: (value) =>
            EMAIL_REGEX.test(value.trim()) ||
            "Enter a valid email address.",
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-normal text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </FormLabel>

            <FormControl>
              <Input
                type="email"
                placeholder="jane@company.com"
                {...field}
              />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        rules={{
          required: "Phone is required.",
          validate: (value) =>
            PHONE_REGEX.test(value.trim()) ||
            "Enter a valid phone number.",
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-normal text-muted-foreground">
              Phone <span className="text-destructive">*</span>
            </FormLabel>

            <FormControl>
              <Input
                placeholder="+91 12345 67890"
                {...field}
              />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company"
        rules={{
          required: "Company is required.",
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-normal text-muted-foreground">
              Company <span className="text-destructive">*</span>
            </FormLabel>

            <FormControl>
              <Input placeholder="Acme Corp" {...field} />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 items-start gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-muted-foreground">
                Status
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {CUSTOMER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastContactDate"
          rules={{
            required: "Last contact date is required.",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal text-muted-foreground">
                Last Contact Date{" "}
                <span className="text-destructive">*</span>
              </FormLabel>

              <FormControl>
                <Input type="date" {...field} />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-normal text-muted-foreground">
              Notes
            </FormLabel>

            <FormControl>
              <Textarea
                placeholder="Meeting notes and follow-up items..."
                rows={3}
                {...field}
              />
            </FormControl>

            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {submitError && (
        <p className="text-sm text-destructive">
          {submitError}
        </p>
      )}

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
            {nameValue.trim() || "New Customer"}
          </p>

          <p className="max-w-70 truncate text-sm leading-tight text-muted-foreground">
            {emailValue.trim() || "No email yet"}
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
      <Form {...form}>
        <Sheet open={open} onOpenChange={handleOpenChange}>
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
              onSubmit={form.handleSubmit(onValid)}
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
      </Form>
    );
  }

  /* =========================
     Desktop: Dialog
     ========================= */

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {mode === "create"
                ? "Add Customer"
                : "Edit Customer"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onValid)}
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
            <DialogFooter className="flex-row items-center justify-end gap-3 border-t bg-muted/20 px-8 py-6">
              <div className="-translate-y-1 flex items-center gap-3">
                {actions}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

