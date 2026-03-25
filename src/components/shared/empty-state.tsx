import type React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  className,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col items-center gap-2 p-10 text-center", className)}>
      <div className="grid h-12 w-12 place-items-center rounded-2xl border bg-background shadow-sm">
        {icon}
      </div>
      <div className="mt-2 text-sm font-semibold">{title}</div>
      <div className="max-w-md text-sm text-muted-foreground">{description}</div>
      {actionLabel ? (
        <div className="mt-4">
          <Button variant="outline">{actionLabel}</Button>
        </div>
      ) : null}
    </Card>
  );
}

