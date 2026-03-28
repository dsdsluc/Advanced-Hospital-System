"use client";

import * as React from "react";
import { CalendarDays, Clock } from "lucide-react";

import type { Appointment } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function statusTone(status: Appointment["status"]) {
  if (status === "Đã xác nhận") return "bg-primary/10 text-primary";
  if (status === "Chờ xác nhận") return "bg-muted text-muted-foreground";
  if (status === "Hoàn tất") return "bg-secondary/10 text-secondary";
  return "bg-destructive/10 text-destructive";
}

export function AppointmentsList({ data }: { data: Appointment[] }) {
  const [scope, setScope] = React.useState<"today" | "all">("today");

  const shown = React.useMemo(() => {
    if (scope === "all") return data;
    return data.filter((a) => a.date === "Hôm nay");
  }, [data, scope]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Lịch hẹn</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            Theo dõi lịch khám theo ngày, bác sĩ và trạng thái.
          </div>
        </div>
        <Tabs
          value={scope}
          onValueChange={(v) => setScope(v === "all" ? "all" : "today")}
        >
          <TabsList>
            <TabsTrigger value="today">Hôm nay</TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {shown.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-10 text-center">
            <div className="text-sm font-semibold">Không có lịch hẹn</div>
            <div className="text-sm text-muted-foreground">
              Lịch hẹn trong phạm vi bạn chọn đang trống.
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {shown.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between",
                  a.date === "Hôm nay" && "border-primary/30 bg-primary/5",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold">
                        {a.patientName}
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusTone(a.status),
                        )}
                      >
                        {a.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {a.doctorName} • {a.department}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {a.date} • {a.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {a.department}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
