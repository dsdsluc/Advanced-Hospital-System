import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_TO_VI: Record<string, string> = {
  TREATING: "Đang điều trị",
  MONITORING: "Theo dõi",
  DISCHARGED: "Xuất viện",
};

export async function GET(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    if (!patientId?.trim()) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }
    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    return NextResponse.json({
      id: patient.id,
      code: patient.code,
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      phone: patient.phone,
      avatarUrl: patient.avatarUrl,
      status: STATUS_TO_VI[patient.status] ?? "Theo dõi",
    });
  } catch (error) {
    console.error("[API] /patient/profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const patientId = req.nextUrl.searchParams.get("patientId");
    if (!patientId?.trim()) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }
    const body = await req.json();
    const { name, phone, avatarUrl } = body as { name?: string; phone?: string; avatarUrl?: string };
    if (name !== undefined && !name?.trim()) {
      return NextResponse.json({ error: "Tên không được để trống" }, { status: 400 });
    }
    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl?.trim() ?? "" }),
      },
    });
    return NextResponse.json({
      id: patient.id,
      code: patient.code,
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      phone: patient.phone,
      avatarUrl: patient.avatarUrl,
      status: STATUS_TO_VI[patient.status] ?? "Theo dõi",
    });
  } catch (error) {
    console.error("[API] /patient/profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
