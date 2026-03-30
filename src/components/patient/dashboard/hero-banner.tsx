"use client";
import { useEffect, useState } from "react";
import { CalendarDays, CalendarPlus, ChevronRight, Clock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePatient } from "@/lib/patient-context";

interface NextAppt {
  date: string;
  time: string;
  doctorName: string;
  doctorSpecialization: string;
  department: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export function PatientHeroBanner() {
  const { patientId, patient } = usePatient();
  const [nextAppt, setNextAppt] = useState<NextAppt | null>(null);

  const firstName = patient?.name?.split(" ").pop() ?? "bạn";
  const patientCode = patient?.code ?? "---";

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!patientId) return;
    fetch(`/api/patient/appointments?patientId=${patientId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const now = new Date();
        const upcoming = data
          .filter(
            (a) =>
              (a.status === "Chờ xác nhận" || a.status === "Đã xác nhận") &&
              new Date(a.rawDate) >= now,
          )
          .sort(
            (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
          );
        if (upcoming.length > 0) {
          const first = upcoming[0];
          setNextAppt({
            date: first.date,
            time: first.time,
            doctorName: first.doctorName,
            doctorSpecialization: first.doctorSpecialization,
            department: first.department,
          });
        }
      })
      .catch(() => {});
  }, [patientId]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-teal-600 p-6 text-white shadow-xl shadow-blue-200/50 dark:shadow-blue-900/40 lg:p-8">
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 right-40 h-40 w-40 rounded-full bg-white/[0.08]" />
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
          {nextAppt ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{nextAppt.date}</div>
                  <div className="text-xs text-blue-100">{nextAppt.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{nextAppt.doctorName}</div>
                  <div className="text-xs text-blue-100">{nextAppt.doctorSpecialization}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{nextAppt.department}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 text-sm text-blue-100/80">
              Không có lịch hẹn sắp tới
            </div>
          )}
        </div>
      </div>

      {/* Patient ID badge bottom-right on large screens */}
      <div className="absolute bottom-5 right-6 hidden text-right lg:block">
        <div className="text-xs text-blue-200">Mã bệnh nhân</div>
        <div className="font-mono text-base font-bold">{patientCode}</div>
      </div>
    </div>
  );
}
