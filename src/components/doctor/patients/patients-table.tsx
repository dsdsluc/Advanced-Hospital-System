"use client";

import { useEffect, useState } from "react";
import { Search, Phone, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

interface MedicalRecord {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialization: string;
  department: string;
  status: string;
  diagnosis: string;
  notes: string;
}

function statusStyle(status: string): "secondary" | "default" | "destructive" {
  if (status === "Đang điều trị") return "secondary";
  if (status === "Xuất viện") return "destructive";
  return "default";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

function recordStatusStyle(status: string) {
  if (status === "Hoàn tất") return "bg-green-100 text-green-800";
  if (status === "Hủy") return "bg-red-100 text-red-800";
  if (status === "Đã xác nhận") return "bg-blue-100 text-blue-800";
  return "bg-yellow-100 text-yellow-800";
}

export function PatientsTable() {
  const { doctorId } = useDoctor();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    loadPatients();
  }, [doctorId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadPatients() {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/patients?doctorId=${doctorId}`, {
        cache: "no-store",
      });
      const data: Patient[] = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDetails(patient: Patient) {
    setSelectedPatient(patient);
    setShowDetails(true);
    setRecordsLoading(true);

    try {
      const res = await fetch(
        `/api/doctor/patients/${patient.id}?doctorId=${doctorId}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      setMedicalRecords(data.medicalRecords ?? []);
    } catch (error) {
      console.error("Failed to load medical records:", error);
    } finally {
      setRecordsLoading(false);
    }
  }

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()),
  );

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
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-secondary">
                {patients.filter((p) => p.status === "Đang điều trị").length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Đang điều trị
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-primary">
                {patients.filter((p) => p.status === "Theo dõi").length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Đang theo dõi
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold">
                {patients.filter((p) => p.status === "Xuất viện").length}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Đã xuất viện
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">
              Danh sách bệnh nhân ({filtered.length})
            </CardTitle>
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9 text-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2">
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-60" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {search ? "Không tìm thấy bệnh nhân" : "Chưa có bệnh nhân"}
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
                    <AvatarFallback className="text-sm">
                      {getInitials(p.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-1">
                    <div className="sm:col-span-1">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.code} · {p.gender}, {p.age} tuổi
                      </div>
                    </div>

                    <div className="hidden sm:block sm:col-span-1">
                      <div className="text-xs text-muted-foreground">Lần khám cuối</div>
                      <div className="text-sm">{p.lastVisit}</div>
                    </div>

                    <div className="hidden sm:block sm:col-span-1">
                      <div className="text-xs text-muted-foreground">Tổng lần khám</div>
                      <div className="text-sm">{p.totalAppointments}</div>
                    </div>

                    <div className="hidden sm:flex sm:col-span-1">
                      <Badge variant={statusStyle(p.status)}>{p.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog
        open={showDetails}
        onOpenChange={(open) => {
          if (!open) {
            setShowDetails(false);
            setSelectedPatient(null);
            setMedicalRecords([]);
          }
        }}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Hồ sơ bệnh nhân</DialogTitle>
            <DialogDescription>
              {selectedPatient?.name} ({selectedPatient?.code})
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-4">
              {/* Header section: Avatar + summary */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar className="h-16 w-16 shrink-0">
                  {selectedPatient.avatarUrl && (
                    <AvatarImage src={selectedPatient.avatarUrl} />
                  )}
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-base">{selectedPatient.name}</span>
                    <span className="text-sm text-muted-foreground">{selectedPatient.code}</span>
                    <Badge variant={statusStyle(selectedPatient.status)}>
                      {selectedPatient.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>{selectedPatient.phone}</span>
                    <span>Lần khám cuối: {selectedPatient.lastVisit}</span>
                    <span>Tổng {selectedPatient.totalAppointments} lần khám</span>
                  </div>
                </div>
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left column: Patient info */}
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Thông tin bệnh nhân</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      {[
                        { label: "Họ và tên", value: selectedPatient.name },
                        { label: "Mã bệnh nhân", value: selectedPatient.code },
                        {
                          label: "Giới tính / Tuổi",
                          value: `${selectedPatient.gender}, ${selectedPatient.age} tuổi`,
                        },
                        { label: "Điện thoại", value: selectedPatient.phone },
                        {
                          label: "Trạng thái",
                          value: (
                            <Badge variant={statusStyle(selectedPatient.status)}>
                              {selectedPatient.status}
                            </Badge>
                          ),
                        },
                        { label: "Lần khám gần nhất", value: selectedPatient.lastVisit },
                        {
                          label: "Tổng lần khám",
                          value: String(selectedPatient.totalAppointments),
                        },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                          <div className="font-medium text-sm mt-0.5">
                            {typeof item.value === "string" ? item.value : item.value}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right column: Medical records */}
                <div className="md:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Hồ sơ y tế ({medicalRecords.length} lần khám)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {recordsLoading ? (
                        <div className="space-y-3">
                          {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="h-24" />
                          ))}
                        </div>
                      ) : medicalRecords.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-8 text-center border rounded">
                          Chưa có hồ sơ khám
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          {medicalRecords.map((record, idx) => (
                            <div key={record.id} className="relative pl-4">
                              {/* Timeline line */}
                              {idx < medicalRecords.length - 1 && (
                                <div className="absolute left-1.5 top-6 bottom-0 w-px bg-border" />
                              )}
                              {/* Timeline dot */}
                              <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />

                              <div className="rounded-lg border p-3 space-y-2">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="font-semibold text-sm">
                                      {record.date} {record.time && `• ${record.time}`}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-muted-foreground">
                                        {record.doctor}
                                      </span>
                                      {record.specialization && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs px-1.5 py-0"
                                        >
                                          {record.specialization}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Badge
                                    className={cn(
                                      "text-xs shrink-0",
                                      recordStatusStyle(record.status),
                                    )}
                                  >
                                    {record.status}
                                  </Badge>
                                </div>

                                {/* Diagnosis highlighted box */}
                                {record.diagnosis && (
                                  <div className="rounded border border-blue-200 bg-blue-50 px-3 py-2">
                                    <div className="text-xs font-medium text-blue-700 mb-0.5">
                                      Chẩn đoán
                                    </div>
                                    <div className="text-sm text-blue-900">
                                      {record.diagnosis}
                                    </div>
                                  </div>
                                )}

                                {/* Notes truncated */}
                                {record.notes && (
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                      Ghi chú:{" "}
                                    </span>
                                    {record.notes.length > 150
                                      ? `${record.notes.substring(0, 150)}...`
                                      : record.notes}
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
            <Button onClick={() => setShowDetails(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
