"use client";
import { useEffect, useState } from "react";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient-context";

interface Appt {
  id: string;
  date: string;
  rawDate: string;
  time: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatarUrl: string;
  department: string;
  status: string;
}

function statusBadgeStyle(status: string): string {
  switch (status) {
    case "Đã xác nhận":
      return "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300";
    case "Chờ xác nhận":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400";
  }
}

export function UpcomingAppointments() {
  const { patientId } = usePatient();
  const [appointments, setAppointments] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/patient/appointments?patientId=${patientId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setAppointments([]);
          return;
        }
        const now = new Date();
        const upcoming = data
          .filter(
            (a) =>
              (a.status === "Chờ xác nhận" || a.status === "Đã xác nhận") &&
              new Date(a.rawDate) >= now,
          )
          .sort(
            (a: Appt, b: Appt) =>
              new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
          )
          .slice(0, 3);
        setAppointments(upcoming);
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <Card className="border-white/70 bg-white/70 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-base">Lịch hẹn sắp tới</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <Link href="/patient/appointments">
            Xem tất cả
            <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="grid gap-3">
        {loading ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-blue-50 bg-blue-50/40 p-4">
                <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </>
        ) : appointments.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Không có lịch hẹn nào sắp tới.
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="flex items-start gap-3 rounded-2xl border border-blue-50 bg-blue-50/40 p-4 transition-colors hover:bg-blue-50/70 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
            >
              {/* Doctor avatar */}
              <Avatar className="h-11 w-11 shrink-0 rounded-xl">
                <AvatarImage src={appt.doctorAvatarUrl} alt={appt.doctorName} />
                <AvatarFallback
                  className={cn(
                    "rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white shadow-sm",
                  )}
                >
                  {appt.doctorName.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {appt.doctorName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {appt.doctorSpecialization}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0 text-xs", statusBadgeStyle(appt.status))}
                  >
                    {appt.status}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {appt.date}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {appt.time}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {appt.department}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
