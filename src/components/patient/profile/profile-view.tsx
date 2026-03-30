"use client";
import * as React from "react";
import {
  Camera,
  Check,
  Loader,
  Pencil,
  X,
  Phone,
  Mail,
  User,
  Shield,
  Heart,
} from "lucide-react";
import { usePatient } from "@/lib/patient-context";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PatientProfile {
  id: string;
  code: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  avatarUrl: string | null;
  status: string;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase();
}

function statusColor(status: string): string {
  switch (status) {
    case "Đang điều trị":
      return "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300";
    case "Theo dõi":
      return "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300";
    case "Xuất viện":
      return "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
}

export function ProfileView() {
  const { patientId, patient: sessionPatient } = usePatient();

  const [profile, setProfile] = React.useState<PatientProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [editName, setEditName] = React.useState("");
  const [editPhone, setEditPhone] = React.useState("");
  const [editAvatarUrl, setEditAvatarUrl] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/patient/profile?patientId=${patientId}`)
      .then((r) => r.json())
      .then((data: PatientProfile) => setProfile(data))
      .catch(() => setError("Không thể tải hồ sơ."))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!patientId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        Vui lòng đăng nhập để tiếp tục.
      </div>
    );
  }

  function startEdit() {
    if (!profile) return;
    setEditName(profile.name);
    setEditPhone(profile.phone);
    setEditAvatarUrl(profile.avatarUrl);
    setError(null);
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
    setError(null);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatarUploading(true);
      const result = await uploadImageToCloudinary(file, "hms/patients");
      setEditAvatarUrl(result.url);
    } catch {
      setError("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    if (!patientId || !profile) return;
    if (!editName.trim()) {
      setError("Tên không được để trống.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: { name?: string; phone?: string; avatarUrl?: string } = {};
      if (editName.trim() !== profile.name) body.name = editName.trim();
      if (editPhone.trim() !== profile.phone) body.phone = editPhone.trim();
      if (editAvatarUrl !== profile.avatarUrl) body.avatarUrl = editAvatarUrl ?? "";

      const res = await fetch(`/api/patient/profile?patientId=${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setError((err as { error?: string }).error ?? "Lỗi khi lưu hồ sơ.");
        return;
      }

      const updated = (await res.json()) as PatientProfile;
      setProfile(updated);
      setEditMode(false);
    } catch {
      setError("Không thể kết nối server. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-3xl" />
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-40 rounded-3xl" />
            <Skeleton className="h-40 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
        {error ?? "Không thể tải hồ sơ."}
      </div>
    );
  }

  const displayAvatarUrl = editMode ? editAvatarUrl : profile.avatarUrl;
  const initials = getInitials(profile.name);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Hồ sơ cá nhân
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thông tin cá nhân và y tế của bạn.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — identity card */}
        <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            {editMode ? (
              <>
                <CardTitle className="flex items-center gap-2 self-start text-base">
                  <Pencil className="h-4 w-4 text-blue-500" />
                  Chỉnh sửa thông tin
                </CardTitle>

                {/* Avatar with camera overlay */}
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {displayAvatarUrl ? (
                      <AvatarImage src={displayAvatarUrl} alt={editName} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-2xl font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white transition-opacity hover:bg-black/50"
                  >
                    {avatarUploading ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* Name input */}
                <div className="w-full space-y-1.5">
                  <label className="text-left text-xs font-medium text-muted-foreground">
                    Họ và tên
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border-blue-200/60 bg-blue-50/60 dark:border-blue-800/40 dark:bg-blue-950/30"
                    placeholder="Họ và tên"
                  />
                </div>

                {/* Phone input */}
                <div className="w-full space-y-1.5">
                  <label className="text-left text-xs font-medium text-muted-foreground">
                    Số điện thoại
                  </label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="border-blue-200/60 bg-blue-50/60 dark:border-blue-800/40 dark:bg-blue-950/30"
                    placeholder="Số điện thoại"
                  />
                </div>

                {/* Save + Cancel */}
                <div className="flex w-full gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600"
                    onClick={handleSave}
                    disabled={saving || avatarUploading}
                  >
                    {saving ? (
                      <Loader className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-slate-200 dark:border-slate-700"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    Hủy
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Display mode */}
                <Avatar className="h-24 w-24">
                  {profile.avatarUrl ? (
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-teal-500 text-2xl font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {profile.name}
                </div>

                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  {profile.code}
                </div>

                <Badge
                  variant="outline"
                  className={cn("text-xs", statusColor(profile.status))}
                >
                  {profile.status}
                </Badge>

                <Separator className="w-full bg-blue-50 dark:bg-slate-800" />

                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giới tính</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {profile.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tuổi</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {profile.age}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-blue-200/60 bg-blue-50/60 text-blue-700 hover:bg-blue-100/80 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-300"
                  onClick={startEdit}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Chỉnh sửa thông tin
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right columns (span 2) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Contact card */}
          <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
                <Phone className="h-4 w-4 text-blue-500" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {sessionPatient?.email ?? "---"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    Số điện thoại
                  </div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile.phone || "---"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient info card */}
          <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
                <User className="h-4 w-4 text-teal-500" />
                Thông tin bệnh nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Giới tính</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile.gender}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Tuổi</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile.age}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Mã bệnh nhân</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile.code}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Trạng thái</p>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusColor(profile.status))}
                  >
                    {profile.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health note card */}
          <Card className="border-white/70 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
                <Heart className="h-4 w-4 text-rose-500" />
                Ghi chú sức khỏe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-blue-100/80 bg-blue-50/60 p-4 dark:border-blue-900/30 dark:bg-blue-950/30">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Hãy cập nhật thông tin cá nhân để bác sĩ có thể liên hệ và chăm sóc bạn tốt
                  hơn. Thông tin của bạn được bảo mật theo tiêu chuẩn y tế.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
