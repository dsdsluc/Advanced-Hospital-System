import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

// GET /api/patient/prescriptions?patientId=
export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    if (!patientId) {
      return NextResponse.json({ error: "patientId required" }, { status: 400 });
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        prescriptions: { orderBy: { createdAt: "asc" } },
        doctor: { select: { name: true } },
        appointment: { select: { appointmentDate: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = records
      .filter((r) => r.prescriptions.length > 0)
      .flatMap((r) =>
        r.prescriptions.map((p) => ({
          id: p.id,
          medicineName: p.medicineName,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          notes: p.notes,
          doctorName: `BS. ${r.doctor.name}`,
          visitDate: formatDate(r.appointment.appointmentDate),
          medicalRecordId: r.id,
        })),
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] /patient/prescriptions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}
