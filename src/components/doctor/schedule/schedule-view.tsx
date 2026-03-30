"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Loader, RotateCcw, Save, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";

// ─── Constants ────────────────────────────────────────────────────────────────

type ShiftKey = "MORNING" | "AFTERNOON" | "EVENING" | "ONCALL" | "OFF";

interface ShiftMeta {
  key: ShiftKey;
  label: string;
  short: string;
  color: string;   // applied to badge
  btnOn: string;   // selected button style
}

const SHIFTS: ShiftMeta[] = [
  {
    key: "MORNING",
    label: "Ca sáng",   short: "Sáng",
    color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    btnOn: "border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    key: "AFTERNOON",
    label: "Ca chiều",  short: "Chiều",
    color: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
    btnOn: "border-teal-500 bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  },
  {
    key: "EVENING",
    label: "Ca tối",    short: "Tối",
    color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    btnOn: "border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
  },
  {
    key: "ONCALL",
    label: "Ca trực",   short: "Trực",
    color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    btnOn: "border-amber-500 bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    key: "OFF",
    label: "Nghỉ",      short: "Nghỉ",
    color: "bg-red-100 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
    btnOn: "border-red-500 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
];

const DEFAULT_SHIFTS: ShiftKey[] = ["MORNING", "AFTERNOON"];

const VI_MONTHS   = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
const VI_DAYS     = ["CN","T2","T3","T4","T5","T6","T7"];
const VI_DAY_FULL = ["Chủ nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];

function shiftOf(key: string) { return SHIFTS.find((s) => s.key === key)!; }

function isDefault(shifts: ShiftKey[]) {
  return shifts.length === DEFAULT_SHIFTS.length && shifts.every((s) => DEFAULT_SHIFTS.includes(s));
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DayEntry { id: string; shifts: string[]; room: string; note: string }
interface MonthData { scheduleMap: Record<number, DayEntry>; apptCounts: Record<number, number> }

export function ScheduleView() {
  const { doctorId } = useDoctor();

  const today = new Date();
  const [viewYear,  setViewYear]  = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth() + 1);
  const [data,      setData]      = React.useState<MonthData>({ scheduleMap: {}, apptCounts: {} });
  const [loading,   setLoading]   = React.useState(true);

  // Dialog state
  const [editDay,    setEditDay]    = React.useState<number | null>(null);
  const [selShifts,  setSelShifts]  = React.useState<ShiftKey[]>(DEFAULT_SHIFTS);
  const [editRoom,   setEditRoom]   = React.useState("");
  const [editNote,   setEditNote]   = React.useState("");
  const [saving,     setSaving]     = React.useState(false);
  const [resetting,  setResetting]  = React.useState(false);

  // ── Fetch ──
  async function load(year = viewYear, month = viewMonth) {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/schedule?doctorId=${doctorId}&year=${year}&month=${month}`, { cache: "no-store" });
      const d: MonthData = await res.json();
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { load(); }, [doctorId, viewYear, viewMonth]); // eslint-disable-line

  function prevMonth() {
    const [y, m] = viewMonth === 1 ? [viewYear - 1, 12] : [viewYear, viewMonth - 1];
    setViewYear(y); setViewMonth(m);
  }
  function nextMonth() {
    const [y, m] = viewMonth === 12 ? [viewYear + 1, 1] : [viewYear, viewMonth + 1];
    setViewYear(y); setViewMonth(m);
  }

  // ── Calendar cells ──
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDow    = new Date(viewYear, viewMonth - 1, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Open dialog ──
  function openEdit(day: number) {
    const entry = data.scheduleMap[day];
    setEditDay(day);
    setSelShifts(entry ? (entry.shifts as ShiftKey[]) : [...DEFAULT_SHIFTS]);
    setEditRoom(entry?.room ?? "");
    setEditNote(entry?.note ?? "");
  }

  // ── Toggle shift ──
  function toggleShift(key: ShiftKey) {
    setSelShifts((prev) => {
      // OFF is exclusive
      if (key === "OFF") return ["OFF"];
      // If OFF was selected, replace with this shift
      if (prev.includes("OFF")) return [key];
      // Toggle on/off, but keep at least one
      const next = prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key];
      return next.length === 0 ? prev : next;
    });
  }

  // ── Save ──
  async function handleSave() {
    if (!doctorId || editDay === null) return;
    setSaving(true);
    try {
      await fetch("/api/doctor/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, date: toDateStr(viewYear, viewMonth, editDay), shifts: selShifts, room: editRoom, note: editNote }),
      });
      await load();
      setEditDay(null);
    } finally { setSaving(false); }
  }

  // ── Reset to default ──
  async function handleReset() {
    if (!doctorId || editDay === null) return;
    setResetting(true);
    try {
      await fetch(`/api/doctor/schedule?doctorId=${doctorId}&date=${toDateStr(viewYear, viewMonth, editDay)}`, { method: "DELETE" });
      await load();
      setEditDay(null);
    } finally { setResetting(false); }
  }

  // ── Stats ──
  const entries      = Object.values(data.scheduleMap);
  const eveningDays  = entries.filter((e) => e.shifts.includes("EVENING")).length;
  const oncallDays   = entries.filter((e) => e.shifts.includes("ONCALL")).length;
  const offDays      = entries.filter((e) => e.shifts.includes("OFF")).length;
  const totalAppts   = Object.values(data.apptCounts).reduce((a, b) => a + b, 0);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() + 1 && viewYear === today.getFullYear();

  if (!doctorId) return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      Vui lòng đăng nhập để xem lịch làm việc
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Ca tối",        value: eveningDays, sub: `${VI_MONTHS[viewMonth-1]} ${viewYear}` },
          { label: "Ca trực",       value: oncallDays,  sub: "Tháng này" },
          { label: "Ngày nghỉ",     value: offDays,     sub: "Đã lên kế hoạch" },
          { label: "Tổng lịch hẹn", value: totalAppts,  sub: "Không bao gồm hủy" },
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{VI_MONTHS[viewMonth-1]} {viewYear}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Mặc định: <span className="font-medium text-foreground">Sáng + Chiều</span> · Nhấn ô để tuỳ chỉnh
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" className="h-8 px-3 text-xs"
                onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()+1); }}>
                Hôm nay
              </Button>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SHIFTS.map((s) => (
              <span key={s.key} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", s.color)}>
                {s.short}
              </span>
            ))}
            <span className="self-center rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground">
              Sáng + Chiều (mặc định)
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Weekday headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {VI_DAYS.map((d, i) => (
              <div key={d} className={cn("py-1 text-center text-xs font-semibold text-muted-foreground", i === 0 && "text-red-500")}>
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
                if (day === null) return <div key={`e-${idx}`} className="aspect-square" />;

                const entry    = data.scheduleMap[day];
                const appts    = data.apptCounts[day] ?? 0;
                const todayFlg = isToday(day);
                const dow      = (firstDow + day - 1) % 7;
                // shifts to display: custom entry or the silent default
                const displayShifts: string[] = entry ? entry.shifts : DEFAULT_SHIFTS;
                const isCustom = !!entry && !isDefault(entry.shifts as ShiftKey[]);

                return (
                  <button
                    key={day}
                    onClick={() => openEdit(day)}
                    className={cn(
                      "relative flex min-h-[76px] flex-col gap-0.5 rounded-xl border p-1.5 text-left transition-all hover:shadow-md",
                      todayFlg
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : isCustom
                          ? "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900/60 hover:border-primary/40"
                          : "border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-accent/40",
                    )}
                  >
                    {/* Day number */}
                    <span className={cn(
                      "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
                      todayFlg ? "bg-primary text-primary-foreground" : dow === 0 ? "text-red-500" : "text-foreground",
                    )}>
                      {day}
                    </span>

                    {/* Shift badges */}
                    <div className="flex flex-col gap-0.5">
                      {displayShifts.map((sk) => {
                        const meta = shiftOf(sk);
                        const isDefaultShift = !entry && DEFAULT_SHIFTS.includes(sk as ShiftKey);
                        return (
                          <span
                            key={sk}
                            className={cn(
                              "truncate rounded border px-1 py-0.5 text-center text-[10px] font-medium leading-tight",
                              meta.color,
                              isDefaultShift && "opacity-40",
                            )}
                          >
                            {meta.short}
                          </span>
                        );
                      })}
                    </div>

                    {/* Appointment count */}
                    {appts > 0 && (
                      <span className="mt-auto self-end rounded-full bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold text-white leading-tight">
                        {appts} ca
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editDay !== null && (() => {
                const dow = (firstDow + editDay - 1) % 7;
                return `${VI_DAY_FULL[dow]}, ${editDay} ${VI_MONTHS[viewMonth-1]} ${viewYear}`;
              })()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Shift multi-select */}
            <div>
              <p className="mb-2 text-sm font-medium">
                Ca làm việc
                <span className="ml-2 text-xs font-normal text-muted-foreground">Chọn một hoặc nhiều</span>
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {SHIFTS.map((s) => {
                  const on = selShifts.includes(s.key);
                  return (
                    <button
                      key={s.key}
                      onClick={() => toggleShift(s.key)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border py-2.5 text-xs font-semibold transition-all",
                        on ? s.btnOn : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60",
                      )}
                    >
                      <span className={cn("h-2.5 w-2.5 rounded-full", on ? "bg-current" : "bg-muted-foreground/30")} />
                      {s.short}
                    </button>
                  );
                })}
              </div>

              {/* Live preview */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selShifts.map((sk) => (
                  <span key={sk} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", shiftOf(sk).color)}>
                    {shiftOf(sk).label}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            {/* Room — hide if only OFF */}
            {!selShifts.every((s) => s === "OFF") && (
              <div>
                <p className="mb-1.5 text-sm font-medium">Phòng khám</p>
                <Input
                  placeholder="vd: 302, A&E, ICU..."
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="h-9"
                />
              </div>
            )}

            {/* Note */}
            <div>
              <p className="mb-1.5 text-sm font-medium">Ghi chú</p>
              <Textarea
                placeholder="Ghi chú thêm..."
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-1">
            {/* Reset only shown if this day has a custom entry */}
            {editDay !== null && data.scheduleMap[editDay] && (
              <Button
                variant="outline" size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={handleReset} disabled={resetting || saving}
                title="Trở về mặc định (Sáng + Chiều)"
              >
                {resetting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                Mặc định
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setEditDay(null)} disabled={saving || resetting}>
              <X className="h-3.5 w-3.5 mr-1" /> Hủy
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || resetting} className="gap-1.5">
              {saving ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
