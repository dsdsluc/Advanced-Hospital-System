import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/admin/appointments/[id]/checkin — CONFIRMED → CHECKED_IN
export async function POST(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    if (existing.status !== "CONFIRMED") {
      return NextResponse.json({ error: "Chỉ có thể check-in lịch đã xác nhận" }, { status: 400 });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: "CHECKED_IN" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] /admin/appointments/[id]/checkin error:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
