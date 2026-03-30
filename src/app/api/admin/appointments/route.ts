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

function formatAppointment(a: {
  id: string; appointmentDate: Date; appointmentTime: string; status: string;
  patientId: string; doctorId: string;
  patient: { name: string }; doctor: { name: string }; department: { name: string };
}) {
  return {
    id: a.id,
    date: formatRelativeDate(a.appointmentDate),
    time: a.appointmentTime,
    patientName: a.patient.name,
    doctorName: a.doctor.name,
    department: a.department.name,
    status: STATUS_TO_VI[a.status] ?? "Chờ xác nhận",
    // Extra fields for edit form (not in the shared Appointment type)
    rawDate: a.appointmentDate.toISOString().split("T")[0],
    rawPatientId: a.patientId,
    rawDoctorId: a.doctorId,
  };
}

const appointmentInclude = {
  patient: { select: { name: true } },
  doctor: { select: { name: true } },
  department: { select: { name: true } },
} as const;

// ── GET /api/admin/appointments ────────────────────────────────────────────────

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: [{ appointmentDate: "asc" }, { appointmentTime: "asc" }],
      include: appointmentInclude,
    });
    const data = appointments.map(formatAppointment);
    console.log(`[API] /admin/appointments GET — fetched ${data.length} appointments`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /admin/appointments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// ── POST /api/admin/appointments ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
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

    // Verify patient and doctor exist, get doctor's department
    const [patient, doctor] = await Promise.all([
      prisma.patient.findUnique({ where: { id: patientId } }),
      prisma.doctor.findUnique({ where: { id: doctorId }, include: { department: true } }),
    ]);

    if (!patient) return NextResponse.json({ error: "Bệnh nhân không tồn tại" }, { status: 404 });
    if (!doctor) return NextResponse.json({ error: "Bác sĩ không tồn tại" }, { status: 404 });
    if (!doctor.departmentId) return NextResponse.json({ error: "Bác sĩ chưa được gán khoa" }, { status: 400 });

    const dbStatus = status ? (STATUS_FROM_VI[status] ?? "PENDING") : "PENDING";

    const appointment = await prisma.appointment.create({
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

    console.log(`[API] /admin/appointments POST — created ${appointment.id}`);
    return NextResponse.json(formatAppointment(appointment), { status: 201 });
  } catch (error) {
    console.error("[API] /admin/appointments POST error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
