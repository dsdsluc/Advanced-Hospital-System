"use client";

import * as React from "react";
import { Search, FileText, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MedicalRecord {
  id: string;
  patientName: string;
  patientCode: string;
  date: string;
  type: "Nội trú" | "Ngoại trú" | "Cấp cứu";
  diagnosis: string;
  icd10: string;
  treatment: string;
  status: "Hoàn chỉnh" | "Cần bổ sung" | "Nháp";
  medications: string[];
}

const RECORDS: MedicalRecord[] = [
  {
    id: "1",
    patientName: "Nguyễn Văn An",
    patientCode: "BN-1024",
    date: "28/03/2026",
    type: "Ngoại trú",
    diagnosis: "Tăng huyết áp giai đoạn 2",
    icd10: "I10",
    treatment: "Tiếp tục Amlodipine 5mg, kiểm tra lại sau 1 tháng",
    status: "Hoàn chỉnh",
    medications: ["Amlodipine 5mg", "Losartan 50mg"],
  },
  {
    id: "2",
    patientName: "Phạm Thị Bình",
    patientCode: "BN-0891",
    date: "28/03/2026",
    type: "Ngoại trú",
    diagnosis: "Đái tháo đường type 2, kiểm soát tốt",
    icd10: "E11",
    treatment: "Metformin 500mg × 2/ngày, ăn uống đúng chế độ",
    status: "Hoàn chỉnh",
    medications: ["Metformin 500mg"],
  },
  {
    id: "3",
    patientName: "Lê Văn Cường",
    patientCode: "BN-1156",
    date: "28/03/2026",
    type: "Ngoại trú",
    diagnosis: "Suy tim độ II theo NYHA",
    icd10: "I50.0",
    treatment: "Đang khám, chờ kết quả siêu âm tim",
    status: "Nháp",
    medications: ["Furosemide 40mg", "Carvedilol 6.25mg"],
  },
  {
    id: "4",
    patientName: "Bùi Văn Nam",
    patientCode: "BN-0612",
    date: "27/03/2026",
    type: "Nội trú",
    diagnosis: "COPD đợt cấp",
    icd10: "J44.1",
    treatment: "Kháng sinh, khí dung, vật lý trị liệu hô hấp",
    status: "Cần bổ sung",
    medications: ["Salbutamol MDI", "Ipratropium MDI", "Amoxicillin 500mg"],
  },
  {
    id: "5",
    patientName: "Trịnh Thị Mai",
    patientCode: "BN-0942",
    date: "28/03/2026",
    type: "Ngoại trú",
    diagnosis: "Đái tháo đường type 2 – HbA1c 7.2%",
    icd10: "E11",
    treatment: "Tăng liều Metformin lên 1000mg, thêm Glipizide",
    status: "Cần bổ sung",
    medications: ["Metformin 1000mg", "Glipizide 5mg"],
  },
  {
    id: "6",
    patientName: "Vũ Thị Lan",
    patientCode: "BN-0633",
    date: "15/03/2026",
    type: "Ngoại trú",
    diagnosis: "Viêm loét dạ dày, H. pylori (+)",
    icd10: "K25",
    treatment: "Phác đồ diệt H. pylori 14 ngày",
    status: "Hoàn chỉnh",
    medications: ["Omeprazole 20mg", "Clarithromycin 500mg", "Amoxicillin 1g"],
  },
];

function statusVariant(status: MedicalRecord["status"]): "secondary" | "destructive" | "outline" {
  if (status === "Hoàn chỉnh") return "secondary";
  if (status === "Cần bổ sung") return "destructive";
  return "outline";
}

function typeStyle(type: MedicalRecord["type"]) {
  if (type === "Nội trú") return "bg-primary/10 text-primary";
  if (type === "Cấp cứu") return "bg-destructive/10 text-destructive";
  return "bg-muted text-muted-foreground";
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

export function RecordsList() {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<MedicalRecord | null>(RECORDS[0]);

  const filtered = RECORDS.filter(
    (r) =>
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.patientCode.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* List panel */}
      <div className="lg:col-span-2 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm hồ sơ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>

        <div className="grid gap-2">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={cn(
                "group w-full rounded-2xl border p-4 text-left transition-colors hover:bg-accent/50",
                selected?.id === r.id && "border-primary/40 bg-primary/5",
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-xs">{getInitials(r.patientName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{r.patientName}</span>
                    <Badge variant={statusVariant(r.status)} className="shrink-0 text-xs">
                      {r.status === "Cần bổ sung" ? (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      ) : null}
                      {r.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{r.date} · {r.type}</div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">{r.diagnosis}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="lg:col-span-3">
        {selected ? (
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback>{getInitials(selected.patientName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{selected.patientName}</CardTitle>
                    <div className="text-xs text-muted-foreground">{selected.patientCode} · {selected.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", typeStyle(selected.type))}>
                    {selected.type}
                  </span>
                  <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border bg-card p-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Chẩn đoán</div>
                  <div className="text-sm font-medium">{selected.diagnosis}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">ICD-10: {selected.icd10}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Hướng điều trị</div>
                  <div className="text-sm">{selected.treatment}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Thuốc đã kê</div>
                <div className="flex flex-wrap gap-2">
                  {selected.medications.map((med) => (
                    <span key={med} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary font-medium">
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 gap-2">
                  <FileText className="h-4 w-4" />
                  Chỉnh sửa hồ sơ
                </Button>
                <Button variant="outline">In hồ sơ</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed">
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto h-8 w-8 mb-2" />
              <div className="text-sm">Chọn một hồ sơ để xem chi tiết</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
