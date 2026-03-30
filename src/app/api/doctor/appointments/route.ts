// Doctor appointments - list of doctor's appointments
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
  if (diffDays < 14) return `${diffDays} ngày trước`;
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
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 },
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            code: true,
            age: true,
            gender: true,
            phone: true,
          },
        },
        department: { select: { name: true } },
      },
    });

    const data = appointments.map((a) => ({
      id: a.id,
      date: formatRelativeDate(a.appointmentDate),
      appointmentDate: a.appointmentDate.toISOString(),
      time: a.appointmentTime,
      patientId: a.patient.id,
      patientName: a.patient.name,
      patientCode: a.patient.code,
      patientAge: a.patient.age,
      patientGender: a.patient.gender,
      patientPhone: a.patient.phone,
      department: a.department.name,
      status: STATUS_TO_VI[a.status] ?? "Chờ xác nhận",
      notes: a.notes ?? "",
      diagnosis: a.diagnosis ?? "",
    }));

    console.log(
      `[API] /doctor/appointments — fetched ${data.length} appointments for doctor ${doctorId}`,
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /doctor/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}
