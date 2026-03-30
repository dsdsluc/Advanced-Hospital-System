"use client";

import * as React from "react";
import type { Doctor } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type DoctorFormData = {
  name: string;
  specialization: string;
  availability: "Sẵn sàng" | "Bận" | "Nghỉ";
  rating: string;
  avatarUrl: string;
};

const DEFAULT_FORM: DoctorFormData = {
  name: "", specialization: "", availability: "Sẵn sàng", rating: "5.0", avatarUrl: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
  onSuccess: () => void;
};

export function DoctorDialog({ open, onOpenChange, doctor, onSuccess }: Props) {
  const isEdit = !!doctor;
  const [form, setForm] = React.useState<DoctorFormData>(DEFAULT_FORM);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setError("");
      if (doctor) {
        setForm({
          name: doctor.name,
          specialization: doctor.specialization,
          availability: doctor.availability,
          rating: String(doctor.rating),
          avatarUrl: doctor.avatarUrl,
        });
      } else {
        setForm(DEFAULT_FORM);
      }
    }
  }, [open, doctor]);

  function set<K extends keyof DoctorFormData>(key: K, value: DoctorFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Tên bác sĩ là bắt buộc");
    if (!form.specialization.trim()) return setError("Chuyên khoa là bắt buộc");
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) return setError("Đánh giá phải từ 1.0 đến 5.0");

    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/doctors/${doctor!.id}` : "/api/admin/doctors";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
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
          <DialogTitle>{isEdit ? "Cập nhật bác sĩ" : "Thêm bác sĩ mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="dname">Họ và tên *</Label>
            <Input
              id="dname"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="BS. Nguyễn Văn A"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="dspec">Chuyên khoa *</Label>
            <Input
              id="dspec"
              value={form.specialization}
              onChange={(e) => set("specialization", e.target.value)}
              placeholder="Tim mạch"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="davail">Trạng thái *</Label>
              <select
                id="davail"
                className={SELECT_CLASS}
                value={form.availability}
                onChange={(e) => set("availability", e.target.value as DoctorFormData["availability"])}
              >
                <option value="Sẵn sàng">Sẵn sàng</option>
                <option value="Bận">Bận</option>
                <option value="Nghỉ">Nghỉ</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="drating">Đánh giá (1–5)</Label>
              <Input
                id="drating"
                type="number"
                min={1}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => set("rating", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="davatarUrl">URL ảnh đại diện</Label>
            <Input
              id="davatarUrl"
              value={form.avatarUrl}
              onChange={(e) => set("avatarUrl", e.target.value)}
              placeholder="https://..."
            />
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
