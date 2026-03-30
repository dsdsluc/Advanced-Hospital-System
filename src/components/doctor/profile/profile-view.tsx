"use client";

import { useEffect, useState, useRef } from "react";
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  Camera,
  Check,
  Loader,
  Mail,
  Pencil,
  Phone,
  Shield,
  Star,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctor } from "@/lib/doctor-context";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  avatarUrl: string | null;
  availability: "Sẵn sàng" | "Bận" | "Nghỉ";
  rating: number;
  department: { id: string; name: string } | null;
}

const EDUCATION = [
  { degree: "Tiến sĩ Y khoa", school: "Đại học Y Hà Nội", year: "2018" },
  { degree: "Thạc sĩ Nội khoa", school: "Đại học Y Dược TP.HCM", year: "2014" },
  { degree: "Bác sĩ Đa khoa", school: "Đại học Y Hà Nội", year: "2010" },
];

const CERTIFICATIONS = [
  "Chứng chỉ Tim mạch can thiệp – BYT 2020",
  "Chứng chỉ Siêu âm tim – Hội Tim mạch 2019",
  "Chứng chỉ Điều trị đái tháo đường – ADA 2022",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

function availColor(av: string) {
  if (av === "Sẵn sàng") return "bg-green-100 text-green-800";
  if (av === "Bận") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export function ProfileView() {
  const { doctorId, doctor } = useDoctor();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editSpecialization, setEditSpecialization] = useState("");
  const [editAvailability, setEditAvailability] = useState<
    "Sẵn sàng" | "Bận" | "Nghỉ"
  >("Sẵn sàng");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!doctorId) return;
    loadProfile();
  }, [doctorId]);

  async function loadProfile() {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/profile?doctorId=${doctorId}`, {
        cache: "no-store",
      });
      const data: DoctorProfile = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    if (!profile) return;
    setEditName(profile.name);
    setEditSpecialization(profile.specialization);
    setEditAvailability(profile.availability);
    setEditAvatarUrl(profile.avatarUrl);
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
  }

  async function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const result = await uploadImageToCloudinary(file, "hms/doctors");
      setEditAvatarUrl(result.url);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/doctor/profile?doctorId=${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          specialization: editSpecialization,
          availability: editAvailability,
          avatarUrl: editAvatarUrl,
        }),
      });

      if (res.ok) {
        const updated: DoctorProfile = await res.json();
        setProfile(updated);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  }

  // Build license number from doctorId last 4 chars
  const licenseNumber = profile
    ? `BS-VN-2026-${profile.id.slice(-4).toUpperCase()}`
    : "BS-VN-2026-XXXX";

  if (!doctorId) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Vui lòng đăng nhập để xem hồ sơ
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <Skeleton className="h-5 w-40 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Không thể tải thông tin hồ sơ
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left column */}
      <div className="space-y-4">
        {editMode ? (
          /* Edit form */
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Chỉnh sửa hồ sơ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {editAvatarUrl && <AvatarImage src={editAvatarUrl} />}
                    <AvatarFallback className="text-xl">
                      {getInitials(editName || profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {avatarUploading ? (
                      <Loader className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
                <span className="text-xs text-muted-foreground">
                  Nhấn vào ảnh để thay đổi
                </span>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Họ và tên</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nhập tên..."
                />
              </div>

              {/* Specialization */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Chuyên khoa</label>
                <Input
                  value={editSpecialization}
                  onChange={(e) => setEditSpecialization(e.target.value)}
                  placeholder="Nhập chuyên khoa..."
                />
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  value={editAvailability}
                  onChange={(e) =>
                    setEditAvailability(
                      e.target.value as "Sẵn sàng" | "Bận" | "Nghỉ",
                    )
                  }
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Sẵn sàng">Sẵn sàng</option>
                  <option value="Bận">Bận</option>
                  <option value="Nghỉ">Nghỉ</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving || avatarUploading}
                >
                  {saving ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={cancelEdit} disabled={saving}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Display mode */
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="mx-auto h-20 w-20">
                {profile.avatarUrl && (
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                )}
                <AvatarFallback className="text-xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <div className="text-lg font-semibold">{profile.name}</div>
                <div className="text-sm text-muted-foreground">
                  {profile.specialization}
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  {licenseNumber}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">
                  {profile.rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-lg font-semibold">{profile.rating.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Đánh giá</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    <Badge className={availColor(profile.availability)}>
                      {profile.availability}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Trạng thái</div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button className="w-full" variant="outline" onClick={startEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa hồ sơ
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {[
              { icon: Mail, label: doctor?.email ?? "---" },
              { icon: Phone, label: "---" },
              {
                icon: Building2,
                label: profile.department
                  ? `Khoa ${profile.department.name}`
                  : "---",
              },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right columns (span 2) */}
      <div className="lg:col-span-2 space-y-4">
        {/* Availability badge card */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Trạng thái làm việc</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Trạng thái hiện tại của bác sĩ
              </div>
            </div>
            <Badge className={availColor(profile.availability)}>
              {profile.availability}
            </Badge>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Học vấn & Đào tạo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {EDUCATION.map((e, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">{e.degree}</div>
                  <div className="text-sm text-muted-foreground">{e.school}</div>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {e.year}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Chứng chỉ chuyên môn
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-2">
              {CERTIFICATIONS.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
                  <span className="text-sm">{cert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Working info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Thông tin công tác
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                {
                  label: "Khoa",
                  value: profile.department?.name ?? "---",
                },
                { label: "Phòng khám", value: "Phòng 302, Tầng 3, Toà A" },
                { label: "Mã nhân viên", value: profile.id.slice(-6).toUpperCase() },
                { label: "Thâm niên", value: "12 năm kinh nghiệm" },
                { label: "Loại hợp đồng", value: "Biên chế" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="mt-0.5 font-medium">{item.value}</div>
                </div>
              ))}
              <div>
                <div className="text-xs text-muted-foreground">Trạng thái</div>
                <div className="mt-0.5 font-medium inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  Đang làm việc
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
