// Doctor profile - get/update own profile
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AVAIL_TO_VI: Record<string, "Sẵn sàng" | "Bận" | "Nghỉ"> = {
  AVAILABLE: "Sẵn sàng",
  BUSY: "Bận",
  OFF: "Nghỉ",
};

const AVAIL_FROM_VI: Record<string, "AVAILABLE" | "BUSY" | "OFF"> = {
  "Sẵn sàng": "AVAILABLE",
  Bận: "BUSY",
  Nghỉ: "OFF",
};

// ── GET /api/doctor/profile ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 },
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { department: { select: { id: true, name: true } } },
    });

    if (!doctor)
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    const result = {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      avatarUrl: doctor.avatarUrl,
      availability: AVAIL_TO_VI[doctor.availability] ?? "Sẵn sàng",
      rating: doctor.rating,
      department: doctor.department
        ? { id: doctor.department.id, name: doctor.department.name }
        : null,
    };

    console.log(`[API] /doctor/profile GET — retrieved doctor ${doctorId}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] /doctor/profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

// ── PUT /api/doctor/profile ────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { name, specialization, availability, rating, avatarUrl } = body as {
      name?: string;
      specialization?: string;
      availability?: string;
      rating?: number;
      avatarUrl?: string;
    };

    if (name !== undefined && !name?.trim()) {
      return NextResponse.json(
        { error: "Tên bác sĩ không thể trống" },
        { status: 400 },
      );
    }

    if (specialization !== undefined && !specialization?.trim()) {
      return NextResponse.json(
        { error: "Chuyên khoa không thể trống" },
        { status: 400 },
      );
    }

    const dbAvail = availability
      ? (AVAIL_FROM_VI[availability] ?? "AVAILABLE")
      : undefined;
    const dbRating =
      rating != null ? Math.min(5, Math.max(1, Number(rating))) : undefined;

    const doctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(name && { name: name.trim() }),
        ...(specialization && { specialization: specialization.trim() }),
        ...(dbAvail && { availability: dbAvail }),
        ...(dbRating !== undefined && { rating: dbRating }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl?.trim() ?? "" }),
      },
      include: { department: { select: { id: true, name: true } } },
    });

    const result = {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      avatarUrl: doctor.avatarUrl,
      availability: AVAIL_TO_VI[doctor.availability] ?? "Sẵn sàng",
      rating: doctor.rating,
      department: doctor.department
        ? { id: doctor.department.id, name: doctor.department.name }
        : null,
    };

    console.log(`[API] /doctor/profile PUT — updated doctor ${doctorId}`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] /doctor/profile PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
