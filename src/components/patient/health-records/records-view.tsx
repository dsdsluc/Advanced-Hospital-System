"use client";
import { useEffect, useState } from "react";
import { ClipboardList, Stethoscope, Calendar, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePatient } from "@/lib/patient-context";

interface HealthRecord {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  doctorSpecialization: string;
  department: string;
  status: string;
  diagnosis: string;
  notes: string;
}

function statusBadgeStyle(status: string): string {
  switch (status) {
    case "Đã xác nhận":
      return "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
    case "Hoàn tất":
      return "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300";
    case "Hủy":
      return "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300";
    default:
      return "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300";
  }
}

export function RecordsView() {
  const { patientId } = usePatient();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/patient/health-records?patientId=${patientId}`)
      .then((r) => r.json())
      .then((data: HealthRecord[]) => {
        const list = Array.isArray(data) ? data : [];
        setRecords(list);
        if (list.length > 0) setSelectedRecord(list[0]);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!patientId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        Vui lòng đăng nhập để xem hồ sơ sức khỏe.
      </div>
    );
  }

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.doctorName.toLowerCase().includes(q) ||
      r.diagnosis.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Hồ sơ sức khỏe
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lịch sử khám bệnh và kết quả chẩn đoán của bạn.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-white/70 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="mb-1 h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 dark:bg-blue-950/40">
            <ClipboardList className="h-8 w-8 text-blue-400" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Chưa có hồ sơ khám nào.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left panel — list */}
          <div className="space-y-3 lg:col-span-1">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm bác sĩ hoặc chẩn đoán..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-white/40 bg-white/60 pl-9 backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/60"
              />
            </div>

            {/* Count header */}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Hồ sơ khám ({filtered.length})
            </p>

            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Không tìm thấy hồ sơ nào.
              </p>
            ) : (
              filtered.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRecord(r)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-all hover:shadow-sm",
                    selectedRecord?.id === r.id
                      ? "border-blue-300 bg-gradient-to-br from-blue-50 to-teal-50/60 shadow-sm dark:border-blue-700/60 dark:from-blue-950/40 dark:to-teal-950/20"
                      : "border-white/70 bg-white/70 backdrop-blur-sm hover:border-blue-200 dark:border-white/10 dark:bg-slate-900/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {r.date}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 text-xs", statusBadgeStyle(r.status))}
                    >
                      {r.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{r.doctorName}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {r.diagnosis
                      ? r.diagnosis.length > 60
                        ? r.diagnosis.slice(0, 60) + "..."
                        : r.diagnosis
                      : "Không có chẩn đoán"}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Right panel — detail */}
          <div className="lg:col-span-2">
            {!selectedRecord ? (
              <Card className="flex min-h-[320px] items-center justify-center border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-3xl bg-blue-50 dark:bg-blue-950/40">
                    <ClipboardList className="h-7 w-7 text-blue-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Chọn hồ sơ để xem chi tiết
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {selectedRecord.date} · {selectedRecord.time}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 text-xs", statusBadgeStyle(selectedRecord.status))}
                    >
                      {selectedRecord.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <Separator className="bg-blue-50 dark:bg-slate-800" />

                  {/* Doctor card */}
                  <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-gradient-to-br from-blue-50 to-teal-50/60 p-4 dark:border-white/10 dark:from-blue-950/30 dark:to-teal-950/20">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 text-white shadow-sm">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {selectedRecord.doctorName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRecord.doctorSpecialization} · {selectedRecord.department}
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  {selectedRecord.diagnosis ? (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/40 dark:bg-blue-950/30">
                      <p className="mb-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                        Chẩn đoán
                      </p>
                      <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
                        {selectedRecord.diagnosis}
                      </p>
                    </div>
                  ) : null}

                  {/* Notes */}
                  {selectedRecord.notes ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700/40 dark:bg-slate-800/40">
                      <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Ghi chú bác sĩ
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {selectedRecord.notes}
                      </p>
                    </div>
                  ) : null}

                  {/* Empty state */}
                  {!selectedRecord.diagnosis && !selectedRecord.notes && (
                    <p className="text-sm italic text-muted-foreground">
                      Chưa có thông tin chẩn đoán.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
