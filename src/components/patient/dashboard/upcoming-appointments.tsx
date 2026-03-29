import { Calendar, ChevronRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AppointmentStatus = "confirmed" | "pending" | "completed";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: "Đã xác nhận",
  pending: "Chờ xác nhận",
  completed: "Đã hoàn thành",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  confirmed:
    "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  completed:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
};

const APPOINTMENTS = [
  {
    id: 1,
    doctor: "BS. Trần Thị Lan",
    initials: "TL",
    specialty: "Nội tổng quát",
    date: "Thứ 3, 01/04/2026",
    time: "09:30 – 10:00",
    room: "Phòng 302 · Tầng 3",
    status: "confirmed" as AppointmentStatus,
    avatarGradient: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    doctor: "BS. Nguyễn Minh Khoa",
    initials: "MK",
    specialty: "Tim mạch",
    date: "Thứ 6, 05/04/2026",
    time: "14:00 – 14:30",
    room: "Phòng 210 · Tầng 2",
    status: "pending" as AppointmentStatus,
    avatarGradient: "from-teal-400 to-teal-600",
  },
];

export function UpcomingAppointments() {
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
        {APPOINTMENTS.map((appt) => (
          <div
            key={appt.id}
            className="flex items-start gap-3 rounded-2xl border border-blue-50 bg-blue-50/40 p-4 transition-colors hover:bg-blue-50/70 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
          >
            {/* Doctor avatar */}
            <div
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                appt.avatarGradient,
              )}
            >
              {appt.initials}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {appt.doctor}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {appt.specialty}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("shrink-0 text-xs", STATUS_STYLES[appt.status])}
                >
                  {STATUS_LABELS[appt.status]}
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
                  <MapPin className="h-3 w-3" />
                  {appt.room}
                </div>
              </div>
            </div>
          </div>
        ))}

        {APPOINTMENTS.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Không có lịch hẹn nào sắp tới.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
