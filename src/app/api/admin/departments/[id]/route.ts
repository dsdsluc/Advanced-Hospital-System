import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

const departmentInclude = {
  doctors: {
    select: { name: true },
    orderBy: { rating: "desc" as const },
    take: 1,
  },
};

// ── PUT /api/admin/departments/[id] ───────────────────────────────────────────

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { name, capacity, occupied } = body as {
      name?: string; capacity?: number; occupied?: number;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Tên khoa là bắt buộc" }, { status: 400 });
    if (!capacity || capacity < 1) return NextResponse.json({ error: "Sức chứa phải lớn hơn 0" }, { status: 400 });

    // Check name uniqueness (exclude current)
    const conflict = await prisma.department.findFirst({
      where: { name: name.trim(), NOT: { id } },
    });
    if (conflict) return NextResponse.json({ error: "Tên khoa đã tồn tại" }, { status: 409 });

    const dept = await prisma.department.update({
      where: { id },
      data: {
        name: name.trim(),
        capacity,
        occupied: occupied ?? 0,
      },
      include: departmentInclude,
    });

    const result = {
      id: dept.id,
      name: dept.name,
      head: dept.doctors[0]?.name ?? "Chưa phân công",
      capacity: dept.capacity,
      occupied: dept.occupied,
    };

    console.log(`[API] /admin/departments/${id} PUT — updated`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[API] /admin/departments PUT error:`, error);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

// ── DELETE /api/admin/departments/[id] ────────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;

    // Remove appointments and unlink doctors before deleting
    await prisma.appointment.deleteMany({ where: { departmentId: id } });
    await prisma.doctor.updateMany({
      where: { departmentId: id },
      data: { departmentId: null },
    });
    await prisma.department.delete({ where: { id } });

    console.log(`[API] /admin/departments/${id} DELETE — removed`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] /admin/departments DELETE error:`, error);
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}
