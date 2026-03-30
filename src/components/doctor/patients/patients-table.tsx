"use client";

import { useEffect, useState } from "react";
import { Search, Phone, ChevronRight, Check, ClipboardList } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface Prescription {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface MedicalRecord {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  department: string;
  status: string;
  diagnosis: string;
  chiefComplaint: string;
  treatmentPlan: string;
  notes: string;
  prescriptions: Prescription[];
}

interface Patient {
  id: string;
  name: string;
  code: string;
  age: number;
  gender: string;
  phone: string;
  avatarUrl: string;
  status: string;
  totalAppointments: number;
  lastVisit: string;
}

type StatusFilter = "all" | "Đang điều trị" | "Theo dõi" | "Xuất viện";

function statusVariant(status: string): "secondary" | "default" | "destructive" {
  if (status === "Đang điều trị") return "secondary";
  if (status === "Xuất viện") return "destructive";
  return "default";
}

function recordStatusStyle(status: string) {
  if (status === "Hoàn tất") return "bg-green-100 text-green-700";
  if (status === "Hủy") return "bg-red-100 text-red-700";
  if (status === "Đã xác nhận") return "bg-blue-100 text-blue-700";
  if (status === "Đã check-in") return "bg-sky-100 text-sky-700";
  if (status === "Đang khám") return "bg-violet-100 text-violet-700";
  return "bg-yellow-100 text-yellow-700";
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

function CopyPhone({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(phone).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button
      onClick={handleCopy}
      title={copied ? "Đã sao chép!" : `Sao chép: ${phone}`}
      className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent"
    >
      {copied
        ? <Check className="h-4 w-4 text-green-500" />
        : <Phone className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}

export function PatientsTable() {
  const { doctorId } = useDoctor();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    loadPatients();
  }, [doctorId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadPatients() {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/patients?doctorId=${doctorId}`, { cache: "no-store" });
      if (res.ok) setPatients(await res.json());
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!selectedPatient) return;
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/doctor/patients/${selectedPatient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = selectedPatient ? { ...selectedPatient, status: newStatus } : null;
        setSelectedPatient(updated);
        setPatients((prev) => prev.map((p) => p.id === selectedPatient.id ? { ...p, status: newStatus } : p));
      }
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleViewDetails(patient: Patient) {
    setSelectedPatient(patient);
    setMedicalRecords([]);
    setShowDetails(true);
    setRecordsLoading(true);
    try {
      const res = await fetch(`/api/doctor/patients/${patient.id}?doctorId=${doctorId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMedicalRecords(data.medicalRecords ?? []);
      }
    } catch (err) {
      console.error("Failed to load medical records:", err);
    } finally {
      setRecordsLoading(false);
    }
  }

  const filtered = patients.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchQuery = !q || [p.name, p.code, p.phone].some((v) => v.toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const counts = {
    all: patients.length,
    "Đang điều trị": patients.filter((p) => p.status === "Đang điều trị").length,
    "Theo dõi": patients.filter((p) => p.status === "Theo dõi").length,
    "Xuất viện": patients.filter((p) => p.status === "Xuất viện").length,
  };

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Vui lòng đăng nhập để xem danh sách bệnh nhân
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)
        ) : (
          <>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-secondary">{counts["Đang điều trị"]}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Đang điều trị</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold text-primary">{counts["Theo dõi"]}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Đang theo dõi</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-semibold">{counts["Xuất viện"]}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Đã xuất viện</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">
              Danh sách bệnh nhân ({filtered.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tên, mã, SĐT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 text-sm"
              />
            </div>
          </div>

          {/* Status filter tabs */}
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
              <TabsTrigger value="Đang điều trị">Điều trị ({counts["Đang điều trị"]})</TabsTrigger>
              <TabsTrigger value="Theo dõi">Theo dõi ({counts["Theo dõi"]})</TabsTrigger>
              <TabsTrigger value="Xuất viện">Xuất viện ({counts["Xuất viện"]})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid gap-2">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {search ? "Không tìm thấy bệnh nhân phù hợp" : "Chưa có bệnh nhân"}
              </div>
            ) : (
              filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleViewDetails(p)}
                  className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-accent/50 cursor-pointer"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    {p.avatarUrl && <AvatarImage src={p.avatarUrl} />}
                    <AvatarFallback className="text-sm">{getInitials(p.name)}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-0.5">
                    <div className="sm:col-span-1">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.code} · {p.gender}, {p.age} tuổi</div>
                    </div>
                    <div className="hidden sm:block sm:col-span-1">
                      <div className="text-xs text-muted-foreground">Lần khám cuối</div>
                      <div className="text-sm">{p.lastVisit}</div>
                    </div>
                    <div className="hidden sm:block sm:col-span-1">
                      <div className="text-xs text-muted-foreground">Tổng lần khám</div>
                      <div className="text-sm font-medium">{p.totalAppointments}</div>
                    </div>
                    <div className="hidden sm:flex sm:col-span-1 items-center">
                      <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <CopyPhone phone={p.phone} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={showDetails} onOpenChange={(open) => {
        if (!open) { setShowDetails(false); setSelectedPatient(null); setMedicalRecords([]); }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hồ sơ bệnh nhân</DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                <Avatar className="h-14 w-14 shrink-0">
                  {selectedPatient.avatarUrl && <AvatarImage src={selectedPatient.avatarUrl} />}
                  <AvatarFallback className="text-lg">{getInitials(selectedPatient.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-base">{selectedPatient.name}</span>
                    <span className="text-sm text-muted-foreground">{selectedPatient.code}</span>
                    <Badge variant={statusVariant(selectedPatient.status)}>{selectedPatient.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>{selectedPatient.gender}, {selectedPatient.age} tuổi</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedPatient.phone}
                    </span>
                    <span>Khám gần nhất: {selectedPatient.lastVisit}</span>
                    <span>{selectedPatient.totalAppointments} lần khám</span>
                  </div>
                </div>
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left: Patient info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Thông tin bệnh nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {[
                      { label: "Họ và tên", value: selectedPatient.name },
                      { label: "Mã bệnh nhân", value: selectedPatient.code },
                      { label: "Giới tính / Tuổi", value: `${selectedPatient.gender}, ${selectedPatient.age} tuổi` },
                      { label: "Điện thoại", value: selectedPatient.phone },
                      { label: "Lần khám gần nhất", value: selectedPatient.lastVisit },
                      { label: "Tổng lần khám", value: `${selectedPatient.totalAppointments} lần` },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-sm font-medium mt-0.5">{item.value}</div>
                      </div>
                    ))}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5">Trạng thái</div>
                      <div className="flex flex-col gap-1.5">
                        {(["Đang điều trị", "Theo dõi", "Xuất viện"] as const).map((s) => (
                          <button
                            key={s}
                            disabled={statusSaving}
                            onClick={() => handleStatusChange(s)}
                            className={cn(
                              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-left transition-colors",
                              selectedPatient.status === s
                                ? s === "Đang điều trị"
                                  ? "border-green-300 bg-green-50 text-green-800 font-medium"
                                  : s === "Theo dõi"
                                  ? "border-blue-300 bg-blue-50 text-blue-800 font-medium"
                                  : "border-gray-300 bg-gray-100 text-gray-700 font-medium"
                                : "border-dashed text-muted-foreground hover:border-solid hover:bg-accent"
                            )}
                          >
                            <span className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              s === "Đang điều trị" ? "bg-green-500" : s === "Theo dõi" ? "bg-blue-500" : "bg-gray-400"
                            )} />
                            {s}
                            {selectedPatient.status === s && (
                              <Check className="ml-auto h-3.5 w-3.5" />
                            )}
                          </button>
                        ))}
                        {statusSaving && <p className="text-xs text-muted-foreground">Đang lưu...</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right: Medical history */}
                <div className="md:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Lịch sử khám ({medicalRecords.length} lần)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {recordsLoading ? (
                        <div className="space-y-3">
                          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28" />)}
                        </div>
                      ) : medicalRecords.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                          <ClipboardList className="h-8 w-8 opacity-30" />
                          Chưa có hồ sơ khám
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                          {medicalRecords.map((record, idx) => (
                            <div key={record.id} className="relative pl-5">
                              {idx < medicalRecords.length - 1 && (
                                <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />
                              )}
                              <div className="absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-primary bg-background" />

                              <div className="rounded-xl border p-3 space-y-2">
                                {/* Row 1: date + status */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="font-semibold text-sm">
                                      {record.date}{record.time && ` · ${record.time}`}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-muted-foreground">{record.department}</span>
                                    </div>
                                  </div>
                                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", recordStatusStyle(record.status))}>
                                    {record.status}
                                  </span>
                                </div>

                                {/* Chief complaint */}
                                {record.chiefComplaint && (
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">Lý do khám: </span>
                                    {record.chiefComplaint}
                                  </div>
                                )}

                                {/* Diagnosis */}
                                {record.diagnosis && (
                                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                                    <div className="text-xs font-medium text-blue-700 mb-0.5">Chẩn đoán</div>
                                    <div className="text-sm text-blue-900">{record.diagnosis}</div>
                                  </div>
                                )}

                                {/* Treatment plan */}
                                {record.treatmentPlan && (
                                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <div className="text-xs font-medium text-slate-600 mb-0.5">Hướng điều trị</div>
                                    <div className="text-sm text-slate-800 line-clamp-2">{record.treatmentPlan}</div>
                                  </div>
                                )}

                                {/* Prescriptions count */}
                                {record.prescriptions.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {record.prescriptions.map((rx) => (
                                      <span key={rx.id} className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs text-teal-700">
                                        💊 {rx.medicineName} · {rx.dosage}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
