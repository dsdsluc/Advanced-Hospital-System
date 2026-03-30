"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
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
  email: string;
  password: string;
  newPassword: string;
};

const DEFAULT_FORM: DoctorFormData = {
  name: "", specialization: "", availability: "Sẵn sàng", rating: "5.0",
  avatarUrl: "", email: "", password: "", newPassword: "",
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
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setError("");
      setShowPassword(false);
      setShowNewPassword(false);
      if (doctor) {
        setForm({
          name: doctor.name,
          specialization: doctor.specialization,
          availability: doctor.availability,
          rating: String(doctor.rating),
          avatarUrl: doctor.avatarUrl,
          email: doctor.email ?? "",
          password: "",
          newPassword: "",
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

    if (!isEdit) {
      if (!form.email.trim()) return setError("Email đăng nhập là bắt buộc");
      if (!form.password.trim() || form.password.length < 6) return setError("Mật khẩu phải ít nhất 6 ký tự");
    }

    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/doctors/${doctor!.id}` : "/api/admin/doctors";
      const body = isEdit
        ? { name: form.name, specialization: form.specialization, availability: form.availability, rating, avatarUrl: form.avatarUrl, ...(form.newPassword.trim() ? { newPassword: form.newPassword.trim() } : {}) }
        : { name: form.name, specialization: form.specialization, availability: form.availability, rating, avatarUrl: form.avatarUrl, email: form.email.trim(), password: form.password.trim() };

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

          {/* ── Login credentials ── */}
          <div className="rounded-lg border border-dashed p-3 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {isEdit ? "Tài khoản đăng nhập" : "Tài khoản đăng nhập *"}
            </p>

            {!isEdit ? (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="demail">Email *</Label>
                  <Input
                    id="demail"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="bacsi@hospital.com"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dpassword">Mật khẩu *</Label>
                  <div className="relative">
                    <Input
                      id="dpassword"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {form.email && (
                  <div className="text-sm text-muted-foreground">
                    Email: <span className="font-medium text-foreground">{form.email}</span>
                  </div>
                )}
                {!doctor?.hasLogin && (
                  <p className="text-xs text-amber-600">Bác sĩ này chưa có tài khoản đăng nhập.</p>
                )}
                <div className="grid gap-1.5">
                  <Label htmlFor="dnewpassword">Đặt lại mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="dnewpassword"
                      type={showNewPassword ? "text" : "password"}
                      value={form.newPassword}
                      onChange={(e) => set("newPassword", e.target.value)}
                      placeholder="Để trống nếu không thay đổi"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
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
