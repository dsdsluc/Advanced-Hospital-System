import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Patient {
  id: string;
  name: string;
  code: string;
  age: number;
  gender: "Nam" | "Nữ";
  diagnosis: string;
  status: "Đang điều trị" | "Theo dõi" | "Xuất viện";
  lastVisit: string;
}

const MY_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    code: "BN-1024",
    age: 45,
    gender: "Nam",
    diagnosis: "Tăng huyết áp",
    status: "Đang điều trị",
    lastVisit: "Hôm nay",
  },
  {
    id: "2",
    name: "Phạm Thị Bình",
    code: "BN-0891",
    age: 32,
    gender: "Nữ",
    diagnosis: "Tiểu đường type 2",
    status: "Theo dõi",
    lastVisit: "Hôm nay",
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    code: "BN-1156",
    age: 58,
    gender: "Nam",
    diagnosis: "Suy tim độ II",
    status: "Đang điều trị",
    lastVisit: "Hôm nay",
  },
  {
    id: "4",
    name: "Hoàng Thị Dung",
    code: "BN-1302",
    age: 27,
    gender: "Nữ",
    diagnosis: "Viêm khớp dạng thấp",
    status: "Theo dõi",
    lastVisit: "Hôm nay",
  },
  {
    id: "5",
    name: "Bùi Văn Nam",
    code: "BN-0612",
    age: 62,
    gender: "Nam",
    diagnosis: "COPD giai đoạn 2",
    status: "Đang điều trị",
    lastVisit: "27/03/2026",
  },
  {
    id: "6",
    name: "Trịnh Thị Mai",
    code: "BN-0942",
    age: 50,
    gender: "Nữ",
    diagnosis: "Đái tháo đường type 2",
    status: "Theo dõi",
    lastVisit: "26/03/2026",
  },
];

function statusVariant(status: Patient["status"]): "secondary" | "default" | "muted" {
  if (status === "Đang điều trị") return "secondary";
  if (status === "Theo dõi") return "default";
  return "muted";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export function MyPatients() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Bệnh nhân gần đây</CardTitle>
        <Button variant="ghost" className="gap-1" asChild>
          <Link href="/doctor/patients">
            Xem tất cả <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Chẩn đoán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Khám gần nhất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MY_PATIENTS.map((p) => (
              <TableRow
                key={p.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(p.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {p.code} · {p.gender}, {p.age} tuổi
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.diagnosis}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {p.lastVisit}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
