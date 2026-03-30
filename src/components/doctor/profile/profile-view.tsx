"use client";

import { useEffect, useState, useRef } from "react";
import {
  Award, BookOpen, Building2, Calendar, Camera, Check, Loader,
  Mail, Pencil, Phone, Plus, Shield, Star, Trash2, X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDoctor } from "@/lib/doctor-context";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EduEntry { degree: string; school: string; year: string }

interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  avatarUrl: string;
  availability: "Sẵn sàng" | "Bận" | "Nghỉ";
  rating: number;
  department: { id: string; name: string } | null;
  email: string;
  phone: string;
  bio: string;
  room: string;
  joinedYear: number | null;
  education: EduEntry[];
  certifications: string[];
  stats: { totalAppointments: number; completedAppointments: number; totalPatients: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return (name ?? "").split(" ").slice(-2).map((s) => s[0]).join("").toUpperCase();
}

function availStyle(av: string) {
  if (av === "Sẵn sàng") return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (av === "Bận") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileView() {
  const { doctorId, doctor: sessionDoctor } = useDoctor();

  const [profile, setProfile]   = useState<DoctorProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  // Edit fields
  const [editName,           setEditName]           = useState("");
  const [editSpec,           setEditSpec]           = useState("");
  const [editAvail,          setEditAvail]          = useState<"Sẵn sàng"|"Bận"|"Nghỉ">("Sẵn sàng");
  const [editPhone,          setEditPhone]          = useState("");
  const [editBio,            setEditBio]            = useState("");
  const [editRoom,           setEditRoom]           = useState("");
  const [editJoinedYear,     setEditJoinedYear]     = useState("");
  const [editAvatarUrl,      setEditAvatarUrl]      = useState("");
  const [editEducation,      setEditEducation]      = useState<EduEntry[]>([]);
  const [editCerts,          setEditCerts]          = useState<string[]>([]);
  const [avatarUploading,    setAvatarUploading]    = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (doctorId) load(); }, [doctorId]); // eslint-disable-line

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctor/profile?doctorId=${doctorId}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setProfile(data);
    } finally {
      setLoading(false);
    }
  }

  function startEdit() {
    if (!profile) return;
    setEditName(profile.name);
    setEditSpec(profile.specialization);
    setEditAvail(profile.availability);
    setEditPhone(profile.phone);
    setEditBio(profile.bio);
    setEditRoom(profile.room);
    setEditJoinedYear(profile.joinedYear?.toString() ?? "");
    setEditAvatarUrl(profile.avatarUrl);
    setEditEducation((profile.education ?? []).map((e) => ({ ...e })));
    setEditCerts([...(profile.certifications ?? [])]);
    setError("");
    setEditMode(true);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const result = await uploadImageToCloudinary(file, "hms/doctors");
      setEditAvatarUrl(result.url);
    } finally {
      setAvatarUploading(false);
    }
  }

  // Education helpers
  function addEdu() { setEditEducation((p) => [...p, { degree: "", school: "", year: "" }]); }
  function removeEdu(i: number) { setEditEducation((p) => p.filter((_, idx) => idx !== i)); }
  function updateEdu(i: number, field: keyof EduEntry, val: string) {
    setEditEducation((p) => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }

  // Cert helpers
  function addCert() { setEditCerts((p) => [...p, ""]); }
  function removeCert(i: number) { setEditCerts((p) => p.filter((_, idx) => idx !== i)); }
  function updateCert(i: number, val: string) { setEditCerts((p) => p.map((c, idx) => idx === i ? val : c)); }

  async function handleSave() {
    if (!editName.trim()) { setError("Tên bác sĩ không thể trống"); return; }
    if (!editSpec.trim()) { setError("Chuyên khoa không thể trống"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/doctor/profile?doctorId=${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          specialization: editSpec,
          availability: editAvail,
          avatarUrl: editAvatarUrl,
          phone: editPhone,
          bio: editBio,
          room: editRoom,
          joinedYear: editJoinedYear ? parseInt(editJoinedYear) : null,
          education: editEducation.filter((e) => e.degree || e.school),
          certifications: editCerts.filter(Boolean),
        }),
      });
      if (res.ok) {
        setProfile(await res.json());
        setEditMode(false);
      } else {
        const err = await res.json();
        setError(err.error ?? "Có lỗi xảy ra");
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Guards ──
  if (!doctorId) return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      Vui lòng đăng nhập để xem hồ sơ
    </div>
  );

  if (loading) return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4">
        <Card><CardContent className="p-6 space-y-3">
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <Skeleton className="h-5 w-40 mx-auto" />
          <Skeleton className="h-4 w-28 mx-auto" />
        </CardContent></Card>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  );

  if (!profile) return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      Không thể tải thông tin hồ sơ
    </div>
  );

  const licenseNo = `BS-VN-${profile.joinedYear ?? "----"}-${(profile.id ?? "").slice(-4).toUpperCase() || "XXXX"}`;

  // ── Render ──
  return (
    <div className="grid gap-6 lg:grid-cols-3">

      {/* ── Left column ── */}
      <div className="space-y-4">
        {editMode ? (
          /* ── Edit card ── */
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Pencil className="h-4 w-4" /> Chỉnh sửa hồ sơ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}

              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {editAvatarUrl && <AvatarImage src={editAvatarUrl} />}
                    <AvatarFallback className="text-xl">{getInitials(editName || profile.name)}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={avatarUploading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {avatarUploading ? <Loader className="h-5 w-5 text-white animate-spin" /> : <Camera className="h-5 w-5 text-white" />}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <p className="text-xs text-muted-foreground">Nhấn vào ảnh để thay đổi</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Họ và tên</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Chuyên khoa</label>
                <Input value={editSpec} onChange={(e) => setEditSpec(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Điện thoại</label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="vd: 0901 234 567" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Phòng khám</label>
                <Input value={editRoom} onChange={(e) => setEditRoom(e.target.value)} placeholder="vd: Phòng 302, Tầng 3" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Năm vào làm</label>
                <Input type="number" value={editJoinedYear} onChange={(e) => setEditJoinedYear(e.target.value)} placeholder="vd: 2015" min={1980} max={2030} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  value={editAvail}
                  onChange={(e) => setEditAvail(e.target.value as "Sẵn sàng"|"Bận"|"Nghỉ")}
                  className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>Sẵn sàng</option>
                  <option>Bận</option>
                  <option>Nghỉ</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={handleSave} disabled={saving || avatarUploading}>
                  {saving ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                  Lưu thay đổi
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)} disabled={saving}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* ── View card ── */
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="mx-auto h-20 w-20">
                {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <p className="text-lg font-semibold">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.specialization}</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" /> {licenseNo}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">{(profile.rating ?? 5).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">/ 5.0</span>
              </div>

              <Separator className="my-4" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{profile.stats?.totalPatients ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Bệnh nhân</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{profile.stats?.totalAppointments ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Lịch khám</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{profile.stats?.completedAppointments ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">Hoàn tất</p>
                </div>
              </div>

              <Separator className="my-4" />
              <Badge className={cn("text-xs", availStyle(profile.availability))}>
                {profile.availability}
              </Badge>
              <Button className="mt-4 w-full" variant="outline" onClick={startEdit}>
                <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa hồ sơ
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {[
              { icon: Mail,      label: profile.email || sessionDoctor?.email || "---" },
              { icon: Phone,     label: profile.phone || "---" },
              { icon: Building2, label: profile.department ? `Khoa ${profile.department.name}` : "---" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Right columns ── */}
      <div className="lg:col-span-2 space-y-4">

        {/* Status + bio */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Trạng thái làm việc</p>
                <p className="text-xs text-muted-foreground mt-0.5">Trạng thái hiện tại</p>
              </div>
              <Badge className={cn("text-xs", availStyle(profile.availability))}>
                {profile.availability}
              </Badge>
            </div>
            {profile.bio && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Education — editable in edit mode */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-muted-foreground" /> Học vấn & Đào tạo
              </CardTitle>
              {editMode && (
                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={addEdu}>
                  <Plus className="h-3 w-3" /> Thêm
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {editMode ? (
              <div className="space-y-3">
                {editEducation.length === 0 && (
                  <p className="text-sm italic text-muted-foreground">Chưa có thông tin học vấn. Nhấn &quot;Thêm&quot; để thêm.</p>
                )}
                {editEducation.map((e, i) => (
                  <div key={i} className="grid gap-2 rounded-xl border p-3">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium text-muted-foreground">Bằng cấp {i + 1}</p>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeEdu(i)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Input placeholder="Bằng cấp / Học vị" value={e.degree} onChange={(ev) => updateEdu(i, "degree", ev.target.value)} className="h-8 text-sm" />
                    <Input placeholder="Trường / Cơ sở đào tạo" value={e.school} onChange={(ev) => updateEdu(i, "school", ev.target.value)} className="h-8 text-sm" />
                    <Input placeholder="Năm tốt nghiệp" value={e.year} onChange={(ev) => updateEdu(i, "year", ev.target.value)} className="h-8 text-sm" />
                  </div>
                ))}
              </div>
            ) : (profile.education ?? []).length === 0 ? (
              <p className="text-sm italic text-muted-foreground py-2">Chưa có thông tin học vấn</p>
            ) : (
              <div className="space-y-4">
                {(profile.education ?? []).map((e, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{e.degree}</p>
                      <p className="text-sm text-muted-foreground">{e.school}</p>
                      {e.year && (
                        <p className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" /> {e.year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certifications — editable */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-muted-foreground" /> Chứng chỉ chuyên môn
              </CardTitle>
              {editMode && (
                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={addCert}>
                  <Plus className="h-3 w-3" /> Thêm
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {editMode ? (
              <div className="space-y-2">
                {editCerts.length === 0 && (
                  <p className="text-sm italic text-muted-foreground">Chưa có chứng chỉ. Nhấn &quot;Thêm&quot; để thêm.</p>
                )}
                {editCerts.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={c}
                      onChange={(e) => updateCert(i, e.target.value)}
                      placeholder="Tên chứng chỉ..."
                      className="h-8 flex-1 text-sm"
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 text-destructive" onClick={() => removeCert(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (profile.certifications ?? []).length === 0 ? (
              <p className="text-sm italic text-muted-foreground py-2">Chưa có chứng chỉ</p>
            ) : (
              <div className="space-y-2">
                {(profile.certifications ?? []).map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bio — edit section */}
        {editMode && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Giới thiệu bản thân</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Giới thiệu về kinh nghiệm, phong cách làm việc..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        )}

        {/* Working info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-muted-foreground" /> Thông tin công tác
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Khoa",        value: profile.department?.name ?? "---" },
                { label: "Phòng khám", value: profile.room || "---" },
                { label: "Mã nhân viên", value: (profile.id ?? "").slice(-6).toUpperCase() || "------" },
                { label: "Năm vào làm", value: profile.joinedYear ? `${profile.joinedYear}` : "---" },
                { label: "Thâm niên",   value: profile.joinedYear ? `${new Date().getFullYear() - profile.joinedYear} năm` : "---" },
                { label: "Email",       value: profile.email || sessionDoctor?.email || "---" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-0.5 font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
