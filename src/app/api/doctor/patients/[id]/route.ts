import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const APPT_STATUS_TO_VI: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đã check-in",
  IN_PROGRESS: "Đang khám",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

const PATIENT_STATUS_TO_VI: Record<string, "Đang điều trị" | "Theo dõi" | "Xuất viện"> = {
  TREATING: "Đang điều trị",
  MONITORING: "Theo dõi",
  DISCHARGED: "Xuất viện",
};

const PATIENT_STATUS_FROM_VI: Record<string, "TREATING" | "MONITORING" | "DISCHARGED"> = {
  "Đang điều trị": "TREATING",
  "Theo dõi": "MONITORING",
  "Xuất viện": "DISCHARGED",
};

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const doctorId = req.nextUrl.searchParams.get("doctorId");

    if (!id?.trim() || !doctorId?.trim()) {
      return NextResponse.json({ error: "Patient ID and Doctor ID are required" }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          where: { doctorId },
          orderBy: { appointmentDate: "desc" },
          include: {
            doctor: { select: { name: true, specialization: true } },
            department: { select: { name: true } },
            medicalRecord: {
              include: {
                prescriptions: { select: { id: true, medicineName: true, dosage: true, frequency: true, duration: true } },
              },
            },
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const medicalRecords = patient.appointments.map((a) => ({
      id: a.id,
      date: formatDate(a.appointmentDate),
      time: a.appointmentTime,
      doctor: a.doctor.name,
      specialization: a.doctor.specialization,
      department: a.department.name,
      status: APPT_STATUS_TO_VI[a.status] ?? "Chờ xác nhận",
      diagnosis: a.medicalRecord?.diagnosis || a.diagnosis || "",
      chiefComplaint: a.medicalRecord?.chiefComplaint || "",
      treatmentPlan: a.medicalRecord?.treatmentPlan || "",
      notes: a.notes,
      prescriptions: a.medicalRecord?.prescriptions ?? [],
    }));

    return NextResponse.json({
      patient: {
        id: patient.id,
        code: patient.code,
        name: patient.name,
        gender: patient.gender,
        age: patient.age,
        phone: patient.phone,
        avatarUrl: patient.avatarUrl,
        status: PATIENT_STATUS_TO_VI[patient.status] ?? "Theo dõi",
        totalAppointments: patient.appointments.length,
        lastVisit: patient.lastVisit ? formatDate(patient.lastVisit) : "Chưa khám",
      },
      medicalRecords,
    });
  } catch (error) {
    console.error("[API] /doctor/patients/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch patient details" }, { status: 500 });
  }
}

// PATCH /api/doctor/patients/[id] — update patient status
export async function PATCH(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const { status } = await req.json() as { status?: string };

    if (!status || !PATIENT_STATUS_FROM_VI[status]) {
      return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: { status: PATIENT_STATUS_FROM_VI[status] },
    });

    return NextResponse.json({ status: PATIENT_STATUS_TO_VI[patient.status] ?? "Theo dõi" });
  } catch (error) {
    console.error("[API] /doctor/patients/[id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
