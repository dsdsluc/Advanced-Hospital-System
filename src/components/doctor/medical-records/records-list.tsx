"use client";

import * as React from "react";
import { Search, FileText, Pill, Stethoscope, Calendar, Clock } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";
import { ConsultationDialog } from "@/components/doctor/appointments/consultation-dialog";
import type { Appointment } from "@/components/doctor/appointments/appointments-view";

interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  patientGender: string;
  patientAge: number;
  patientPhone: string;
  doctorId: string;
  date: string;
  appointmentTime: string;
  appointmentStatus: string;
  department: string;
  departmentId: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: Prescription[];
}

function statusStyle(status: string) {
  switch (status) {
    case "Hoàn tất":    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "Đang khám":   return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300";
    case "Đã check-in": return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
    default:            return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

function recordToAppointment(r: MedicalRecord): Appointment {
  return {
    id: r.appointmentId,
    date: r.date,
    appointmentDate: r.date,
    time: r.appointmentTime,
    patientId: r.patientId,
    patientName: r.patientName,
    patientCode: r.patientCode,
    patientAge: r.patientAge,
    patientGender: r.patientGender,
    patientPhone: r.patientPhone,
    department: r.department,
    departmentId: r.departmentId,
    status: r.appointmentStatus,
    notes: r.treatmentPlan,
    diagnosis: r.diagnosis,
  };
}

export function RecordsList() {
  const { doctorId } = useDoctor();
  const [records, setRecords] = React.useState<MedicalRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<MedicalRecord | null>(null);
  const [editingAppt, setEditingAppt] = React.useState<Appointment | null>(null);

  async function load() {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/medical-records?doctorId=${doctorId}`, { cache: "no-store" });
      const data: MedicalRecord[] = await res.json();
      const list = Array.isArray(data) ? data : [];
      setRecords(list);
      setSelected((prev) => {
        if (!prev) return list[0] ?? null;
        return list.find((r) => r.id === prev.id) ?? list[0] ?? null;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, [doctorId]); // eslint-disable-line

  const filtered = records.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientCode.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase()),
  );

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Vui lòng đăng nhập để xem hồ sơ bệnh án
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-5">
        {/* ── Left: list ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm bệnh nhân, chẩn đoán..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-sm"
            />
          </div>

          <p className="text-xs text-muted-foreground px-1">
            {loading ? "Đang tải..." : `${filtered.length} hồ sơ`}
          </p>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
              <FileText className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">Không tìm thấy hồ sơ nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={cn(
                    "group w-full rounded-2xl border p-4 text-left transition-colors hover:bg-accent/50",
                    selected?.id === r.id && "border-primary/40 bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-teal-500 to-blue-500 text-white">
                        {getInitials(r.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{r.patientName}</span>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", statusStyle(r.appointmentStatus))}>
                          {r.appointmentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {r.patientCode} · {r.date}
                      </div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {r.diagnosis || r.chiefComplaint || "Chưa có chẩn đoán"}
                      </div>
                      {r.prescriptions.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
                          <Pill className="h-3 w-3" />
                          {r.prescriptions.length} loại thuốc
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: detail ── */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed">
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Chọn hồ sơ để xem chi tiết</p>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-white font-bold">
                        {getInitials(selected.patientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selected.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {selected.patientCode} · {selected.patientAge} tuổi · {selected.patientGender}
                      </p>
                    </div>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", statusStyle(selected.appointmentStatus))}>
                    {selected.appointmentStatus}
                  </span>
                </div>

                {/* Date / time / dept row */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {selected.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {selected.appointmentTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Stethoscope className="h-3.5 w-3.5" /> {selected.department}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <Separator />

                {/* Chief complaint */}
                {selected.chiefComplaint && (
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Lý do khám
                    </p>
                    <p className="text-sm leading-relaxed">{selected.chiefComplaint}</p>
                  </div>
                )}

                {/* Diagnosis */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Chẩn đoán
                  </p>
                  {selected.diagnosis ? (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200">
                      {selected.diagnosis}
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Chưa có chẩn đoán</p>
                  )}
                </div>

                {/* Treatment plan */}
                {selected.treatmentPlan && (
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Hướng điều trị
                    </p>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-300">
                      {selected.treatmentPlan}
                    </div>
                  </div>
                )}

                {/* Prescriptions */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Đơn thuốc ({selected.prescriptions.length})
                  </p>
                  {selected.prescriptions.length === 0 ? (
                    <p className="text-sm italic text-muted-foreground">Chưa kê đơn thuốc</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.prescriptions.map((rx) => (
                        <div
                          key={rx.id}
                          className="flex items-start gap-3 rounded-xl border bg-card p-3"
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-100 dark:bg-teal-950/40">
                            <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="flex-1 text-sm">
                            <p className="font-semibold">{rx.medicineName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {rx.dosage} · {rx.frequency} · {rx.duration}
                            </p>
                            {rx.notes && (
                              <p className="text-xs italic text-muted-foreground mt-0.5">{rx.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => setEditingAppt(recordToAppointment(selected))}
                  >
                    <FileText className="h-4 w-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                  <Badge variant="outline" className="flex items-center px-3 text-xs">
                    {selected.patientPhone}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Consultation dialog for editing */}
      {editingAppt && (
        <ConsultationDialog
          appointment={editingAppt}
          doctorId={doctorId!}
          open={!!editingAppt}
          forceEdit
          onOpenChange={(open: boolean) => {
            if (!open) {
              setEditingAppt(null);
              load();
            }
          }}
        />
      )}
    </>
  );
}
