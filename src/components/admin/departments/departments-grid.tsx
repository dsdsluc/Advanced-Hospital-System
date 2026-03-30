"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { Department } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepartmentDialog } from "./department-dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function DepartmentsGrid({ data: initial }: { data: Department[] }) {
  const [data, setData] = React.useState<Department[]>(initial);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Department | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  async function refresh() {
    try {
      const res = await fetch(`${API_URL}/admin/departments`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
  }

  function openCreate() { setEditing(null); setDialogOpen(true); }
  function openEdit(d: Department) { setEditing(d); setDialogOpen(true); }

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      await fetch(`${API_URL}/admin/departments/${id}`, { method: "DELETE" });
      setDeleteId(null);
      await refresh();
    } catch { /* silent */ } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={editing}
        onSuccess={refresh}
      />

      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khoa
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((d) => {
          const pct = Math.min(100, Math.round((d.occupied / d.capacity) * 100));
          const tone = pct >= 90 ? "destructive" : pct >= 70 ? "secondary" : "default";
          return (
            <Card key={d.id} className="transition-shadow hover:shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{d.name}</CardTitle>
                  <Badge variant={tone}>{d.occupied}/{d.capacity}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Trưởng khoa: {d.head}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground">Công suất sử dụng</div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{pct}%</div>

                <div className="mt-3 flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => openEdit(d)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Sửa
                  </Button>
                  {deleteId === d.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-2 text-xs"
                        onClick={() => handleDelete(d.id)}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "..." : "Xác nhận xóa"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={() => setDeleteId(null)}
                        disabled={deleteLoading}
                      >
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1.5 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(d.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
