"use client";

import * as React from "react";
import type { Department } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = { name: string; capacity: string; occupied: string };

const DEFAULT_FORM: FormData = { name: "", capacity: "100", occupied: "0" };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  onSuccess: () => void;
};

export function DepartmentDialog({ open, onOpenChange, department, onSuccess }: Props) {
  const isEdit = !!department;
  const [form, setForm] = React.useState<FormData>(DEFAULT_FORM);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setError("");
      if (department) {
        setForm({
          name: department.name,
          capacity: String(department.capacity),
          occupied: String(department.occupied),
        });
      } else {
        setForm(DEFAULT_FORM);
      }
    }
  }, [open, department]);

  function set<K extends keyof FormData>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Tên khoa là bắt buộc");
    const capacity = parseInt(form.capacity, 10);
    const occupied = parseInt(form.occupied, 10);
    if (isNaN(capacity) || capacity < 1) return setError("Sức chứa phải lớn hơn 0");
    if (isNaN(occupied) || occupied < 0) return setError("Số bệnh nhân hiện tại không hợp lệ");
    if (occupied > capacity) return setError("Số bệnh nhân không thể vượt sức chứa");

    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/departments/${department!.id}`
        : "/api/admin/departments";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), capacity, occupied }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Có lỗi xảy ra"); return; }
      onSuccess();
      onOpenChange(false);
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Cập nhật khoa" : "Thêm khoa mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="dep-name">Tên khoa *</Label>
            <Input
              id="dep-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Tim mạch"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="dep-capacity">Sức chứa *</Label>
              <Input
                id="dep-capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dep-occupied">Đang sử dụng</Label>
              <Input
                id="dep-occupied"
                type="number"
                min={0}
                value={form.occupied}
                onChange={(e) => set("occupied", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
