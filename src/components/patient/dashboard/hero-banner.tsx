import {
  CalendarDays,
  CalendarPlus,
  ChevronRight,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PATIENT_USER } from "@/components/patient/nav";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function PatientHeroBanner() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const firstName = PATIENT_USER.name.split(" ").pop();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-teal-600 p-6 text-white shadow-xl shadow-blue-200/50 dark:shadow-blue-900/40 lg:p-8">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 right-40 h-40 w-40 rounded-full bg-white/8" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-28 rounded-full bg-teal-400/20" />
      <div className="pointer-events-none absolute left-1/3 top-0 h-20 w-20 rounded-full bg-blue-400/20" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left – welcome */}
        <div>
          <div className="text-sm font-medium capitalize text-blue-100">
            {today}
          </div>
          <h1 className="mt-1 text-2xl font-bold lg:text-3xl">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-blue-100/90">
            Chúc bạn một ngày sức khỏe và an lành.
          </p>

          {/* Quick actions */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button
              asChild
              className="rounded-xl bg-white text-blue-600 shadow-md hover:bg-blue-50"
            >
              <Link href="/patient/appointments">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Đặt lịch hẹn mới
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
            >
              <Link href="/patient/health-records">
                Xem hồ sơ sức khỏe
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right – next appointment card */}
        <div className="shrink-0 rounded-2xl bg-white/15 p-5 backdrop-blur-sm lg:min-w-[270px]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-100">
            Lịch hẹn tiếp theo
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Thứ 3, 01/04/2026</div>
                <div className="text-xs text-blue-100">09:30 – 10:00</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">BS. Trần Thị Lan</div>
                <div className="text-xs text-blue-100">Khoa Nội tổng quát</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Phòng 302 · Tầng 3</div>
                <div className="text-xs text-blue-100">Toà A, Cơ sở chính</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient ID badge bottom-right on large screens */}
      <div className="absolute bottom-5 right-6 hidden text-right lg:block">
        <div className="text-xs text-blue-200">Mã bệnh nhân</div>
        <div className="font-mono text-base font-bold">{PATIENT_USER.patientId}</div>
      </div>
    </div>
  );
}
