"use client";

import { useEffect, useState } from "react";
import { Loader, Plus, Trash2, CheckCircle2, Pill } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Appointment } from "./appointments-view";

interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

interface EncounterData {
  id: string;
  chiefComplaint: string;
  diagnosis: string;
  treatmentPlan: string;
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

interface Props {
  appointment: Appointment;
  doctorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Force edit mode even for completed records (e.g. opened from medical records page) */
  forceEdit?: boolean;
}

export function ConsultationDialog({ appointment, doctorId, open, onOpenChange, forceEdit = false }: Props) {
  const readonly = appointment.status === "Hoàn tất" && !forceEdit;

  const [encounter, setEncounter] = useState<EncounterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");

  const [newRx, setNewRx] = useState<NewRx>(EMPTY_RX);
  const [addingRx, setAddingRx] = useState(false);
  const [showRxForm, setShowRxForm] = useState(false);
  const [deletingRx, setDeletingRx] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/doctor/encounters?appointmentId=${appointment.id}`)
      .then((r) => r.json())
      .then((data: EncounterData | null) => {
        setEncounter(data);
        if (data) {
          setChiefComplaint(data.chiefComplaint);
          setDiagnosis(data.diagnosis);
          setTreatmentPlan(data.treatmentPlan);
        } else {
          setChiefComplaint("");
          setDiagnosis("");
          setTreatmentPlan("");
        }
      })
      .catch(() => setEncounter(null))
      .finally(() => setLoading(false));
  }, [open, appointment.id]);

  async function saveEncounter() {
    setSaving(true);
    try {
      const res = await fetch("/api/doctor/encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          doctorId,
          chiefComplaint,
          diagnosis,
          treatmentPlan,
        }),
      });
      const data: EncounterData = await res.json();
      setEncounter(data);
    } finally {
      setSaving(false);
    }
  }

  async function completeVisit() {
    setCompleting(true);
    try {
      // Save encounter first
      await fetch("/api/doctor/encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          doctorId,
          chiefComplaint,
          diagnosis,
          treatmentPlan,
        }),
      });
      // Also sync diagnosis to appointment for backwards compatibility
      await fetch(`/api/doctor/appointments/${appointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Hoàn tất", diagnosis, notes: treatmentPlan }),
      });
      onOpenChange(false);
    } finally {
      setCompleting(false);
    }
  }

  async function addPrescription() {
    if (!newRx.medicineName || !newRx.dosage || !newRx.frequency || !newRx.duration) return;

    // Ensure encounter exists first
    let recordId = encounter?.id;
    if (!recordId) {
      const res = await fetch("/api/doctor/encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          doctorId,
          chiefComplaint,
          diagnosis,
          treatmentPlan,
        }),
      });
      const data: EncounterData = await res.json();
      setEncounter(data);
      recordId = data.id;
    }

    setAddingRx(true);
    try {
      const res = await fetch("/api/doctor/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalRecordId: recordId, ...newRx }),
      });
      const rx: Prescription = await res.json();
      setEncounter((prev) =>
        prev ? { ...prev, prescriptions: [...prev.prescriptions, rx] } : prev
      );
      setNewRx(EMPTY_RX);
      setShowRxForm(false);
    } finally {
      setAddingRx(false);
    }
  }

  async function deletePrescription(id: string) {
    setDeletingRx(id);
    try {
      await fetch(`/api/doctor/prescriptions/${id}`, { method: "DELETE" });
      setEncounter((prev) =>
        prev ? { ...prev, prescriptions: prev.prescriptions.filter((p) => p.id !== id) } : prev
      );
    } finally {
      setDeletingRx(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {readonly ? "Kết quả khám" : "Phiên khám"}
          </DialogTitle>
          <DialogDescription>
            {appointment.patientName} ({appointment.patientCode}) · {appointment.date} {appointment.time}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="info" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex-1">Thông tin khám</TabsTrigger>
              <TabsTrigger value="rx" className="flex-1">
                Đơn thuốc
                {encounter?.prescriptions.length ? (
                  <span className="ml-1.5 rounded-full bg-primary/20 px-1.5 text-xs">
                    {encounter.prescriptions.length}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Encounter info ── */}
            <TabsContent value="info" className="mt-4 space-y-4">
              {/* Patient summary */}
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/50 p-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                  <p className="font-medium">{appointment.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tuổi / Giới tính</p>
                  <p className="font-medium">{appointment.patientAge} tuổi · {appointment.patientGender}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Khoa</p>
                  <p className="font-medium">{appointment.department}</p>
                </div>
              </div>

              <Separator />

              {/* Chief complaint */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Lý do khám</label>
                {readonly ? (
                  <p className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                    {chiefComplaint || <span className="text-muted-foreground italic">Không có</span>}
                  </p>
                ) : (
                  <Textarea
                    placeholder="Triệu chứng, lý do đến khám..."
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                )}
              </div>

              {/* Diagnosis */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Chẩn đoán</label>
                {readonly ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200">
                    {diagnosis || <span className="italic opacity-60">Chưa có chẩn đoán</span>}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Nhập chẩn đoán..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                )}
              </div>

              {/* Treatment plan */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Hướng điều trị / Ghi chú</label>
                {readonly ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-300">
                    {treatmentPlan || <span className="italic opacity-60">Không có</span>}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Hướng điều trị, thuốc, lời dặn..."
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                )}
              </div>
            </TabsContent>

            {/* ── Tab 2: Prescriptions ── */}
            <TabsContent value="rx" className="mt-4 space-y-3">
              {(!encounter?.prescriptions.length && !showRxForm) ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-muted">
                    <Pill className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Chưa có đơn thuốc</p>
                  {!readonly && (
                    <Button size="sm" variant="outline" className="mt-3 gap-1.5" onClick={() => setShowRxForm(true)}>
                      <Plus className="h-3.5 w-3.5" /> Thêm thuốc
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {/* Existing prescriptions */}
                  {encounter?.prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="flex items-start justify-between gap-3 rounded-xl border bg-card p-3"
                    >
                      <div className="flex-1 text-sm">
                        <p className="font-semibold">{rx.medicineName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {rx.dosage} · {rx.frequency} · {rx.duration}
                        </p>
                        {rx.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">{rx.notes}</p>
                        )}
                      </div>
                      {!readonly && (
                        <Button
                          size="icon" variant="ghost"
                          className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                          disabled={deletingRx === rx.id}
                          onClick={() => deletePrescription(rx.id)}
                        >
                          {deletingRx === rx.id
                            ? <Loader className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Add prescription form */}
                  {!readonly && showRxForm && (
                    <div className="rounded-xl border border-dashed p-4 space-y-3">
                      <p className="text-sm font-medium">Thêm thuốc mới</p>
                      <div className="grid grid-cols-2 gap-3">
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
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="ghost" onClick={() => { setShowRxForm(false); setNewRx(EMPTY_RX); }}>
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          disabled={addingRx || !newRx.medicineName || !newRx.dosage || !newRx.frequency || !newRx.duration}
                          onClick={addPrescription}
                        >
                          {addingRx ? <Loader className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                          Lưu thuốc
                        </Button>
                      </div>
                    </div>
                  )}

                  {!readonly && !showRxForm && (
                    <Button size="sm" variant="outline" className="gap-1.5 w-full" onClick={() => setShowRxForm(true)}>
                      <Plus className="h-3.5 w-3.5" /> Thêm thuốc
                    </Button>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className={cn("mt-4", readonly && "justify-end")}>
          {readonly ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving || completing}>
                Đóng
              </Button>
              <Button variant="secondary" onClick={saveEncounter} disabled={saving || completing}>
                {saving ? <Loader className="h-4 w-4 animate-spin mr-1.5" /> : null}
                Lưu nháp
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                onClick={completeVisit}
                disabled={saving || completing}
              >
                {completing
                  ? <Loader className="h-4 w-4 animate-spin" />
                  : <CheckCircle2 className="h-4 w-4" />
                }
                Hoàn tất khám
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
