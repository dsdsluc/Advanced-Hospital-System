import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function formatDepartment(dep: {
  id: string; name: string; capacity: number; occupied: number;
  doctors: { name: string }[];
}) {
  return {
    id: dep.id,
    name: dep.name,
    head: dep.doctors[0]?.name ?? "Chưa phân công",
    capacity: dep.capacity,
    occupied: dep.occupied,
  };
}

const departmentInclude = {
  doctors: {
    select: { name: true },
    orderBy: { rating: "desc" as const },
    take: 1,
  },
};

// ── GET /api/admin/departments ─────────────────────────────────────────────────

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: departmentInclude,
    });
    const data = await Promise.all(departments.map(formatDepartment));
    console.log(`[API] /admin/departments GET — fetched ${data.length} departments`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /admin/departments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

// ── POST /api/admin/departments ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, capacity, occupied } = body as {
      name?: string; capacity?: number; occupied?: number;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Tên khoa là bắt buộc" }, { status: 400 });
    if (!capacity || capacity < 1) return NextResponse.json({ error: "Sức chứa phải lớn hơn 0" }, { status: 400 });

    const existing = await prisma.department.findUnique({ where: { name: name.trim() } });
    if (existing) return NextResponse.json({ error: "Tên khoa đã tồn tại" }, { status: 409 });

    const dept = await prisma.department.create({
      data: {
        name: name.trim(),
        capacity,
        occupied: occupied ?? 0,
      },
      include: departmentInclude,
    });

    console.log(`[API] /admin/departments POST — created ${dept.id}`);
    return NextResponse.json(await formatDepartment(dept), { status: 201 });
  } catch (error) {
    console.error("[API] /admin/departments POST error:", error);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
