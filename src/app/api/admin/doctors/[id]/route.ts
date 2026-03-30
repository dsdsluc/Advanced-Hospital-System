import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AVAIL_TO_VI: Record<string, "Sẵn sàng" | "Bận" | "Nghỉ"> = {
  AVAILABLE: "Sẵn sàng",
  BUSY: "Bận",
  OFF: "Nghỉ",
};

const AVAIL_FROM_VI: Record<string, "AVAILABLE" | "BUSY" | "OFF"> = {
  "Sẵn sàng": "AVAILABLE",
  "Bận": "BUSY",
  "Nghỉ": "OFF",
};

type RouteContext = { params: Promise<{ id: string }> };

// ── PUT /api/admin/doctors/[id] ───────────────────────────────────────────────

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { name, specialization, availability, rating, avatarUrl } = body as {
      name?: string; specialization?: string; availability?: string;
      rating?: number; avatarUrl?: string;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Tên bác sĩ là bắt buộc" }, { status: 400 });
    if (!specialization?.trim()) return NextResponse.json({ error: "Chuyên khoa là bắt buộc" }, { status: 400 });

    const dbAvail = availability ? (AVAIL_FROM_VI[availability] ?? "AVAILABLE") : "AVAILABLE";
    const dbRating = rating != null ? Math.min(5, Math.max(1, Number(rating))) : 5.0;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name: name.trim(),
        specialization: specialization.trim(),
        availability: dbAvail,
        rating: dbRating,
        avatarUrl: avatarUrl?.trim() ?? "",
      },
    });

    const result = {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      avatarUrl: doctor.avatarUrl,
      availability: AVAIL_TO_VI[doctor.availability] ?? "Sẵn sàng",
      rating: doctor.rating,
    };

    console.log(`[API] /admin/doctors/${id} PUT — updated`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[API] /admin/doctors PUT error:`, error);
    return NextResponse.json({ error: "Failed to update doctor" }, { status: 500 });
  }
}

// ── DELETE /api/admin/doctors/[id] ────────────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;

    // Remove related appointments first
    await prisma.appointment.deleteMany({ where: { doctorId: id } });
    await prisma.doctor.delete({ where: { id } });

    console.log(`[API] /admin/doctors/${id} DELETE — removed`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] /admin/doctors DELETE error:`, error);
    return NextResponse.json({ error: "Failed to delete doctor" }, { status: 500 });
  }
}
