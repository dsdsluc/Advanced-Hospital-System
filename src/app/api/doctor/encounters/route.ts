import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/doctor/encounters?appointmentId=
export async function GET(req: NextRequest) {
  try {
    const appointmentId = req.nextUrl.searchParams.get("appointmentId");
    if (!appointmentId) {
      return NextResponse.json({ error: "appointmentId required" }, { status: 400 });
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
      include: { prescriptions: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(record ?? null);
  } catch (error) {
    console.error("[API] /doctor/encounters GET error:", error);
    return NextResponse.json({ error: "Failed to fetch encounter" }, { status: 500 });
  }
}

// POST /api/doctor/encounters — create medical record + optionally start consultation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointmentId, patientId, doctorId, chiefComplaint, diagnosis, treatmentPlan } = body;

    if (!appointmentId || !patientId || !doctorId) {
      return NextResponse.json({ error: "appointmentId, patientId, doctorId required" }, { status: 400 });
    }

    const record = await prisma.medicalRecord.upsert({
      where: { appointmentId },
      create: { appointmentId, patientId, doctorId, chiefComplaint: chiefComplaint ?? "", diagnosis: diagnosis ?? "", treatmentPlan: treatmentPlan ?? "" },
      update: {
        ...(chiefComplaint !== undefined && { chiefComplaint }),
        ...(diagnosis !== undefined && { diagnosis }),
        ...(treatmentPlan !== undefined && { treatmentPlan }),
      },
      include: { prescriptions: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("[API] /doctor/encounters POST error:", error);
    return NextResponse.json({ error: "Failed to save encounter" }, { status: 500 });
  }
}
