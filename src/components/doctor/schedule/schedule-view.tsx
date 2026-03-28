"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ShiftType = "Sáng" | "Chiều" | "Tối" | "Trực" | "Nghỉ";

interface WorkDay {
  date: number;
  dayName: string;
  isToday?: boolean;
  shift: ShiftType;
  room?: string;
  patients?: number;
  time?: string;
}

const WEEKS: WorkDay[][] = [
  [
    { date: 23, dayName: "Thứ Hai", shift: "Sáng", room: "302", patients: 10, time: "07:30 – 12:00" },
    { date: 24, dayName: "Thứ Ba", shift: "Chiều", room: "302", patients: 8, time: "13:00 – 17:30" },
    { date: 25, dayName: "Thứ Tư", shift: "Trực", room: "A&E", patients: 15, time: "17:30 – 07:30" },
    { date: 26, dayName: "Thứ Năm", shift: "Nghỉ" },
    { date: 27, dayName: "Thứ Sáu", shift: "Sáng", room: "302", patients: 9, time: "07:30 – 12:00" },
    { date: 28, dayName: "Thứ Bảy", isToday: true, shift: "Sáng", room: "302", patients: 8, time: "07:30 – 12:00" },
    { date: 29, dayName: "Chủ Nhật", shift: "Nghỉ" },
  ],
  [
    { date: 30, dayName: "Thứ Hai", shift: "Chiều", room: "302", patients: 7, time: "13:00 – 17:30" },
    { date: 31, dayName: "Thứ Ba", shift: "Sáng", room: "302", patients: 10, time: "07:30 – 12:00" },
    { date: 1, dayName: "Thứ Tư", shift: "Nghỉ" },
    { date: 2, dayName: "Thứ Năm", shift: "Trực", room: "A&E", patients: 12, time: "17:30 – 07:30" },
    { date: 3, dayName: "Thứ Sáu", shift: "Nghỉ" },
    { date: 4, dayName: "Thứ Bảy", shift: "Sáng", room: "302", patients: 6, time: "07:30 – 12:00" },
    { date: 5, dayName: "Chủ Nhật", shift: "Nghỉ" },
  ],
];

const SHIFT_COLORS: Record<ShiftType, string> = {
  Sáng: "bg-primary/10 text-primary border-primary/20",
  Chiều: "bg-secondary/10 text-secondary border-secondary/20",
  Tối: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
  Trực: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  Nghỉ: "bg-muted text-muted-foreground border-border",
};

const MONTHLY_SUMMARY = [
  { label: "Ca làm việc", value: "18", sub: "Trong tháng 3" },
  { label: "Ca trực", value: "3", sub: "Đêm / cuối tuần" },
  { label: "Ngày nghỉ", value: "8", sub: "Kế hoạch" },
  { label: "Tổng bệnh nhân", value: "142", sub: "Đã khám tháng này" },
];

export function ScheduleView() {
  return (
    <div className="space-y-6">
      {/* Monthly summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MONTHLY_SUMMARY.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-sm font-medium mt-0.5">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Week 1 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Tuần 23 – 29 tháng 3</CardTitle>
            <Badge variant="outline">Tuần hiện tại</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2">
            {WEEKS[0].map((day) => (
              <div
                key={day.date}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
                  day.isToday && "border-primary/30 bg-primary/5",
                  !day.isToday && "hover:bg-accent/50",
                )}
              >
                {/* Date */}
                <div className={cn(
                  "flex w-12 shrink-0 flex-col items-center rounded-xl p-2",
                  day.isToday && "bg-primary text-primary-foreground",
                )}>
                  <span className="text-xs font-medium">{day.dayName.slice(0, 2)}</span>
                  <span className="text-lg font-semibold">{day.date}</span>
                </div>

                {/* Day name */}
                <div className="w-24 shrink-0">
                  <span className="text-sm font-medium">
                    {day.dayName}
                    {day.isToday && (
                      <span className="ml-1 text-xs text-primary font-normal">(hôm nay)</span>
                    )}
                  </span>
                </div>

                {/* Shift */}
                <div className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                  SHIFT_COLORS[day.shift],
                )}>
                  Ca {day.shift}
                </div>

                {/* Details */}
                {day.shift !== "Nghỉ" ? (
                  <div className="flex flex-1 flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{day.time}</span>
                    {day.room && <span>Phòng {day.room}</span>}
                    {day.patients !== undefined && (
                      <span>{day.patients} bệnh nhân</span>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-muted-foreground">—</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Week 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tuần 30 tháng 3 – 5 tháng 4</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2">
            {WEEKS[1].map((day) => (
              <div
                key={day.date}
                className="flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex w-12 shrink-0 flex-col items-center rounded-xl p-2">
                  <span className="text-xs font-medium">{day.dayName.slice(0, 2)}</span>
                  <span className="text-lg font-semibold">{day.date}</span>
                </div>

                <div className="w-24 shrink-0">
                  <span className="text-sm font-medium">{day.dayName}</span>
                </div>

                <div className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                  SHIFT_COLORS[day.shift],
                )}>
                  Ca {day.shift}
                </div>

                {day.shift !== "Nghỉ" ? (
                  <div className="flex flex-1 flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{day.time}</span>
                    {day.room && <span>Phòng {day.room}</span>}
                    {day.patients !== undefined && (
                      <span>{day.patients} bệnh nhân</span>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-muted-foreground">—</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
