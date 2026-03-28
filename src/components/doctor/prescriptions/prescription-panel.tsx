"use client";

import * as React from "react";
import { Search, Plus, Trash2, Printer, CheckCircle, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Prescription {
  id: string;
  patientName: string;
  patientCode: string;
  date: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  status: "Đã cấp phát" | "Chờ cấp phát" | "Bị từ chối";
  note?: string;
}

const PRESCRIPTIONS: Prescription[] = [
  {
    id: "1",
    patientName: "Nguyễn Văn An",
    patientCode: "BN-1024",
    date: "28/03/2026",
    medications: [
      { name: "Amlodipine 5mg", dosage: "1 viên", frequency: "Sáng", duration: "30 ngày" },
      { name: "Losartan 50mg", dosage: "1 viên", frequency: "Tối", duration: "30 ngày" },
    ],
    status: "Đã cấp phát",
  },
  {
    id: "2",
    patientName: "Phạm Thị Bình",
    patientCode: "BN-0891",
    date: "28/03/2026",
    medications: [
      { name: "Metformin 500mg", dosage: "1 viên", frequency: "Sáng & Tối (sau ăn)", duration: "30 ngày" },
    ],
    status: "Đã cấp phát",
  },
  {
    id: "3",
    patientName: "Bùi Văn Nam",
    patientCode: "BN-0612",
    date: "27/03/2026",
    medications: [
      { name: "Salbutamol MDI 100mcg", dosage: "2 nhát", frequency: "Khi khó thở", duration: "30 ngày" },
      { name: "Tiotropium 18mcg", dosage: "1 nhát", frequency: "Sáng", duration: "30 ngày" },
      { name: "Prednisolone 5mg", dosage: "2 viên", frequency: "Sáng (sau ăn)", duration: "7 ngày" },
    ],
    status: "Chờ cấp phát",
  },
  {
    id: "4",
    patientName: "Trịnh Thị Mai",
    patientCode: "BN-0942",
    date: "28/03/2026",
    medications: [
      { name: "Metformin 1000mg", dosage: "1 viên", frequency: "Sáng & Tối (sau ăn)", duration: "30 ngày" },
      { name: "Glipizide 5mg", dosage: "1 viên", frequency: "Trước bữa sáng 30 phút", duration: "30 ngày" },
    ],
    status: "Chờ cấp phát",
    note: "Tăng liều do HbA1c 7.2% – theo dõi hạ đường huyết",
  },
];

function statusStyle(status: Prescription["status"]) {
  if (status === "Đã cấp phát") return "bg-secondary/10 text-secondary";
  if (status === "Bị từ chối") return "bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

function statusIcon(status: Prescription["status"]) {
  if (status === "Đã cấp phát") return <CheckCircle className="h-3 w-3" />;
  if (status === "Bị từ chối") return <AlertCircle className="h-3 w-3" />;
  return null;
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

export function PrescriptionPanel() {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Prescription | null>(PRESCRIPTIONS[2]);

  const filtered = PRESCRIPTIONS.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Prescription list */}
      <div className="lg:col-span-2 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm đơn thuốc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>

        <div className="grid gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors hover:bg-accent/50",
                selected?.id === p.id && "border-primary/40 bg-primary/5",
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs">{getInitials(p.patientName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{p.patientName}</span>
                    <span className={cn("flex items-center gap-1 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", statusStyle(p.status))}>
                      {statusIcon(p.status)}
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.date} · {p.medications.length} loại thuốc
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail / New prescription form */}
      <div className="lg:col-span-3">
        {selected ? (
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(selected.patientName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selected.patientName}</CardTitle>
                    <div className="text-xs text-muted-foreground">{selected.patientCode} · {selected.date}</div>
                  </div>
                </div>
                <Badge
                  className={cn("text-xs", statusStyle(selected.status))}
                  variant="outline"
                >
                  {selected.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected.note && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-200">{selected.note}</div>
                </div>
              )}

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Danh sách thuốc ({selected.medications.length})
                </div>
                <div className="grid gap-3">
                  {selected.medications.map((med, i) => (
                    <div key={i} className="rounded-2xl border bg-card p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold">{med.name}</div>
                          <div className="mt-1 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                            <div>
                              <span className="block font-medium text-foreground">Liều</span>
                              {med.dosage}
                            </div>
                            <div>
                              <span className="block font-medium text-foreground">Tần suất</span>
                              {med.frequency}
                            </div>
                            <div>
                              <span className="block font-medium text-foreground">Thời gian</span>
                              {med.duration}
                            </div>
                          </div>
                        </div>
                        {selected.status !== "Đã cấp phát" && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selected.status !== "Đã cấp phát" && (
                <Button variant="outline" className="w-full gap-2" size="sm">
                  <Plus className="h-4 w-4" />
                  Thêm thuốc
                </Button>
              )}

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" disabled={selected.status === "Đã cấp phát"}>
                  {selected.status === "Đã cấp phát" ? "Đã gửi đến dược" : "Xác nhận & Gửi đến dược"}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  In đơn
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
