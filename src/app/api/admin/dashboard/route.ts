import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DashboardStats, RevenuePoint } from "@/lib/api/types";

// Maps Vietnamese day abbreviations to JS day index (0 = Sunday)
const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export async function GET() {
  try {
    // ── Stats ─────────────────────────────────────────────────────────────────
    const [patientCount, doctorCount, todayAppointmentCount, completedApptCount] =
      await Promise.all([
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.appointment.count({
          where: {
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        prisma.appointment.count({ where: { status: "COMPLETED" } }),
      ]);

    // Revenue: each completed appointment = 1,500,000 VND average
    const revenue = completedApptCount * 1_500_000;

    // Revenue change vs. last week (completed appts this week vs previous week)
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const [thisWeekCount, lastWeekCount] = await Promise.all([
      prisma.appointment.count({
        where: {
          status: "COMPLETED",
          appointmentDate: { gte: startOfThisWeek },
        },
      }),
      prisma.appointment.count({
        where: {
          status: "COMPLETED",
          appointmentDate: { gte: startOfLastWeek, lt: startOfThisWeek },
        },
      }),
    ]);

    const revenueChangePct =
      lastWeekCount === 0
        ? 0
        : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 1000) / 10;

    const stats: DashboardStats = {
      patients: patientCount,
      doctors: doctorCount,
      appointments: todayAppointmentCount,
      revenue,
      revenueChangePct,
    };

    // ── Revenue chart — appointments per day this week ─────────────────────
    const weekAppointments = await prisma.appointment.findMany({
      where: { appointmentDate: { gte: startOfThisWeek } },
      select: { appointmentDate: true },
    });

    const dailyCounts = Array<number>(7).fill(0);
    for (const appt of weekAppointments) {
      const dayIndex = new Date(appt.appointmentDate).getDay();
      dailyCounts[dayIndex]++;
    }

    const revenue7Days: RevenuePoint[] = DAY_LABELS.map((label, i) => ({
      label,
      value: dailyCounts[i],
    }));

    // ── Recent patients (last 5 created) ─────────────────────────────────────
    const recentPatientsRaw = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recentPatients = recentPatientsRaw.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      gender: p.gender as "Nam" | "Nữ",
      age: p.age,
      phone: p.phone,
      avatarUrl: p.avatarUrl,
      status: mapPatientStatus(p.status),
      lastVisit: p.lastVisit ? formatRelativeDate(p.lastVisit) : "Chưa khám",
    }));

    // ── Upcoming appointments (next 6) ────────────────────────────────────────
    const upcomingRaw = await prisma.appointment.findMany({
      where: {
        appointmentDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
      take: 6,
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true } },
        department: { select: { name: true } },
      },
    });

    const upcomingAppointments = upcomingRaw.map((a) => ({
      id: a.id,
      date: formatRelativeDate(a.appointmentDate),
      time: a.appointmentTime,
      patientName: a.patient.name,
      doctorName: a.doctor.name,
      department: a.department.name,
      status: mapAppointmentStatus(a.status),
    }));

    console.log("[API] /admin/dashboard — connected to DB successfully");

    return NextResponse.json({
      stats,
      revenue: revenue7Days,
      recentPatients,
      upcomingAppointments,
    });
  } catch (error) {
    console.error("[API] /admin/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapPatientStatus(status: string): "Đang điều trị" | "Theo dõi" | "Xuất viện" {
  const map: Record<string, "Đang điều trị" | "Theo dõi" | "Xuất viện"> = {
    TREATING: "Đang điều trị",
    MONITORING: "Theo dõi",
    DISCHARGED: "Xuất viện",
  };
  return map[status] ?? "Theo dõi";
}

function mapAppointmentStatus(
  status: string
): "Đã xác nhận" | "Chờ xác nhận" | "Hoàn tất" | "Hủy" {
  const map: Record<string, "Đã xác nhận" | "Chờ xác nhận" | "Hoàn tất" | "Hủy"> = {
    CONFIRMED: "Đã xác nhận",
    PENDING: "Chờ xác nhận",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Hủy",
  };
  return map[status] ?? "Chờ xác nhận";
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const dayAfterStart = new Date(tomorrowStart);
  dayAfterStart.setDate(dayAfterStart.getDate() + 1);

  const dStart = new Date(d.setHours(0, 0, 0, 0));

  if (dStart.getTime() === todayStart.getTime()) return "Hôm nay";
  if (dStart.getTime() === tomorrowStart.getTime()) return "Ngày mai";

  const diffMs = todayStart.getTime() - dStart.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 1) return "Hôm qua";
  if (diffDays === 2) return "2 ngày trước";
  if (diffDays === 3) return "3 ngày trước";
  if (diffDays < 14) return `${diffDays} ngày trước`;
  return `${Math.round(diffDays / 7)} tuần trước`;
}
