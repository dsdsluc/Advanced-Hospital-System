"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDoctor } from "@/lib/doctor-context";

interface Patient {
  id: string;
  name: string;
  code: string;
  age: number;
  gender: "Nam" | "Nữ";
  status: "Đang điều trị" | "Theo dõi" | "Xuất viện";
  lastVisit: string;
  avatarUrl: string;
}

function statusVariant(
  status: Patient["status"],
): "secondary" | "default" | "muted" {
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

function PatientRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
    </TableRow>
  );
}

export function MyPatients() {
  const { doctorId } = useDoctor();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) {
      setPatients([]);
      return;
    }

    setLoading(true);
    fetch(`/api/doctor/patients?doctorId=${doctorId}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => setPatients(data.slice(0, 5)))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [doctorId]);

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
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Khám gần nhất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <PatientRowSkeleton key={i} />
                ))}
              </>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-sm text-muted-foreground py-4"
                >
                  {!doctorId
                    ? "Vui lòng chọn tài khoản bác sĩ"
                    : "Không có bệnh nhân"}
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer transition-colors hover:bg-accent/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {p.avatarUrl && <AvatarImage src={p.avatarUrl} />}
                        <AvatarFallback className="text-xs">
                          {getInitials(p.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {p.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.code} · {p.gender}, {p.age} tuổi
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {p.lastVisit}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
