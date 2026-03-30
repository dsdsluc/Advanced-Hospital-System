import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

const STATUS_TO_VI: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  IN_PROGRESS: "Đang khám",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

// GET /api/doctor/prescriptions?doctorId= — all medical records with prescriptions for this doctor
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
        patient: { select: { id: true, name: true, code: true, age: true, gender: true, phone: true } },
        appointment: {
          select: {
            id: true,
            appointmentDate: true,
            appointmentTime: true,
            status: true,
            department: { select: { name: true } },
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
      patientAge: r.patient.age,
      patientGender: r.patient.gender,
      patientPhone: r.patient.phone,
      visitDate: formatDate(r.appointment.appointmentDate),
      appointmentTime: r.appointment.appointmentTime,
      appointmentStatus: STATUS_TO_VI[r.appointment.status] ?? r.appointment.status,
      department: r.appointment.department?.name ?? "",
      diagnosis: r.diagnosis,
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
    console.error("[API] /doctor/prescriptions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

// POST /api/doctor/prescriptions — add prescription to a medical record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicalRecordId, medicineName, dosage, frequency, duration, notes } = body;

    if (!medicalRecordId || !medicineName || !dosage || !frequency || !duration) {
      return NextResponse.json({ error: "medicalRecordId, medicineName, dosage, frequency, duration required" }, { status: 400 });
    }

    const prescription = await prisma.prescription.create({
      data: { medicalRecordId, medicineName, dosage, frequency, duration, notes: notes ?? "" },
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error("[API] /doctor/prescriptions POST error:", error);
    return NextResponse.json({ error: "Failed to add prescription" }, { status: 500 });
  }
}
