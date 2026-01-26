/**
 * Form Field Component
 * Reusable input field with label and error display
 * Single Responsibility: Form field rendering
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormField({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("mt-1", error && "border-destructive")}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
