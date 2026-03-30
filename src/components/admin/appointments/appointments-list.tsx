"use client";

import * as React from "react";
import { CalendarDays, Clock, LogIn, Pencil, Plus, Trash2 } from "lucide-react";

import type { Appointment } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AppointmentDialog } from "./appointment-dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// Extended type that includes raw fields returned by the GET API
type AppointmentEx = Appointment & {
  rawDate?: string;
  rawPatientId?: string;
  rawDoctorId?: string;
};

function statusTone(status: string) {
  if (status === "Đã xác nhận") return "bg-primary/10 text-primary";
  if (status === "Chờ xác nhận") return "bg-muted text-muted-foreground";
  if (status === "Đã check-in") return "bg-sky-100 text-sky-700";
  if (status === "Đang khám") return "bg-violet-100 text-violet-700";
  if (status === "Hoàn tất") return "bg-secondary/10 text-secondary";
  return "bg-destructive/10 text-destructive";
}

export function AppointmentsList({ data: initial }: { data: Appointment[] }) {
  const [data, setData] = React.useState<AppointmentEx[]>(initial);
  const [scope, setScope] = React.useState<"today" | "all">("today");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AppointmentEx | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [checkingIn, setCheckingIn] = React.useState<string | null>(null);

  async function handleCheckin(id: string) {
    setCheckingIn(id);
    try {
      const res = await fetch(`${API_URL}/admin/appointments/${id}/checkin`, { method: "POST" });
      if (res.ok) await refresh();
    } catch { /* silent */ } finally {
      setCheckingIn(null);
    }
  }

  async function refresh() {
    try {
      const res = await fetch(`${API_URL}/admin/appointments`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
  }

  function openCreate() { setEditing(null); setDialogOpen(true); }
  function openEdit(a: AppointmentEx) { setEditing(a); setDialogOpen(true); }

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      await fetch(`${API_URL}/admin/appointments/${id}`, { method: "DELETE" });
      setDeleteId(null);
      await refresh();
    } catch { /* silent */ } finally {
      setDeleteLoading(false);
    }
  }

  const shown = React.useMemo(() => {
    if (scope === "all") return data;
    return data.filter((a) => a.date === "Hôm nay");
  }, [data, scope]);

  return (
    <>
      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={editing}
        onSuccess={refresh}
      />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Lịch hẹn</CardTitle>
            <div className="mt-1 text-sm text-muted-foreground">
              Theo dõi lịch khám theo ngày, bác sĩ và trạng thái.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={scope} onValueChange={(v) => setScope(v === "all" ? "all" : "today")}>
              <TabsList>
                <TabsTrigger value="today">Hôm nay</TabsTrigger>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Thêm
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {shown.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-10 text-center">
              <div className="text-sm font-semibold">Không có lịch hẹn</div>
              <div className="text-sm text-muted-foreground">
                Lịch hẹn trong phạm vi bạn chọn đang trống.
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {shown.map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:justify-between",
                    a.date === "Hôm nay" && "border-primary/30 bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold">{a.patientName}</div>
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", statusTone(a.status))}>
                          {a.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {a.doctorName} • {a.department}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{a.date} • {a.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="outline">{a.department}</Badge>
                    {a.status === "Đã xác nhận" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 border-sky-200 bg-sky-50 px-2 text-xs text-sky-700 hover:bg-sky-100"
                        onClick={() => handleCheckin(a.id)}
                        disabled={checkingIn === a.id}
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        {checkingIn === a.id ? "..." : "Check-in"}
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(a)}>
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Sửa</span>
                    </Button>
                    {deleteId === a.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleDelete(a.id)}
                          disabled={deleteLoading}
                        >
                          {deleteLoading ? "..." : "Xác nhận"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-2 text-xs"
                          onClick={() => setDeleteId(null)}
                          disabled={deleteLoading}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(a.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
