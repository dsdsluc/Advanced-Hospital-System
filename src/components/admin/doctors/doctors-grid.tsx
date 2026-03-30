"use client";

import * as React from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";

import type { Doctor } from "@/lib/api/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DoctorDialog } from "./doctor-dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

function availabilityTone(a: Doctor["availability"]) {
  if (a === "Sẵn sàng") return "bg-secondary/10 text-secondary";
  if (a === "Bận") return "bg-muted text-muted-foreground";
  return "bg-destructive/10 text-destructive";
}

export function DoctorsGrid({ data: initial }: { data: Doctor[] }) {
  const [data, setData] = React.useState<Doctor[]>(initial);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Doctor | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  async function refresh() {
    try {
      const res = await fetch(`${API_URL}/admin/doctors`, { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
  }

  function openCreate() { setEditing(null); setDialogOpen(true); }
  function openEdit(d: Doctor) { setEditing(d); setDialogOpen(true); }

  async function handleDelete(id: string) {
    setDeleteLoading(true);
    try {
      await fetch(`${API_URL}/admin/doctors/${id}`, { method: "DELETE" });
      setDeleteId(null);
      await refresh();
    } catch { /* silent */ } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <DoctorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doctor={editing}
        onSuccess={refresh}
      />

      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bác sĩ
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((d) => {
          const initials = d.name
            .replace("BS.", "")
            .trim()
            .split(" ")
            .slice(-2)
            .map((s) => s[0])
            .join("")
            .toUpperCase();
          return (
            <Card key={d.id} className="transition-shadow hover:shadow-soft">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={d.avatarUrl} alt={d.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{d.name}</CardTitle>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{d.specialization}</Badge>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", availabilityTone(d.availability))}>
                        {d.availability}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground shrink-0">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-foreground">{d.rating.toFixed(1)}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground">
                  Chuyên khoa {d.specialization}. Trạng thái: {d.availability.toLowerCase()}.
                </div>
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
