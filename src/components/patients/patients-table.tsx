"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import type { Patient, PatientStatus } from "@/lib/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function statusVariant(status: PatientStatus) {
  if (status === "Đang điều trị") return "secondary";
  if (status === "Theo dõi") return "default";
  if (status === "Xuất viện") return "muted";
  return "outline";
}

const columns: ColumnDef<Patient>[] = [
  {
    header: "Bệnh nhân",
    accessorKey: "name",
    cell: ({ row }) => {
      const p = row.original;
      const initials = p.name
        .split(" ")
        .slice(-2)
        .map((s) => s[0])
        .join("")
        .toUpperCase();
      return (
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
      );
    },
  },
  {
    header: "Liên hệ",
    accessorKey: "phone",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">{row.original.phone}</div>
    ),
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    header: "Lần khám gần nhất",
    accessorKey: "lastVisit",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.lastVisit}
      </div>
    ),
  },
];

export function PatientsTable({ data }: { data: Patient[] }) {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | PatientStatus>("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((p) => {
      const byStatus = status === "all" ? true : p.status === status;
      const byQuery =
        q.length === 0
          ? true
          : [p.name, p.code, p.phone].some((v) => v.toLowerCase().includes(q));
      return byStatus && byQuery;
    });
  }, [data, query, status]);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const counts = React.useMemo(() => {
    const by = {
      all: data.length,
      "Đang điều trị": data.filter((p) => p.status === "Đang điều trị").length,
      "Theo dõi": data.filter((p) => p.status === "Theo dõi").length,
      "Xuất viện": data.filter((p) => p.status === "Xuất viện").length,
    };
    return by;
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Danh sách bệnh nhân</CardTitle>
          <div className="mt-1 text-sm text-muted-foreground">
            Tìm kiếm và lọc nhanh theo trạng thái, mã bệnh nhân hoặc số điện
            thoại.
          </div>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, mã, SĐT..."
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={status}
            onValueChange={(v) => {
              if (
                v === "Đang điều trị" ||
                v === "Theo dõi" ||
                v === "Xuất viện"
              ) {
                setStatus(v);
              } else {
                setStatus("all");
              }
            }}
          >
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
              <TabsTrigger value="Đang điều trị">
                Đang điều trị ({counts["Đang điều trị"]})
              </TabsTrigger>
              <TabsTrigger value="Theo dõi">
                Theo dõi ({counts["Theo dõi"]})
              </TabsTrigger>
              <TabsTrigger value="Xuất viện">
                Xuất viện ({counts["Xuất viện"]})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="default">Thêm bệnh nhân</Button>
        </div>

        <div className="mt-4 rounded-2xl border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-10 text-center">
              <div className="text-sm font-semibold">
                Không tìm thấy kết quả
              </div>
              <div className="text-sm text-muted-foreground">
                Hãy thử thay đổi từ khóa hoặc bộ lọc để xem dữ liệu phù hợp.
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
