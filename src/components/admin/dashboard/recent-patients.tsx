import { ArrowUpRight } from "lucide-react";

import type { Patient } from "@/lib/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

function statusVariant(status: Patient["status"]) {
  if (status === "Đang điều trị") return "secondary";
  if (status === "Theo dõi") return "default";
  return "muted";
}

export function RecentPatients({ patients }: { patients: Patient[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Bệnh nhân gần đây</CardTitle>
        <Button variant="ghost" className="gap-2">
          Xem thêm <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bệnh nhân</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Lần khám</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => {
              const initials = p.name
                .split(" ")
                .slice(-2)
                .map((s) => s[0])
                .join("")
                .toUpperCase();
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={p.avatarUrl} alt={p.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{p.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.code} • {p.gender}, {p.age} tuổi
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
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

