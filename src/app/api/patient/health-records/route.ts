import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const STATUS_TO_VI: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    if (!patientId?.trim()) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }
    const records = await prisma.appointment.findMany({
      where: {
        patientId,
        OR: [{ status: "COMPLETED" }, { diagnosis: { not: "" } }],
      },
      orderBy: { appointmentDate: "desc" },
      include: {
        doctor: { select: { name: true, specialization: true } },
        department: { select: { name: true } },
      },
    });
    const data = records.map((a) => ({
      id: a.id,
      date: formatDate(a.appointmentDate),
      time: a.appointmentTime,
      doctorName: a.doctor.name,
      doctorSpecialization: a.doctor.specialization,
      department: a.department.name,
      status: STATUS_TO_VI[a.status] ?? "Chờ xác nhận",
      diagnosis: a.diagnosis ?? "",
      notes: a.notes ?? "",
    }));
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /patient/health-records error:", error);
    return NextResponse.json({ error: "Failed to fetch health records" }, { status: 500 });
  }
}
