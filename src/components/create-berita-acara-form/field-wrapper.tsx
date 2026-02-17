import { type ReactNode } from "react";

import { Label } from "@/components/ui/label";

type FieldWrapperProps = {
  label: string;
  children: ReactNode;
};

export function FieldWrapper({ label, children }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
