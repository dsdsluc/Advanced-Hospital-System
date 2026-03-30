import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_TO_VI: Record<string, "Đã xác nhận" | "Chờ xác nhận" | "Hoàn tất" | "Hủy"> = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

const STATUS_FROM_VI: Record<string, "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED"> = {
  "Đã xác nhận": "CONFIRMED",
  "Chờ xác nhận": "PENDING",
  "Hoàn tất": "COMPLETED",
  "Hủy": "CANCELLED",
};

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const dStart = new Date(d.setHours(0, 0, 0, 0));
  if (dStart.getTime() === todayStart.getTime()) return "Hôm nay";
  if (dStart.getTime() === tomorrowStart.getTime()) return "Ngày mai";
  const diffMs = todayStart.getTime() - dStart.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 14) return `${diffDays} ngày trước`;
  return `${Math.round(diffDays / 7)} tuần trước`;
}

type RouteContext = { params: Promise<{ id: string }> };

const appointmentInclude = {
  patient: { select: { name: true } },
  doctor: { select: { name: true } },
  department: { select: { name: true } },
} as const;

// ── PUT /api/admin/appointments/[id] ──────────────────────────────────────────

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { patientId, doctorId, appointmentDate, appointmentTime, status } = body as {
      patientId?: string; doctorId?: string;
      appointmentDate?: string; appointmentTime?: string; status?: string;
    };

    if (!patientId?.trim()) return NextResponse.json({ error: "Bệnh nhân là bắt buộc" }, { status: 400 });
    if (!doctorId?.trim()) return NextResponse.json({ error: "Bác sĩ là bắt buộc" }, { status: 400 });
    if (!appointmentDate?.trim()) return NextResponse.json({ error: "Ngày khám là bắt buộc" }, { status: 400 });
    if (!appointmentTime?.trim()) return NextResponse.json({ error: "Giờ khám là bắt buộc" }, { status: 400 });
    if (!/^\d{2}:\d{2}$/.test(appointmentTime)) return NextResponse.json({ error: "Định dạng giờ không hợp lệ (HH:MM)" }, { status: 400 });

    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) return NextResponse.json({ error: "Ngày khám không hợp lệ" }, { status: 400 });

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) return NextResponse.json({ error: "Bác sĩ không tồn tại" }, { status: 404 });
    if (!doctor.departmentId) return NextResponse.json({ error: "Bác sĩ chưa được gán khoa" }, { status: 400 });

    const dbStatus = status ? (STATUS_FROM_VI[status] ?? "PENDING") : "PENDING";

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: parsedDate,
        appointmentTime,
        patientId,
        doctorId,
        departmentId: doctor.departmentId,
        status: dbStatus,
      },
      include: appointmentInclude,
    });

    const result = {
      id: appointment.id,
      date: formatRelativeDate(appointment.appointmentDate),
      time: appointment.appointmentTime,
      patientName: appointment.patient.name,
      doctorName: appointment.doctor.name,
      department: appointment.department.name,
      status: STATUS_TO_VI[appointment.status] ?? "Chờ xác nhận",
    };

    console.log(`[API] /admin/appointments/${id} PUT — updated`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[API] /admin/appointments PUT error:`, error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

// ── DELETE /api/admin/appointments/[id] ───────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    await prisma.appointment.delete({ where: { id } });
    console.log(`[API] /admin/appointments/${id} DELETE — removed`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] /admin/appointments DELETE error:`, error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
