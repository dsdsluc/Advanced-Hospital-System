// Doctor patients - list of unique patients the doctor has seen
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_TO_VI: Record<string, "Đang điều trị" | "Theo dõi" | "Xuất viện"> =
  {
    TREATING: "Đang điều trị",
    MONITORING: "Theo dõi",
    DISCHARGED: "Xuất viện",
  };

function formatRelativeDate(date: Date | null): string {
  if (!date) return "Chưa khám";
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const dStart = new Date(d.setHours(0, 0, 0, 0));
  const diffMs = todayStart.getTime() - dStart.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 14) return `${diffDays} ngày trước`;
  return `${Math.round(diffDays / 7)} tuần trước`;
}

export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 },
      );
    }

    // Get unique patients this doctor has seen
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      select: { patientId: true },
      distinct: ["patientId"],
    });

    const patientIds = appointments.map((a) => a.patientId);

    const patients = await prisma.patient.findMany({
      where: { id: { in: patientIds } },
      orderBy: { name: "asc" },
    });

    // Count appointments per patient for this doctor
    const apptCounts = await prisma.appointment.groupBy({
      by: ["patientId"],
      where: { doctorId, patientId: { in: patientIds } },
      _count: { id: true },
    });
    const countMap = Object.fromEntries(apptCounts.map((r) => [r.patientId, r._count.id]));

    const data = patients.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      gender: p.gender as "Nam" | "Nữ",
      age: p.age,
      phone: p.phone,
      avatarUrl: p.avatarUrl,
      status: STATUS_TO_VI[p.status] ?? "Theo dõi",
      lastVisit: formatRelativeDate(p.lastVisit),
      totalAppointments: countMap[p.id] ?? 0,
    }));

    console.log(
      `[API] /doctor/patients — found ${data.length} patients for doctor ${doctorId}`,
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /doctor/patients error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 },
    );
  }
}
