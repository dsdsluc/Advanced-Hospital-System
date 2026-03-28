"use client";

import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Search, SlidersHorizontal } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AppStatus = "Đã hoàn tất" | "Đang khám" | "Chờ khám" | "Vắng mặt" | "Đã hủy";

interface Appointment {
  id: string;
  time: string;
  date: string;
  patientName: string;
  patientCode: string;
  patientAge: number;
  patientGender: "Nam" | "Nữ";
  reason: string;
  room: string;
  type: "Khám lần đầu" | "Tái khám" | "Khám định kỳ" | "Cấp cứu";
  status: AppStatus;
  notes?: string;
}

const APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    time: "08:00",
    date: "28/03/2026",
    patientName: "Nguyễn Văn An",
    patientCode: "BN-1024",
    patientAge: 45,
    patientGender: "Nam",
    reason: "Kiểm tra huyết áp định kỳ",
    room: "302",
    type: "Khám định kỳ",
    status: "Đã hoàn tất",
    notes: "Huyết áp ổn định, tiếp tục dùng thuốc cũ",
  },
  {
    id: "2",
    time: "08:30",
    date: "28/03/2026",
    patientName: "Phạm Thị Bình",
    patientCode: "BN-0891",
    patientAge: 32,
    patientGender: "Nữ",
    reason: "Theo dõi đường huyết",
    room: "302",
    type: "Tái khám",
    status: "Đã hoàn tất",
  },
  {
    id: "3",
    time: "09:00",
    date: "28/03/2026",
    patientName: "Lê Văn Cường",
    patientCode: "BN-1156",
    patientAge: 58,
    patientGender: "Nam",
    reason: "Đánh giá chức năng tim",
    room: "302",
    type: "Tái khám",
    status: "Đang khám",
  },
  {
    id: "4",
    time: "09:30",
    date: "28/03/2026",
    patientName: "Hoàng Thị Dung",
    patientCode: "BN-1302",
    patientAge: 27,
    patientGender: "Nữ",
    reason: "Đau khớp tay, sưng vào buổi sáng",
    room: "302",
    type: "Khám lần đầu",
    status: "Chờ khám",
  },
  {
    id: "5",
    time: "10:00",
    date: "28/03/2026",
    patientName: "Đỗ Minh Khoa",
    patientCode: "BN-0774",
    patientAge: 41,
    patientGender: "Nam",
    reason: "Xem kết quả xét nghiệm chức năng hô hấp",
    room: "302",
    type: "Tái khám",
    status: "Chờ khám",
  },
  {
    id: "6",
    time: "13:30",
    date: "28/03/2026",
    patientName: "Vũ Thị Lan",
    patientCode: "BN-0633",
    patientAge: 55,
    patientGender: "Nữ",
    reason: "Tư vấn phác đồ điều trị dài hạn",
    room: "302",
    type: "Tái khám",
    status: "Chờ khám",
  },
  {
    id: "7",
    time: "14:00",
    date: "28/03/2026",
    patientName: "Ngô Văn Hùng",
    patientCode: "BN-1088",
    patientAge: 38,
    patientGender: "Nam",
    reason: "Đau thượng vị tái phát",
    room: "302",
    type: "Tái khám",
    status: "Chờ khám",
  },
  {
    id: "8",
    time: "14:30",
    date: "28/03/2026",
    patientName: "Trịnh Thị Mai",
    patientCode: "BN-0942",
    patientAge: 50,
    patientGender: "Nữ",
    reason: "Kiểm tra đường huyết 3 tháng",
    room: "302",
    type: "Khám định kỳ",
    status: "Chờ khám",
  },
];

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEK_DATES = [23, 24, 25, 26, 27, 28, 29];
const COUNTS = [6, 8, 5, 7, 6, 8, 0];

function statusBadgeStyle(status: AppStatus) {
  if (status === "Đã hoàn tất") return "bg-secondary/10 text-secondary";
  if (status === "Đang khám") return "bg-primary/10 text-primary";
  if (status === "Vắng mặt" || status === "Đã hủy") return "bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

function typeBadge(type: Appointment["type"]): "destructive" | "default" | "outline" {
  if (type === "Cấp cứu") return "destructive";
  if (type === "Khám lần đầu") return "default";
  return "outline";
}

export function AppointmentsView() {
  const [search, setSearch] = React.useState("");
  const [selectedDay, setSelectedDay] = React.useState(5); // Friday = index 5 (28)

  const filtered = APPOINTMENTS.filter(
    (a) =>
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientCode.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase()),
  );

  const done = APPOINTMENTS.filter((a) => a.status === "Đã hoàn tất").length;
  const total = APPOINTMENTS.length;

  return (
    <div className="space-y-6">
      {/* Week strip */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Tháng 3, 2026</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant="outline">{done}/{total} hoàn tất hôm nay</Badge>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-colors",
                  selectedDay === i
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                  WEEK_DATES[i] === 28 && selectedDay !== i && "ring-1 ring-primary/30",
                )}
              >
                <span className="text-xs font-medium">{day}</span>
                <span className="text-lg font-semibold">{WEEK_DATES[i]}</span>
                {COUNTS[i] > 0 ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      selectedDay === i
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {COUNTS[i]}
                  </span>
                ) : (
                  <span className="h-5 text-xs text-muted-foreground">–</span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment list */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Thứ Bảy, 28 tháng 3
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm bệnh nhân..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-3">
            {filtered.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border p-4 transition-colors hover:bg-accent/50",
                  a.status === "Đang khám" && "border-primary/30 bg-primary/5",
                )}
              >
                {/* Time column */}
                <div className="flex w-14 shrink-0 flex-col items-center gap-1 pt-0.5 text-center">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold tabular-nums">{a.time}</span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium">{a.patientName}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.patientCode} · {a.patientGender}, {a.patientAge} tuổi
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={typeBadge(a.type)} className="text-xs">
                        {a.type}
                      </Badge>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusBadgeStyle(a.status),
                        )}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">{a.reason}</div>

                  {a.notes && (
                    <div className="mt-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                      Ghi chú: {a.notes}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      Phòng {a.room}
                    </div>
                    {a.status === "Chờ khám" && (
                      <div className="ml-auto flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Bắt đầu khám
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive">
                          Hủy
                        </Button>
                      </div>
                    )}
                    {a.status === "Đang khám" && (
                      <div className="ml-auto">
                        <Button size="sm" className="h-7 text-xs">
                          Xem hồ sơ
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Không tìm thấy lịch khám phù hợp
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
