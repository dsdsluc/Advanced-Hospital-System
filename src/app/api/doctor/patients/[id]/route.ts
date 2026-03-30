import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_TO_VI: Record<
  string,
  "Đã xác nhận" | "Chờ xác nhận" | "Hoàn tất" | "Hủy"
> = {
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Hủy",
};

const PATIENT_STATUS_TO_VI: Record<
  string,
  "Đang điều trị" | "Theo dõi" | "Xuất viện"
> = {
  TREATING: "Đang điều trị",
  MONITORING: "Theo dõi",
  DISCHARGED: "Xuất viện",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const doctorId = req.nextUrl.searchParams.get("doctorId");

    if (!id?.trim() || !doctorId?.trim()) {
      return NextResponse.json(
        { error: "Patient ID and Doctor ID are required" },
        { status: 400 },
      );
    }

    // Get patient details
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          where: { doctorId },
          orderBy: { appointmentDate: "desc" },
          include: {
            doctor: { select: { name: true, specialization: true } },
            department: { select: { name: true } },
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const medicalRecords = patient.appointments.map((a) => ({
      id: a.id,
      date: a.appointmentDate.toISOString().split("T")[0],
      time: a.appointmentTime,
      doctor: a.doctor.name,
      specialization: a.doctor.specialization,
      department: a.department.name,
      status: STATUS_TO_VI[a.status] ?? "Chờ xác nhận",
      diagnosis: a.diagnosis || "N/A",
      notes: a.notes,
    }));

    return NextResponse.json({
      patient: {
        id: patient.id,
        code: patient.code,
        name: patient.name,
        gender: patient.gender === "Nam" ? "Nam" : "Nữ",
        age: patient.age,
        phone: patient.phone,
        avatarUrl: patient.avatarUrl,
        status: PATIENT_STATUS_TO_VI[patient.status] ?? "Theo dõi",
        totalAppointments: patient.appointments.length,
        lastVisit: patient.lastVisit
          ? patient.lastVisit.toISOString().split("T")[0]
          : "N/A",
      },
      medicalRecords,
    });
  } catch (error) {
    console.error("[API] /doctor/patients/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient details" },
      { status: 500 },
    );
  }
}
