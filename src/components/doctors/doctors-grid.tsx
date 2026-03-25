import { Star } from "lucide-react";

import type { Doctor } from "@/lib/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function availabilityTone(a: Doctor["availability"]) {
  if (a === "Sẵn sàng") return "bg-secondary/10 text-secondary";
  if (a === "Bận") return "bg-muted text-muted-foreground";
  return "bg-destructive/10 text-destructive";
}

export function DoctorsGrid({ data }: { data: Doctor[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((d) => {
        const initials = d.name
          .replace("BS.", "")
          .trim()
          .split(" ")
          .slice(-2)
          .map((s) => s[0])
          .join("")
          .toUpperCase();
        return (
          <Card key={d.id} className="transition-shadow hover:shadow-soft">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={d.avatarUrl} alt={d.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{d.name}</CardTitle>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{d.specialization}</Badge>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        availabilityTone(d.availability),
                      )}
                    >
                      {d.availability}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-foreground">{d.rating.toFixed(1)}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                Chuyên khoa {d.specialization}. Trạng thái: {d.availability.toLowerCase()}.
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

