"use client";

import * as React from "react";
import { Search, SlidersHorizontal, ChevronRight, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  code: string;
  age: number;
  gender: "Nam" | "Nữ";
  phone: string;
  diagnosis: string;
  status: "Đang điều trị" | "Theo dõi" | "Xuất viện";
  lastVisit: string;
  nextVisit: string;
  allergies: string[];
}

const PATIENTS: Patient[] = [
  {
    id: "1", name: "Nguyễn Văn An", code: "BN-1024", age: 45, gender: "Nam",
    phone: "0901 234 567", diagnosis: "Tăng huyết áp giai đoạn 2",
    status: "Đang điều trị", lastVisit: "28/03/2026", nextVisit: "28/04/2026",
    allergies: ["Penicillin"],
  },
  {
    id: "2", name: "Phạm Thị Bình", code: "BN-0891", age: 32, gender: "Nữ",
    phone: "0912 345 678", diagnosis: "Tiểu đường type 2",
    status: "Theo dõi", lastVisit: "28/03/2026", nextVisit: "14/04/2026",
    allergies: [],
  },
  {
    id: "3", name: "Lê Văn Cường", code: "BN-1156", age: 58, gender: "Nam",
    phone: "0923 456 789", diagnosis: "Suy tim độ II",
    status: "Đang điều trị", lastVisit: "28/03/2026", nextVisit: "07/04/2026",
    allergies: ["Aspirin", "NSAIDs"],
  },
  {
    id: "4", name: "Hoàng Thị Dung", code: "BN-1302", age: 27, gender: "Nữ",
    phone: "0934 567 890", diagnosis: "Viêm khớp dạng thấp",
    status: "Theo dõi", lastVisit: "28/03/2026", nextVisit: "11/04/2026",
    allergies: [],
  },
  {
    id: "5", name: "Đỗ Minh Khoa", code: "BN-0774", age: 41, gender: "Nam",
    phone: "0945 678 901", diagnosis: "Hen phế quản mức độ trung bình",
    status: "Theo dõi", lastVisit: "28/03/2026", nextVisit: "25/04/2026",
    allergies: ["Aspirin"],
  },
  {
    id: "6", name: "Vũ Thị Lan", code: "BN-0633", age: 55, gender: "Nữ",
    phone: "0956 789 012", diagnosis: "Viêm loét dạ dày mạn tính",
    status: "Đang điều trị", lastVisit: "15/03/2026", nextVisit: "15/04/2026",
    allergies: [],
  },
  {
    id: "7", name: "Ngô Văn Hùng", code: "BN-1088", age: 38, gender: "Nam",
    phone: "0967 890 123", diagnosis: "Viêm loét dạ dày tá tràng",
    status: "Theo dõi", lastVisit: "28/03/2026", nextVisit: "28/04/2026",
    allergies: [],
  },
  {
    id: "8", name: "Trịnh Thị Mai", code: "BN-0942", age: 50, gender: "Nữ",
    phone: "0978 901 234", diagnosis: "Đái tháo đường type 2",
    status: "Theo dõi", lastVisit: "28/03/2026", nextVisit: "28/06/2026",
    allergies: [],
  },
  {
    id: "9", name: "Bùi Văn Nam", code: "BN-0612", age: 62, gender: "Nam",
    phone: "0989 012 345", diagnosis: "COPD giai đoạn 2",
    status: "Đang điều trị", lastVisit: "27/03/2026", nextVisit: "10/04/2026",
    allergies: ["Codeine"],
  },
  {
    id: "10", name: "Đinh Thị Oanh", code: "BN-1215", age: 35, gender: "Nữ",
    phone: "0990 123 456", diagnosis: "Dị ứng đường hô hấp",
    status: "Xuất viện", lastVisit: "20/03/2026", nextVisit: "—",
    allergies: ["Phấn hoa", "Bụi nhà"],
  },
];

function statusStyle(status: Patient["status"]): "secondary" | "default" | "outline" {
  if (status === "Đang điều trị") return "secondary";
  if (status === "Theo dõi") return "default";
  return "outline";
}

function getInitials(name: string) {
  return name.split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

export function PatientsTable() {
  const [search, setSearch] = React.useState("");

  const filtered = PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Đang điều trị", count: PATIENTS.filter(p => p.status === "Đang điều trị").length, color: "text-secondary" },
          { label: "Đang theo dõi", count: PATIENTS.filter(p => p.status === "Theo dõi").length, color: "text-primary" },
          { label: "Đã xuất viện", count: PATIENTS.filter(p => p.status === "Xuất viện").length, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <div className={cn("text-2xl font-semibold", s.color)}>{s.count}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Danh sách bệnh nhân ({PATIENTS.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9 text-sm"
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:bg-accent/50 cursor-pointer"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-sm">{getInitials(p.name)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-1">
                  <div className="sm:col-span-1">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.code} · {p.gender}, {p.age} tuổi</div>
                  </div>

                  <div className="sm:col-span-1">
                    <div className="text-xs text-muted-foreground">Chẩn đoán</div>
                    <div className="text-sm truncate">{p.diagnosis}</div>
                  </div>

                  <div className="hidden sm:block sm:col-span-1">
                    <div className="text-xs text-muted-foreground">Khám tiếp theo</div>
                    <div className="text-sm">{p.nextVisit}</div>
                  </div>

                  <div className="hidden sm:flex sm:col-span-1 items-center gap-2">
                    <Badge variant={statusStyle(p.status)}>{p.status}</Badge>
                    {p.allergies.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        DỊ ỨNG
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Không tìm thấy bệnh nhân phù hợp
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
