import { CalendarDays } from "lucide-react";

import type { Appointment } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function statusTone(status: Appointment["status"]) {
  if (status === "Đã xác nhận") return "bg-primary/10 text-primary";
  if (status === "Chờ xác nhận") return "bg-muted text-muted-foreground";
  if (status === "Hoàn tất") return "bg-secondary/10 text-secondary";
  return "bg-destructive/10 text-destructive";
}

export function UpcomingAppointments({
  appointments,
}: {
  appointments: Appointment[];
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <span>Lịch hẹn sắp tới</span>
          <Badge variant="outline" className="ml-auto">
            Hôm nay
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid gap-3">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="group flex items-start gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-medium">
                    {a.time} • {a.patientName}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusTone(a.status),
                    )}
                  >
                    {a.status}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {a.doctorName} • {a.department}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{a.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

