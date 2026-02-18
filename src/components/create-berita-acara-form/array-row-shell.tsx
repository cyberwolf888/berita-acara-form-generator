import { type ReactNode } from "react";
import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ArrayRowShellProps = {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  children: ReactNode;
};

export function ArrayRowShell({
  index,
  canRemove,
  onRemove,
  children,
}: ArrayRowShellProps) {
  return (
    <div className="relative space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
        {canRemove ? (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        ) : null}
      </div>
      {children}
    </div>
  );
}
