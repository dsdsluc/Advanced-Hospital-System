"use client";

import * as React from "react";
import type { Patient } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type PatientFormData = {
  name: string;
  gender: "Nam" | "Nữ";
  age: string;
  phone: string;
  status: "Đang điều trị" | "Theo dõi" | "Xuất viện";
};

const DEFAULT_FORM: PatientFormData = {
  name: "", gender: "Nam", age: "", phone: "", status: "Theo dõi",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  onSuccess: () => void;
};

export function PatientDialog({ open, onOpenChange, patient, onSuccess }: Props) {
  const isEdit = !!patient;
  const [form, setForm] = React.useState<PatientFormData>(DEFAULT_FORM);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Populate form when editing
  React.useEffect(() => {
    if (open) {
      setError("");
      if (patient) {
        setForm({
          name: patient.name,
          gender: patient.gender,
          age: String(patient.age),
          phone: patient.phone,
          status: patient.status,
        });
      } else {
        setForm(DEFAULT_FORM);
      }
    }
  }, [open, patient]);

  function set<K extends keyof PatientFormData>(key: K, value: PatientFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const age = parseInt(form.age, 10);
    if (!form.name.trim()) return setError("Tên bệnh nhân là bắt buộc");
    if (isNaN(age) || age < 1 || age > 120) return setError("Tuổi phải từ 1 đến 120");
    if (!form.phone.trim()) return setError("Số điện thoại là bắt buộc");

    setLoading(true);
    try {
      const url = isEdit
        ? `/api/admin/patients/${patient!.id}`
        : "/api/admin/patients";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age }),
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
          <DialogTitle>{isEdit ? "Cập nhật bệnh nhân" : "Thêm bệnh nhân mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="pname">Họ và tên *</Label>
            <Input
              id="pname"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="pgender">Giới tính *</Label>
              <select
                id="pgender"
                className={SELECT_CLASS}
                value={form.gender}
                onChange={(e) => set("gender", e.target.value as "Nam" | "Nữ")}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="page">Tuổi *</Label>
              <Input
                id="page"
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="pphone">Số điện thoại *</Label>
            <Input
              id="pphone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="0901 234 567"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="pstatus">Trạng thái *</Label>
            <select
              id="pstatus"
              className={SELECT_CLASS}
              value={form.status}
              onChange={(e) => set("status", e.target.value as PatientFormData["status"])}
            >
              <option value="Đang điều trị">Đang điều trị</option>
              <option value="Theo dõi">Theo dõi</option>
              <option value="Xuất viện">Xuất viện</option>
            </select>
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
