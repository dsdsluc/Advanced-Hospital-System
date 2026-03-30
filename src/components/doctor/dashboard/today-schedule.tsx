"use client";

import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";

type ScheduleStatus = "Đã hoàn tất" | "Đang khám" | "Chờ khám" | "Vắng mặt";

interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientCode: string;
  reason: string;
  room: string;
  status: ScheduleStatus;
}

interface ApiAppointment {
  id: string;
  time: string;
  date: string;
  patientName: string;
  patientCode: string;
  department: string;
  status: ScheduleStatus;
}

function statusStyle(status: ScheduleStatus) {
  if (status === "Đã hoàn tất") return "bg-secondary/10 text-secondary";
  if (status === "Đang khám") return "bg-primary/10 text-primary";
  if (status === "Vắng mặt") return "bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

function statusDot(status: ScheduleStatus) {
  if (status === "Đã hoàn tất") return "bg-secondary";
  if (status === "Đang khám") return "bg-primary animate-pulse";
  if (status === "Vắng mặt") return "bg-destructive";
  return "bg-muted-foreground";
}

function ScheduleSkeleton() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-2xl border p-3">
          <div className="w-12 shrink-0">
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex-1">
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </>
  );
}

export function TodaySchedule() {
  const { doctorId } = useDoctor();
  const [appointments, setAppointments] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) {
      setAppointments([]);
      return;
    }

    setLoading(true);
    fetch(`/api/doctor/appointments?doctorId=${doctorId}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data: ApiAppointment[]) => {
        const today = data.filter((a) => a.date === "Hôm nay");
        setAppointments(
          today.map((a) => ({
            id: a.id,
            time: a.time,
            patientName: a.patientName,
            patientCode: a.patientCode,
            reason: a.department,
            room: "TBD",
            status: a.status,
          })),
        );
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (!doctorId) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Lịch khám hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
            Vui lòng chọn tài khoản bác sĩ
          </div>
        </CardContent>
      </Card>
    );
  }

  const completed = appointments.filter((a) => a.status === "Đã hoàn tất").length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Lịch khám hôm nay
          </CardTitle>
          <Badge variant="outline">
            {completed} / {appointments.length} hoàn tất
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="grid gap-2">
          {loading ? (
            <ScheduleSkeleton />
          ) : appointments.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              Không có cuộc khám hôm nay
            </div>
          ) : (
            appointments.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group flex items-start gap-3 rounded-2xl border p-3 transition-colors hover:bg-accent/50",
                  item.status === "Đang khám" &&
                    "border-primary/30 bg-primary/5",
                )}
              >
                {/* Time */}
                <div className="flex w-12 shrink-0 flex-col items-center gap-1 pt-0.5">
                  <span className="text-sm font-semibold tabular-nums">
                    {item.time}
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      statusDot(item.status),
                    )}
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {item.patientName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.patientCode}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        statusStyle(item.status),
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {item.reason}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Phòng {item.room}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/doctor/appointments">Xem toàn bộ lịch khám</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
