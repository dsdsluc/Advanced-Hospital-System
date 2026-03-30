import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const dStart = new Date(d.setHours(0, 0, 0, 0));
  if (dStart.getTime() === todayStart.getTime()) return "Hôm nay";
  const diffMs = todayStart.getTime() - dStart.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 1) return "Hôm qua";
  if (diffDays > 0 && diffDays < 14) return `${diffDays} ngày trước`;
  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays === 1) return "Ngày mai";
    if (futureDays < 7) return `${futureDays} ngày tới`;
    return `${Math.round(futureDays / 7)} tuần tới`;
  }
  return `${Math.round(diffDays / 7)} tuần trước`;
}

const STATUS_TO_VI: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  IN_PROGRESS: "Đang khám",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    if (!patientId?.trim()) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      orderBy: [{ appointmentDate: "desc" }, { appointmentTime: "asc" }],
      include: {
        doctor: { select: { id: true, name: true, specialization: true, avatarUrl: true } },
        department: { select: { name: true } },
      },
    });
    const data = appointments.map((a) => ({
      id: a.id,
      date: formatRelativeDate(a.appointmentDate),
      rawDate: a.appointmentDate.toISOString(),
      time: a.appointmentTime,
      doctorId: a.doctor.id,
      doctorName: a.doctor.name,
      doctorSpecialization: a.doctor.specialization,
      doctorAvatarUrl: a.doctor.avatarUrl,
      department: a.department.name,
      status: STATUS_TO_VI[a.status] ?? "Chờ xác nhận",
      notes: a.notes ?? "",
      diagnosis: a.diagnosis ?? "",
    }));
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /patient/appointments error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientId, doctorId, departmentId, appointmentDate, appointmentTime } = body;

    if (!patientId || !doctorId || !departmentId || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Thiếu thông tin đặt lịch" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        departmentId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        status: "PENDING",
      },
      include: {
        doctor: { select: { name: true, specialization: true } },
        department: { select: { name: true } },
      },
    });

    console.log(`[API] /patient/appointments POST — created appointment ${appointment.id}`);
    return NextResponse.json({ success: true, id: appointment.id });
  } catch (error) {
    console.error("[API] /patient/appointments POST error:", error);
    return NextResponse.json({ error: "Không thể đặt lịch hẹn" }, { status: 500 });
  }
}
