"use client";
import { useEffect, useState } from "react";
import { Info, Pill, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatient } from "@/lib/patient-context";

interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
  doctorName: string;
  visitDate: string;
  medicalRecordId: string;
}

export function PrescriptionsView() {
  const { patientId } = usePatient();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!patientId) { setLoading(false); return; }
    setLoading(true);
    fetch(`/api/patient/prescriptions?patientId=${patientId}`)
      .then((r) => r.json())
      .then((data: Prescription[]) => setPrescriptions(Array.isArray(data) ? data : []))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.medicineName.toLowerCase().includes(q) || p.doctorName.toLowerCase().includes(q);
  });

  // Group by medicalRecordId to show per-visit
  const grouped = filtered.reduce<Record<string, { visitDate: string; doctorName: string; items: Prescription[] }>>(
    (acc, p) => {
      if (!acc[p.medicalRecordId]) {
        acc[p.medicalRecordId] = { visitDate: p.visitDate, doctorName: p.doctorName, items: [] };
      }
      acc[p.medicalRecordId].items.push(p);
      return acc;
    },
    {},
  );

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Đơn thuốc của tôi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi các đơn thuốc được kê bởi bác sĩ.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-300">
        <Info className="h-4 w-4 shrink-0" />
        Danh sách đơn thuốc được cập nhật bởi bác sĩ điều trị của bạn.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-100 dark:bg-teal-950/40">
              <Pill className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{prescriptions.length}</div>
              <div className="text-xs text-muted-foreground">Tổng đơn thuốc</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 dark:bg-blue-950/40">
              <Pill className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {Object.keys(grouped).length}
              </div>
              <div className="text-xs text-muted-foreground">Lần khám có đơn thuốc</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm thuốc hoặc bác sĩ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-white/40 bg-white/60 pl-9 backdrop-blur-sm dark:border-white/10 dark:bg-slate-800/60"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border-white/70 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-teal-50 dark:bg-teal-950/40">
            <Pill className="h-8 w-8 text-teal-400" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {search ? "Không tìm thấy đơn thuốc nào." : "Chưa có đơn thuốc nào."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([recordId, group]) => (
            <Card
              key={recordId}
              className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60"
            >
              <CardContent className="p-4">
                {/* Visit header */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      Ngày khám: {group.visitDate}
                    </p>
                    <p className="text-xs text-muted-foreground">{group.doctorName}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-teal-200 bg-teal-50 text-xs text-teal-700 dark:border-teal-800/40 dark:bg-teal-950/30 dark:text-teal-300"
                  >
                    {group.items.length} loại thuốc
                  </Badge>
                </div>

                {/* Medicine rows */}
                <div className="space-y-2">
                  {group.items.map((rx) => (
                    <div
                      key={rx.id}
                      className="flex items-start gap-3 rounded-xl border border-white/60 bg-white/50 p-3 dark:border-white/10 dark:bg-slate-800/30"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal-100 dark:bg-teal-950/40">
                        <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{rx.medicineName}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {rx.dosage} · {rx.frequency} · {rx.duration}
                        </p>
                        {rx.notes && (
                          <p className="mt-0.5 text-xs italic text-muted-foreground">{rx.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
