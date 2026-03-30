"use client";
import { useEffect, useState } from "react";
import { Calendar, CalendarPlus, Clock, Stethoscope, User } from "lucide-react";
import { BookDialog } from "./book-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient-context";

interface Appointment {
  id: string;
  date: string;
  rawDate: string;
  time: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatarUrl: string;
  department: string;
  status: string;
  notes: string;
  diagnosis: string;
}

const STATUS_TABS = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đã check-in", "Đang khám", "Hoàn tất", "Hủy"];

function statusBadgeStyle(status: string): string {
  switch (status) {
    case "Chờ xác nhận": return "bg-yellow-100 text-yellow-800";
    case "Đã xác nhận":  return "bg-blue-100 text-blue-800";
    case "Đã check-in":  return "bg-sky-100 text-sky-800";
    case "Đang khám":    return "bg-violet-100 text-violet-800";
    case "Hoàn tất":     return "bg-green-100 text-green-800";
    case "Hủy":          return "bg-red-100 text-red-800";
    default:             return "bg-slate-100 text-slate-700";
  }
}

// Workflow steps shown in the detail modal
const WORKFLOW_STEPS = [
  { key: "booked",    label: "Đặt lịch" },
  { key: "confirmed", label: "Xác nhận" },
  { key: "checkin",   label: "Check-in" },
  { key: "progress",  label: "Đang khám" },
  { key: "done",      label: "Hoàn tất" },
];

function getStepIndex(status: string): number {
  switch (status) {
    case "Chờ xác nhận": return 0;
    case "Đã xác nhận":  return 1;
    case "Đã check-in":  return 2;
    case "Đang khám":    return 3;
    case "Hoàn tất":     return 4;
    default:             return -1; // cancelled
  }
}

export function AppointmentsView() {
  const { patientId } = usePatient();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBook, setShowBook] = useState(false);

  const loadAppointments = () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/patient/appointments?patientId=${patientId}`)
      .then((r) => r.json())
      .then((data: Appointment[]) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  if (!patientId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
        Vui lòng đăng nhập để xem lịch hẹn.
      </div>
    );
  }

  const baseFiltered = appointments.filter(
    (a) =>
      a.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase()),
  );

  const filtered =
    activeTab === "Tất cả"
      ? baseFiltered
      : baseFiltered.filter((a) => a.status === activeTab);

  const upcoming = appointments.filter(
    (a) => ["Chờ xác nhận", "Đã xác nhận", "Đã check-in", "Đang khám"].includes(a.status),
  ).length;
  const completed = appointments.filter((a) => a.status === "Hoàn tất").length;

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Lịch hẹn của tôi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi và quản lý toàn bộ lịch khám của bạn.
          </p>
        </div>
        <Button
          onClick={() => setShowBook(true)}
          className="gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600 shadow-sm"
        >
          <CalendarPlus className="h-4 w-4" />
          Đặt lịch mới
        </Button>
      </div>

      <BookDialog
        open={showBook}
        onOpenChange={setShowBook}
        onBooked={loadAppointments}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 dark:bg-blue-950/40">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {appointments.length}
              </div>
              <div className="text-xs text-muted-foreground">Tổng lịch hẹn</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-100 dark:bg-yellow-950/40">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {upcoming}
              </div>
              <div className="text-xs text-muted-foreground">Sắp tới</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-green-100 dark:bg-green-950/40">
              <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {completed}
              </div>
              <div className="text-xs text-muted-foreground">Hoàn tất</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm bác sĩ hoặc khoa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-white/40 bg-white/60 pl-9 backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/60"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-white/70 bg-white/70 text-slate-600 hover:bg-white/90 backdrop-blur-sm",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/70 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 dark:bg-blue-950/40">
            <Calendar className="h-8 w-8 text-blue-400" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Không có lịch hẹn nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <Card
              key={appt.id}
              className="border-white/70 bg-white/70 backdrop-blur-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-900/60"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={appt.doctorAvatarUrl} alt={appt.doctorName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-xs font-semibold text-white">
                      {appt.doctorName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {appt.doctorName}
                        </p>
                        <p className="text-xs text-muted-foreground">{appt.doctorSpecialization}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 border-0 text-xs font-medium",
                          statusBadgeStyle(appt.status),
                        )}
                      >
                        {appt.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {appt.date}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {appt.time}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Stethoscope className="h-3 w-3" />
                        {appt.department}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 border-blue-200 bg-blue-50 px-3 text-xs text-blue-700 hover:bg-blue-100 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-300"
                        onClick={() => {
                          setSelectedAppointment(appt);
                          setShowDetails(true);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            {selectedAppointment && (
              <DialogDescription>
                {selectedAppointment.doctorName} · {selectedAppointment.department}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              {/* Doctor section */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-gradient-to-br from-blue-50 to-teal-50/60 p-4 dark:border-white/10 dark:from-blue-950/30 dark:to-teal-950/20">
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarImage
                    src={selectedAppointment.doctorAvatarUrl}
                    alt={selectedAppointment.doctorName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-lg font-bold text-white">
                    {selectedAppointment.doctorName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedAppointment.doctorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.doctorSpecialization}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Status timeline */}
              {selectedAppointment.status !== "Hủy" ? (
                <div className="flex items-center justify-between gap-1">
                  {WORKFLOW_STEPS.map((step, idx) => {
                    const active = getStepIndex(selectedAppointment.status);
                    const done = idx <= active;
                    const current = idx === active;
                    return (
                      <div key={step.key} className="flex flex-1 flex-col items-center gap-1">
                        <div className={cn(
                          "grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-colors",
                          done
                            ? current
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-300"
                              : "bg-green-500 text-white"
                            : "bg-slate-100 text-slate-400 dark:bg-slate-800",
                        )}>
                          {done && !current ? "✓" : idx + 1}
                        </div>
                        <span className={cn(
                          "text-center text-[10px] leading-tight",
                          done ? "font-medium text-slate-700 dark:text-slate-300" : "text-muted-foreground",
                        )}>
                          {step.label}
                        </span>
                        {idx < WORKFLOW_STEPS.length - 1 && (
                          <div className={cn(
                            "absolute mt-3.5 h-0.5 w-full translate-x-1/2",
                            done && idx < active ? "bg-green-400" : "bg-slate-200 dark:bg-slate-700",
                          )} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300">
                  Lịch hẹn này đã bị hủy.
                </div>
              )}

              <Separator />

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/60 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-800/40">
                  <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Ngày khám
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {selectedAppointment.date}
                  </p>
                </div>
                <div className="rounded-xl border border-white/60 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-800/40">
                  <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Giờ khám
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {selectedAppointment.time}
                  </p>
                </div>
                <div className="rounded-xl border border-white/60 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-800/40">
                  <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Khoa
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {selectedAppointment.department}
                  </p>
                </div>
                <div className="rounded-xl border border-white/60 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-800/40">
                  <p className="mb-1 text-xs text-muted-foreground">Trạng thái</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "border-0 text-xs font-medium",
                      statusBadgeStyle(selectedAppointment.status),
                    )}
                  >
                    {selectedAppointment.status}
                  </Badge>
                </div>
              </div>

              {/* Diagnosis */}
              {selectedAppointment.diagnosis && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800/40 dark:bg-blue-950/30">
                  <p className="mb-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                    Chẩn đoán
                  </p>
                  <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
                    {selectedAppointment.diagnosis}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700/40 dark:bg-slate-800/40">
                  <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Ghi chú
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
