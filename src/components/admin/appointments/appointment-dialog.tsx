"use client";

import * as React from "react";
import type { Appointment } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type Option = { id: string; name: string; label?: string };

type FormData = {
  patientId: string;
  doctorId: string;
  appointmentDate: string;   // YYYY-MM-DD
  appointmentTime: string;   // HH:MM
  status: "Đã xác nhận" | "Chờ xác nhận" | "Hoàn tất" | "Hủy";
};

const DEFAULT_FORM: FormData = {
  patientId: "", doctorId: "",
  appointmentDate: new Date().toISOString().split("T")[0],
  appointmentTime: "08:00",
  status: "Chờ xác nhận",
};

// Reverse-lookup: the GET API returns relative date strings but for editing we
// need a raw ISO date. The appointment row stores relative date strings (e.g.
// "Hôm nay") so for editing we pass the appointmentDate separately.
type AppointmentWithDate = Appointment & { rawDate?: string; rawPatientId?: string; rawDoctorId?: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: AppointmentWithDate | null;
  onSuccess: () => void;
};

export function AppointmentDialog({ open, onOpenChange, appointment, onSuccess }: Props) {
  const isEdit = !!appointment;
  const [form, setForm] = React.useState<FormData>(DEFAULT_FORM);
  const [patients, setPatients] = React.useState<Option[]>([]);
  const [doctors, setDoctors] = React.useState<Option[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [optionsLoading, setOptionsLoading] = React.useState(false);

  // Fetch select options when dialog opens
  React.useEffect(() => {
    if (!open) return;
    setError("");
    setOptionsLoading(true);

    fetch("/api/admin/options")
      .then((r) => r.json())
      .then(({ patients: ps, doctors: ds }) => {
        setPatients(ps.map((p: { id: string; name: string; code: string }) => ({
          id: p.id,
          name: `${p.name} (${p.code})`,
        })));
        setDoctors(ds.map((d: { id: string; name: string; specialization: string }) => ({
          id: d.id,
          name: `${d.name} — ${d.specialization}`,
        })));
      })
      .catch(() => setError("Không thể tải danh sách bác sĩ / bệnh nhân"))
      .finally(() => setOptionsLoading(false));

    if (appointment) {
      setForm({
        patientId: appointment.rawPatientId ?? "",
        doctorId: appointment.rawDoctorId ?? "",
        appointmentDate: appointment.rawDate ?? new Date().toISOString().split("T")[0],
        appointmentTime: appointment.time,
        status: appointment.status,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [open, appointment]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.patientId) return setError("Vui lòng chọn bệnh nhân");
    if (!form.doctorId) return setError("Vui lòng chọn bác sĩ");
    if (!form.appointmentDate) return setError("Ngày khám là bắt buộc");
    if (!form.appointmentTime) return setError("Giờ khám là bắt buộc");

    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/appointments/${appointment!.id}`
        : "/api/admin/appointments";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Có lỗi xảy ra"); return; }
      onSuccess();
      onOpenChange(false);
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Cập nhật lịch hẹn" : "Thêm lịch hẹn mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="apt-patient">Bệnh nhân *</Label>
            <select
              id="apt-patient"
              className={SELECT_CLASS}
              value={form.patientId}
              onChange={(e) => set("patientId", e.target.value)}
              disabled={optionsLoading}
            >
              <option value="">— Chọn bệnh nhân —</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="apt-doctor">Bác sĩ *</Label>
            <select
              id="apt-doctor"
              className={SELECT_CLASS}
              value={form.doctorId}
              onChange={(e) => set("doctorId", e.target.value)}
              disabled={optionsLoading}
            >
              <option value="">— Chọn bác sĩ —</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="apt-date">Ngày khám *</Label>
              <Input
                id="apt-date"
                type="date"
                value={form.appointmentDate}
                onChange={(e) => set("appointmentDate", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="apt-time">Giờ khám *</Label>
              <Input
                id="apt-time"
                type="time"
                value={form.appointmentTime}
                onChange={(e) => set("appointmentTime", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="apt-status">Trạng thái</Label>
            <select
              id="apt-status"
              className={SELECT_CLASS}
              value={form.status}
              onChange={(e) => set("status", e.target.value as FormData["status"])}
            >
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Hoàn tất">Hoàn tất</option>
              <option value="Hủy">Hủy</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading || optionsLoading}>
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
