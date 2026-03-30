"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Loader, Save, Trash2, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShiftKey = "MORNING" | "AFTERNOON" | "EVENING" | "ONCALL" | "OFF";

interface ScheduleEntry {
  id: string;
  shift: ShiftKey;
  room: string;
  timeFrom: string;
  timeTo: string;
  note: string;
}

interface MonthData {
  scheduleMap: Record<number, ScheduleEntry>;
  apptCounts: Record<number, number>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIFTS: { key: ShiftKey; label: string; short: string; color: string; defaultFrom: string; defaultTo: string }[] = [
  { key: "MORNING",   label: "Ca sáng",   short: "Sáng",  color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",     defaultFrom: "07:30", defaultTo: "12:00" },
  { key: "AFTERNOON", label: "Ca chiều",  short: "Chiều", color: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",     defaultFrom: "13:00", defaultTo: "17:30" },
  { key: "EVENING",   label: "Ca tối",    short: "Tối",   color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800", defaultFrom: "17:30", defaultTo: "22:00" },
  { key: "ONCALL",    label: "Ca trực",   short: "Trực",  color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",  defaultFrom: "17:30", defaultTo: "07:30" },
  { key: "OFF",       label: "Nghỉ",      short: "Nghỉ",  color: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",    defaultFrom: "", defaultTo: "" },
];

const VI_MONTHS = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
const VI_DAYS   = ["CN","T2","T3","T4","T5","T6","T7"];
const VI_DAY_FULL = ["Chủ nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];

function shiftMeta(key: ShiftKey) {
  return SHIFTS.find((s) => s.key === key) ?? SHIFTS[4];
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScheduleView() {
  const { doctorId } = useDoctor();

  const today = new Date();
  const [viewYear,  setViewYear]  = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth() + 1); // 1-based

  const [data,    setData]    = React.useState<MonthData>({ scheduleMap: {}, apptCounts: {} });
  const [loading, setLoading] = React.useState(true);

  // Edit dialog state
  const [editDay,   setEditDay]   = React.useState<number | null>(null);
  const [editShift, setEditShift] = React.useState<ShiftKey>("MORNING");
  const [editRoom,  setEditRoom]  = React.useState("");
  const [editFrom,  setEditFrom]  = React.useState("");
  const [editTo,    setEditTo]    = React.useState("");
  const [editNote,  setEditNote]  = React.useState("");
  const [saving,    setSaving]    = React.useState(false);
  const [deleting,  setDeleting]  = React.useState(false);

  // ── Load month data ──
  async function loadMonth(year: number, month: number) {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/schedule?doctorId=${doctorId}&year=${year}&month=${month}`, { cache: "no-store" });
      const d: MonthData = await res.json();
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { loadMonth(viewYear, viewMonth); }, [doctorId, viewYear, viewMonth]); // eslint-disable-line

  function prevMonth() {
    if (viewMonth === 1) { setViewYear((y) => y - 1); setViewMonth(12); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewYear((y) => y + 1); setViewMonth(1); }
    else setViewMonth((m) => m + 1);
  }

  // ── Build calendar grid ──
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDow    = new Date(viewYear, viewMonth - 1, 1).getDay(); // 0=Sun

  // Calendar cells: nulls for padding, then 1..daysInMonth
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Open edit dialog ──
  function openEdit(day: number) {
    const entry = data.scheduleMap[day];
    setEditDay(day);
    setEditShift(entry?.shift ?? "MORNING");
    setEditRoom(entry?.room ?? "");
    setEditFrom(entry?.timeFrom ?? shiftMeta(entry?.shift ?? "MORNING").defaultFrom);
    setEditTo(entry?.timeTo ?? shiftMeta(entry?.shift ?? "MORNING").defaultTo);
    setEditNote(entry?.note ?? "");
  }

  function handleShiftSelect(key: ShiftKey) {
    setEditShift(key);
    const meta = shiftMeta(key);
    setEditFrom(meta.defaultFrom);
    setEditTo(meta.defaultTo);
  }

  async function handleSave() {
    if (!doctorId || editDay === null) return;
    setSaving(true);
    try {
      await fetch("/api/doctor/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          date: toDateStr(viewYear, viewMonth, editDay),
          shift: editShift,
          room: editRoom,
          timeFrom: editFrom,
          timeTo: editTo,
          note: editNote,
        }),
      });
      await loadMonth(viewYear, viewMonth);
      setEditDay(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!doctorId || editDay === null) return;
    setDeleting(true);
    try {
      await fetch(`/api/doctor/schedule?doctorId=${doctorId}&date=${toDateStr(viewYear, viewMonth, editDay)}`, { method: "DELETE" });
      await loadMonth(viewYear, viewMonth);
      setEditDay(null);
    } finally {
      setDeleting(false);
    }
  }

  // ── Monthly stats ──
  const scheduleEntries = Object.values(data.scheduleMap);
  const workDays   = scheduleEntries.filter((s) => s.shift !== "OFF").length;
  const oncallDays = scheduleEntries.filter((s) => s.shift === "ONCALL").length;
  const offDays    = scheduleEntries.filter((s) => s.shift === "OFF").length;
  const totalAppts = Object.values(data.apptCounts).reduce((a, b) => a + b, 0);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear();

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Vui lòng đăng nhập để xem lịch làm việc
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Ca làm việc",    value: workDays,   sub: `${VI_MONTHS[viewMonth - 1]} ${viewYear}` },
          { label: "Ca trực",        value: oncallDays, sub: "Đêm / cuối tuần" },
          { label: "Ngày nghỉ",      value: offDays,    sub: "Đã lên kế hoạch" },
          { label: "Tổng bệnh nhân", value: totalAppts, sub: "Lịch hẹn tháng này" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold">{loading ? "—" : s.value}</div>
              <div className="text-sm font-medium mt-0.5">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {VI_MONTHS[viewMonth - 1]} {viewYear}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Nhấn vào ngày để chỉnh lịch</span>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm" variant="outline" className="h-8 px-3 text-xs"
                onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth() + 1); }}
              >
                Hôm nay
              </Button>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Shift legend */}
          <div className="mb-4 flex flex-wrap gap-2">
            {SHIFTS.map((s) => (
              <span key={s.key} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", s.color)}>
                {s.short}
              </span>
            ))}
            <span className="ml-1 text-xs text-muted-foreground self-center">— nhấn vào ô ngày để đặt ca</span>
          </div>

          {/* Day-of-week headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {VI_DAYS.map((d, i) => (
              <div key={d} className={cn("py-1 text-center text-xs font-medium text-muted-foreground", i === 0 && "text-red-500")}>
                {d}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }
                const entry   = data.scheduleMap[day];
                const appts   = data.apptCounts[day] ?? 0;
                const todayFlag = isToday(day);
                const dow     = (firstDow + day - 1) % 7; // 0=Sun

                return (
                  <button
                    key={day}
                    onClick={() => openEdit(day)}
                    className={cn(
                      "relative flex min-h-[70px] flex-col rounded-xl border p-1.5 text-left transition-all hover:shadow-md",
                      todayFlag
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "hover:border-primary/40 hover:bg-accent/50",
                      !entry && "border-dashed",
                    )}
                  >
                    {/* Day number */}
                    <span className={cn(
                      "grid h-6 w-6 place-items-center rounded-full text-xs font-semibold",
                      todayFlag ? "bg-primary text-primary-foreground" : dow === 0 ? "text-red-500" : "text-foreground",
                    )}>
                      {day}
                    </span>

                    {/* Shift badge */}
                    {entry && (
                      <span className={cn(
                        "mt-1 w-full truncate rounded-md border px-1 py-0.5 text-center text-[10px] font-medium leading-tight",
                        shiftMeta(entry.shift).color,
                      )}>
                        {shiftMeta(entry.shift).short}
                        {entry.room && ` · ${entry.room}`}
                      </span>
                    )}

                    {/* Appointment count dot */}
                    {appts > 0 && (
                      <span className="mt-auto self-end rounded-full bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {appts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={editDay !== null} onOpenChange={(open) => { if (!open) setEditDay(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editDay !== null && (() => {
                const dow = (firstDow + editDay - 1) % 7;
                return `${VI_DAY_FULL[dow]}, ${editDay} ${VI_MONTHS[viewMonth - 1]} ${viewYear}`;
              })()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Shift selector */}
            <div>
              <p className="mb-2 text-sm font-medium">Ca làm việc</p>
              <div className="grid grid-cols-5 gap-1.5">
                {SHIFTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleShiftSelect(s.key)}
                    className={cn(
                      "rounded-xl border py-2 text-xs font-semibold transition-all",
                      editShift === s.key
                        ? cn(s.color, "ring-2 ring-offset-1 ring-primary/40")
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    {s.short}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {editShift !== "OFF" && (
              <>
                {/* Time range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1.5 text-sm font-medium">Giờ bắt đầu</p>
                    <Input
                      type="time"
                      value={editFrom}
                      onChange={(e) => setEditFrom(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-sm font-medium">Giờ kết thúc</p>
                    <Input
                      type="time"
                      value={editTo}
                      onChange={(e) => setEditTo(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Room */}
                <div>
                  <p className="mb-1.5 text-sm font-medium">Phòng khám</p>
                  <Input
                    placeholder="vd: 302, A&E, ICU..."
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="h-9"
                  />
                </div>
              </>
            )}

            {/* Note */}
            <div>
              <p className="mb-1.5 text-sm font-medium">Ghi chú</p>
              <Textarea
                placeholder="Ghi chú thêm về ca làm việc..."
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {editDay !== null && data.scheduleMap[editDay] && (
              <Button
                variant="outline"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={deleting || saving}
              >
                {deleting ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Xóa lịch
              </Button>
            )}
            <Button variant="outline" onClick={() => setEditDay(null)} disabled={saving || deleting}>
              <X className="h-4 w-4 mr-1.5" /> Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving || deleting} className="gap-1.5">
              {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
