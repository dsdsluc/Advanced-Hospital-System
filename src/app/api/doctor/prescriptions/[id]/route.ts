import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// DELETE /api/doctor/prescriptions/[id]
export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] /doctor/prescriptions/[id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 });
  }
}
