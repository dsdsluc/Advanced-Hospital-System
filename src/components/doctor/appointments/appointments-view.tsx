"use client";

import { useEffect, useState } from "react";
import { Clock, Loader, CheckCircle2, LogIn, Play, Eye, XCircle, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";
import { ConsultationDialog } from "./consultation-dialog";

export interface Appointment {
  id: string;
  date: string;
  appointmentDate: string;
  time: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  department: string;
  departmentId: string;
  status: string;
  notes: string;
  diagnosis: string;
}

const STATUS_TABS = ["Tất cả", "Chờ xác nhận", "Đã xác nhận", "Đã check-in", "Đang khám", "Hoàn tất", "Hủy"] as const;

function statusStyle(status: string) {
  switch (status) {
    case "Chờ xác nhận":  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Đã xác nhận":   return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Đã check-in":   return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300";
    case "Đang khám":     return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300";
    case "Hoàn tất":      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Hủy":           return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:              return "bg-slate-100 text-slate-700";
  }
}

export function AppointmentsView() {
  const { doctorId } = useDoctor();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [consultationAppt, setConsultationAppt] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    loadAppointments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  async function loadAppointments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/appointments?doctorId=${doctorId}`, { cache: "no-store" });
      const data: Appointment[] = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setActionLoading(id + status);
    try {
      await fetch(`/api/doctor/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await loadAppointments();
    } finally {
      setActionLoading(null);
    }
  }

  async function startConsultation(appt: Appointment) {
    setActionLoading(appt.id + "start");
    try {
      await fetch(`/api/doctor/appointments/${appt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Đang khám" }),
      });
      setAppointments((prev) =>
        prev.map((a) => a.id === appt.id ? { ...a, status: "Đang khám" } : a)
      );
      setConsultationAppt({ ...appt, status: "Đang khám" });
    } finally {
      setActionLoading(null);
    }
  }

  const baseFiltered = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientCode.toLowerCase().includes(search.toLowerCase()),
  );
  const filtered = activeTab === "Tất cả" ? baseFiltered : baseFiltered.filter((a) => a.status === activeTab);

  const counts: Record<string, number> = {};
  for (const a of appointments) counts[a.status] = (counts[a.status] ?? 0) + 1;

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Vui lòng đăng nhập để xem lịch khám
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <div className="text-xs text-muted-foreground">Tổng lịch khám</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-violet-600">
              {(counts["Đã check-in"] ?? 0) + (counts["Đang khám"] ?? 0)}
            </div>
            <div className="text-xs text-muted-foreground">Đang chờ / đang khám</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{counts["Hoàn tất"] ?? 0}</div>
            <div className="text-xs text-muted-foreground">Đã hoàn tất</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {tab}
            {tab !== "Tất cả" && counts[tab] ? (
              <span className="ml-1.5 text-xs opacity-70">({counts[tab]})</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Tìm theo tên bệnh nhân hoặc mã..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-4 w-40 mb-2" /><Skeleton className="h-3 w-60" /></CardContent></Card>
          ))
        ) : filtered.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Không có lịch khám</CardContent></Card>
        ) : (
          filtered.map((appt) => (
            <Card key={appt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Date + status */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {appt.date} · {appt.time}
                      </div>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyle(appt.status))}>
                        {appt.status}
                      </span>
                    </div>

                    {/* Patient info */}
                    <p className="font-semibold text-sm">{appt.patientName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {appt.patientCode} · {appt.patientGender}, {appt.patientAge} tuổi · {appt.patientPhone}
                    </p>
                    <p className="text-xs text-muted-foreground">{appt.department}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {appt.status === "Chờ xác nhận" && (
                      <div className="flex gap-1.5">
                        <Button
                          size="sm" variant="outline"
                          className="h-8 gap-1 border-green-200 bg-green-50 px-2.5 text-xs text-green-700 hover:bg-green-100"
                          disabled={actionLoading === appt.id + "Đã xác nhận"}
                          onClick={() => updateStatus(appt.id, "Đã xác nhận")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Xác nhận
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          className="h-8 gap-1 border-red-200 bg-red-50 px-2.5 text-xs text-red-700 hover:bg-red-100"
                          disabled={actionLoading === appt.id + "Hủy"}
                          onClick={() => updateStatus(appt.id, "Hủy")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Hủy
                        </Button>
                      </div>
                    )}

                    {appt.status === "Đã xác nhận" && (
                      <Button
                        size="sm" variant="outline"
                        className="h-8 gap-1.5 border-sky-200 bg-sky-50 px-2.5 text-xs text-sky-700 hover:bg-sky-100"
                        disabled={actionLoading === appt.id + "Đã check-in"}
                        onClick={() => updateStatus(appt.id, "Đã check-in")}
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        Check-in
                      </Button>
                    )}

                    {appt.status === "Đã check-in" && (
                      <Button
                        size="sm"
                        className="h-8 gap-1.5 bg-violet-600 px-2.5 text-xs text-white hover:bg-violet-700"
                        disabled={actionLoading === appt.id + "start"}
                        onClick={() => startConsultation(appt)}
                      >
                        {actionLoading === appt.id + "start"
                          ? <Loader className="h-3.5 w-3.5 animate-spin" />
                          : <Play className="h-3.5 w-3.5" />
                        }
                        Bắt đầu khám
                      </Button>
                    )}

                    {appt.status === "Đang khám" && (
                      <Button
                        size="sm"
                        className="h-8 gap-1.5 bg-violet-600 px-2.5 text-xs text-white hover:bg-violet-700"
                        onClick={() => setConsultationAppt(appt)}
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        Tiếp tục khám
                      </Button>
                    )}

                    {appt.status === "Hoàn tất" && (
                      <Button
                        size="sm" variant="outline"
                        className="h-8 gap-1.5 px-2.5 text-xs"
                        onClick={() => setConsultationAppt(appt)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Xem kết quả
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Consultation dialog */}
      {consultationAppt && (
        <ConsultationDialog
          appointment={consultationAppt}
          doctorId={doctorId!}
          open={!!consultationAppt}
          onOpenChange={(open: boolean) => { if (!open) { setConsultationAppt(null); loadAppointments(); } }}
        />
      )}
    </div>
  );
}
