import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

const STATUS_TO_VI: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  IN_PROGRESS: "Đang khám",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

// GET /api/doctor/medical-records?doctorId=
export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json({ error: "doctorId required" }, { status: 400 });
    }

    const records = await prisma.medicalRecord.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: { id: true, name: true, code: true, gender: true, age: true, phone: true },
        },
        appointment: {
          select: {
            id: true,
            appointmentDate: true,
            appointmentTime: true,
            status: true,
            department: { select: { id: true, name: true } },
          },
        },
        prescriptions: { orderBy: { createdAt: "asc" } },
      },
    });

    const data = records.map((r) => ({
      id: r.id,
      appointmentId: r.appointmentId,
      patientId: r.patientId,
      patientName: r.patient.name,
      patientCode: r.patient.code,
      patientGender: r.patient.gender,
      patientAge: r.patient.age,
      patientPhone: r.patient.phone,
      doctorId: r.doctorId,
      date: formatDate(r.appointment.appointmentDate),
      appointmentTime: r.appointment.appointmentTime,
      appointmentStatus: STATUS_TO_VI[r.appointment.status] ?? r.appointment.status,
      department: r.appointment.department?.name ?? "",
      departmentId: r.appointment.department?.id ?? "",
      chiefComplaint: r.chiefComplaint,
      diagnosis: r.diagnosis,
      treatmentPlan: r.treatmentPlan,
      prescriptions: r.prescriptions.map((p) => ({
        id: p.id,
        medicineName: p.medicineName,
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration,
        notes: p.notes,
      })),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /doctor/medical-records GET error:", error);
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 });
  }
}
