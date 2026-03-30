"use client";

import * as React from "react";
import { Search, Plus, Trash2, Printer, Loader, Pill, Stethoscope, X } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";

interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface VisitRecord {
  id: string; // medicalRecordId
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  visitDate: string;
  appointmentTime: string;
  appointmentStatus: string;
  department: string;
  diagnosis: string;
  prescriptions: Prescription[];
}

interface NewRx {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

const EMPTY_RX: NewRx = { medicineName: "", dosage: "", frequency: "", duration: "", notes: "" };

function statusStyle(status: string) {
  if (status === "Hoàn tất")    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  if (status === "Đang khám")   return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300";
  if (status === "Đã check-in") return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

export function PrescriptionPanel() {
  const { doctorId } = useDoctor();
  const [records, setRecords] = React.useState<VisitRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<VisitRecord | null>(null);

  const [showForm, setShowForm] = React.useState(false);
  const [newRx, setNewRx] = React.useState<NewRx>(EMPTY_RX);
  const [addingRx, setAddingRx] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  async function load() {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/prescriptions?doctorId=${doctorId}`, { cache: "no-store" });
      const data: VisitRecord[] = await res.json();
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

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.patientName.toLowerCase().includes(q) ||
      r.patientCode.toLowerCase().includes(q) ||
      r.prescriptions.some((p) => p.medicineName.toLowerCase().includes(q))
    );
  });

  async function addPrescription() {
    if (!selected || !newRx.medicineName || !newRx.dosage || !newRx.frequency || !newRx.duration) return;
    setAddingRx(true);
    try {
      const res = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalRecordId: selected.id, ...newRx }),
      });
      if (res.ok) {
        const rx: Prescription = await res.json();
        const updated = { ...selected, prescriptions: [...selected.prescriptions, rx] };
        setSelected(updated);
        setRecords((prev) => prev.map((r) => r.id === selected.id ? updated : r));
        setNewRx(EMPTY_RX);
        setShowForm(false);
      }
    } finally {
      setAddingRx(false);
    }
  }

  async function deletePrescription(rxId: string) {
    if (!selected) return;
    setDeletingId(rxId);
    try {
      await fetch(`/api/doctor/prescriptions/${rxId}`, { method: "DELETE" });
      const updated = { ...selected, prescriptions: selected.prescriptions.filter((p) => p.id !== rxId) };
      setSelected(updated);
      setRecords((prev) => prev.map((r) => r.id === selected.id ? updated : r));
    } finally {
      setDeletingId(null);
    }
  }

  function handlePrint() {
    if (!selected) return;
    const lines = [
      `ĐƠN THUỐC`,
      `Bệnh nhân: ${selected.patientName} (${selected.patientCode})`,
      `Ngày khám: ${selected.visitDate} ${selected.appointmentTime}`,
      `Khoa: ${selected.department}`,
      selected.diagnosis ? `Chẩn đoán: ${selected.diagnosis}` : "",
      ``,
      `DANH SÁCH THUỐC:`,
      ...selected.prescriptions.map(
        (p, i) => `${i + 1}. ${p.medicineName} — ${p.dosage}, ${p.frequency}, ${p.duration}${p.notes ? ` (${p.notes})` : ""}`,
      ),
    ].filter(Boolean).join("\n");

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<pre style="font-family:sans-serif;padding:32px;font-size:14px">${lines}</pre>`);
    w.document.close();
    w.print();
  }

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Vui lòng đăng nhập để xem đơn thuốc
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* ── Left: visit list ── */}
      <div className="lg:col-span-2 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm bệnh nhân hoặc tên thuốc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>

        <p className="px-1 text-xs text-muted-foreground">
          {loading ? "Đang tải..." : `${filtered.length} lần khám`}
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center text-muted-foreground">
            <Pill className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">Chưa có đơn thuốc nào</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => { setSelected(r); setShowForm(false); setNewRx(EMPTY_RX); }}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-colors hover:bg-accent/50",
                  selected?.id === r.id && "border-primary/40 bg-primary/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-xs text-white">
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
                    <p className="text-xs text-muted-foreground">
                      {r.visitDate} · {r.prescriptions.length} loại thuốc
                    </p>
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
              <Pill className="mx-auto h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">Chọn lần khám để xem đơn thuốc</p>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 font-bold text-white">
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
                <Badge variant="outline" className={cn("shrink-0 text-xs", statusStyle(selected.appointmentStatus))}>
                  {selected.appointmentStatus}
                </Badge>
              </div>

              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>{selected.visitDate} · {selected.appointmentTime}</span>
                <span className="flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" /> {selected.department}
                </span>
              </div>

              {selected.diagnosis && (
                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200">
                  <span className="font-semibold">Chẩn đoán:</span> {selected.diagnosis}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <Separator />

              {/* Medicine list */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Danh sách thuốc ({selected.prescriptions.length})
                </p>

                {selected.prescriptions.length === 0 ? (
                  <p className="text-sm italic text-muted-foreground py-2">Chưa có thuốc nào</p>
                ) : (
                  <div className="space-y-2">
                    {selected.prescriptions.map((rx) => (
                      <div key={rx.id} className="flex items-start gap-3 rounded-xl border bg-card p-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-100 dark:bg-teal-950/40">
                          <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold">{rx.medicineName}</p>
                          <div className="mt-1 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div><span className="block font-medium text-foreground">Liều</span>{rx.dosage}</div>
                            <div><span className="block font-medium text-foreground">Tần suất</span>{rx.frequency}</div>
                            <div><span className="block font-medium text-foreground">Thời gian</span>{rx.duration}</div>
                          </div>
                          {rx.notes && <p className="mt-1 text-xs italic text-muted-foreground">{rx.notes}</p>}
                        </div>
                        <Button
                          size="icon" variant="ghost"
                          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                          disabled={deletingId === rx.id}
                          onClick={() => deletePrescription(rx.id)}
                        >
                          {deletingId === rx.id
                            ? <Loader className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add prescription form */}
              {showForm ? (
                <div className="rounded-xl border border-dashed p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Thêm thuốc mới</p>
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setShowForm(false); setNewRx(EMPTY_RX); }}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <Input
                        placeholder="Tên thuốc *"
                        value={newRx.medicineName}
                        onChange={(e) => setNewRx((p) => ({ ...p, medicineName: e.target.value }))}
                      />
                    </div>
                    <Input
                      placeholder="Liều dùng * (vd: 1 viên)"
                      value={newRx.dosage}
                      onChange={(e) => setNewRx((p) => ({ ...p, dosage: e.target.value }))}
                    />
                    <Input
                      placeholder="Tần suất * (vd: 2 lần/ngày)"
                      value={newRx.frequency}
                      onChange={(e) => setNewRx((p) => ({ ...p, frequency: e.target.value }))}
                    />
                    <Input
                      placeholder="Thời gian * (vd: 7 ngày)"
                      value={newRx.duration}
                      onChange={(e) => setNewRx((p) => ({ ...p, duration: e.target.value }))}
                    />
                    <Input
                      placeholder="Ghi chú (tùy chọn)"
                      value={newRx.notes}
                      onChange={(e) => setNewRx((p) => ({ ...p, notes: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setShowForm(false); setNewRx(EMPTY_RX); }}>
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      disabled={addingRx || !newRx.medicineName || !newRx.dosage || !newRx.frequency || !newRx.duration}
                      onClick={addPrescription}
                    >
                      {addingRx && <Loader className="h-3.5 w-3.5 animate-spin mr-1.5" />}
                      Lưu thuốc
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4" /> Thêm thuốc
                </Button>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  In đơn thuốc
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
