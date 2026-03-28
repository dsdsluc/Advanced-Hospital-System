import { Award, BookOpen, Building2, Calendar, Mail, Phone, Shield, Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DOCTOR_USER } from "@/components/doctor/nav";

const PROFILE = {
  ...DOCTOR_USER,
  fullName: "TS.BS. Trần Thị Lan",
  specialization: "Nội khoa tổng quát",
  licenseNumber: "BS-VN-2026-0042",
  experience: "12 năm kinh nghiệm",
  education: [
    { degree: "Tiến sĩ Y khoa", school: "Đại học Y Hà Nội", year: "2018" },
    { degree: "Thạc sĩ Nội khoa", school: "Đại học Y Dược TP.HCM", year: "2014" },
    { degree: "Bác sĩ Đa khoa", school: "Đại học Y Hà Nội", year: "2010" },
  ],
  certifications: [
    "Chứng chỉ Tim mạch can thiệp – BYT 2020",
    "Chứng chỉ Siêu âm tim – Hội Tim mạch 2019",
    "Chứng chỉ Điều trị đái tháo đường – ADA 2022",
  ],
  contact: {
    email: "lan.tran@quancare.vn",
    phone: "0901 999 888",
    extension: "302",
  },
  stats: [
    { label: "Bệnh nhân đã khám", value: "4,280" },
    { label: "Năm kinh nghiệm", value: "12" },
    { label: "Đánh giá trung bình", value: "4.9 / 5" },
    { label: "Công trình nghiên cứu", value: "7" },
  ],
};

export function ProfileView() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: Identity card */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto h-20 w-20">
              <AvatarImage src={DOCTOR_USER.avatar} alt={PROFILE.fullName} />
              <AvatarFallback className="text-xl">TL</AvatarFallback>
            </Avatar>
            <div className="mt-4">
              <div className="text-lg font-semibold">{PROFILE.fullName}</div>
              <div className="text-sm text-muted-foreground">{PROFILE.specialization}</div>
              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                {PROFILE.licenseNumber}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">4.9</span>
              <span className="text-xs text-muted-foreground">(328 đánh giá)</span>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3 text-center">
              {PROFILE.stats.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-semibold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button className="w-full" variant="outline">Chỉnh sửa hồ sơ</Button>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Liên hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {[
              { icon: Mail, label: PROFILE.contact.email },
              { icon: Phone, label: PROFILE.contact.phone },
              { icon: Building2, label: `Phòng ${PROFILE.contact.extension} – Khoa Nội` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right: Details */}
      <div className="lg:col-span-2 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PROFILE.stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <div className="text-xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Education */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              Học vấn & Đào tạo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {PROFILE.education.map((e, i) => (
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
              {PROFILE.certifications.map((cert, i) => (
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
                { label: "Khoa", value: DOCTOR_USER.department },
                { label: "Phòng khám", value: "Phòng 302, Tầng 3, Toà A" },
                { label: "Mã nhân viên", value: DOCTOR_USER.code },
                { label: "Thâm niên", value: PROFILE.experience },
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
