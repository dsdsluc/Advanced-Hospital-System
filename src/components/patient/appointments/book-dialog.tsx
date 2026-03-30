"use client";
import { useEffect, useState } from "react";
import { CalendarPlus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient-context";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatarUrl: string;
  departmentId: string;
  department: string;
}

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooked: () => void;
}

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
];

function todayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function BookDialog({ open, onOpenChange, onBooked }: BookDialogProps) {
  const { patientId } = usePatient();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedDoctorId("");
      setAppointmentDate("");
      setAppointmentTime("");
      setError("");
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  // Load doctors when dialog opens
  useEffect(() => {
    if (!open) return;
    setLoadingDoctors(true);
    fetch("/api/patient/doctors")
      .then((r) => r.json())
      .then((data) => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDoctors(false));
  }, [open]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) ?? null;

  const canSubmit =
    !submitting &&
    !!selectedDoctorId &&
    !!appointmentDate &&
    !!appointmentTime;

  async function handleSubmit() {
    if (!canSubmit || !selectedDoctor) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctorId,
          departmentId: selectedDoctor.departmentId,
          appointmentDate,
          appointmentTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Không thể đặt lịch hẹn");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      onBooked();
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch {
      setError("Không thể đặt lịch hẹn. Vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-blue-500" />
            Đặt lịch hẹn mới
          </DialogTitle>
          <DialogDescription>
            Chọn bác sĩ, ngày và giờ khám phù hợp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Doctor selection */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Chọn bác sĩ
            </p>
            {loadingDoctors ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Đang tải danh sách bác sĩ...
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700">
                {doctors.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Không có bác sĩ khả dụng.
                  </div>
                ) : (
                  doctors.map((doctor) => {
                    const isSelected = selectedDoctorId === doctor.id;
                    return (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => setSelectedDoctorId(doctor.id)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          isSelected
                            ? "border-l-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                            : "border-l-2 border-transparent bg-white hover:bg-blue-50/60 dark:bg-slate-900 dark:hover:bg-blue-950/20",
                        )}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                            {doctor.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              isSelected
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-slate-800 dark:text-slate-100",
                            )}
                          >
                            {doctor.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {doctor.specialization} · {doctor.department}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Date input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Ngày khám
            </label>
            <Input
              type="date"
              min={todayString()}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {/* Time selection */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Giờ khám
            </p>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = appointmentTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setAppointmentTime(slot)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-950/30",
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-800/40 dark:bg-green-950/30 dark:text-green-300">
              Đặt lịch thành công!
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600"
          >
            {submitting && <Loader className="h-4 w-4 animate-spin" />}
            Xác nhận đặt lịch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
