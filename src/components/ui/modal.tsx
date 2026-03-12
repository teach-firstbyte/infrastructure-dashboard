"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ModalProps extends React.ComponentProps<"div"> {
  onClose?: () => void;
  isOpen?: boolean;
}

function Modal({
  className,
  onClose,
  isOpen = true,
  children,
  ...props
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      data-slot="modal-overlay"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={onClose}
    >
      <div
        data-slot="modal"
        className={cn("bg-white rounded-lg shadow-lg p-6 w-96", className)}
        onClick={(e) => e.stopPropagation()} // prevent closing on inner clicks
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("text-lg font-semibold mb-4", className)}
      {...props}
    />
  );
}

interface ModalFormProps {
  newUser: { name: string | null; email: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

function ModalForm({ newUser, onChange, onSubmit, children }: ModalFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-3">
      <input
        type="text"
        name="name"
        value={newUser.name ?? ""}
        onChange={onChange}
        placeholder="Name"
        className="border rounded p-2"
        required
      />
      <input
        type="email"
        name="email"
        value={newUser.email}
        onChange={onChange}
        placeholder="Email"
        className="border rounded p-2"
        required
      />

      <div className="flex justify-end space-x-2 pt-2">{children}</div>
    </form>
  );
}

function ModalButton({
  variant = "primary",
  className,
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "cancel" }) {
  const base = "px-3 py-1 rounded transition font-medium";

  const styles =
    variant === "primary"
      ? "bg-[rgb(76,111,78)] text-white hover:opacity-90"
      : "bg-gray-300 text-gray-800 hover:bg-gray-400";

  return <button className={cn(base, styles, className)} {...props} />;
}

interface ModalDropdownProps {
  label?: string;
  value: string | number | null;
  options: Array<{ value: string | number; label: string }>;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function ModalDropdown({ label, value, options, onChange, required, disabled, className }: ModalDropdownProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <select
        className="border rounded-md p-2 w-full"
        value={value ?? ""}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option value="" disabled>Select an option...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

interface ModalCheckboxesProps {
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  selected: Array<string | number>;
  onToggle: (value: string | number) => void;
  disabled?: boolean;
  className?: string;
}

function ModalCheckboxes({ label, options, selected, onToggle, disabled, className }: ModalCheckboxesProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => onToggle(opt.value)}
            disabled={disabled}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export { Modal, ModalHeader, ModalForm, ModalButton, ModalDropdown, ModalCheckboxes };
