import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_TO_VI: Record<string, "Đang điều trị" | "Theo dõi" | "Xuất viện"> = {
  TREATING: "Đang điều trị",
  MONITORING: "Theo dõi",
  DISCHARGED: "Xuất viện",
};

const STATUS_FROM_VI: Record<string, "TREATING" | "MONITORING" | "DISCHARGED"> = {
  "Đang điều trị": "TREATING",
  "Theo dõi": "MONITORING",
  "Xuất viện": "DISCHARGED",
};

function formatRelativeDate(date: Date | null): string {
  if (!date) return "Chưa khám";
  const now = new Date();
  const d = new Date(date);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const dStart = new Date(d.setHours(0, 0, 0, 0));
  const diffMs = todayStart.getTime() - dStart.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 14) return `${diffDays} ngày trước`;
  return `${Math.round(diffDays / 7)} tuần trước`;
}

type RouteContext = { params: Promise<{ id: string }> };

// ── PUT /api/admin/patients/[id] ──────────────────────────────────────────────

export async function PUT(req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { name, gender, age, phone, status } = body as {
      name?: string; gender?: string; age?: number;
      phone?: string; status?: string;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Tên bệnh nhân là bắt buộc" }, { status: 400 });
    if (gender !== "Nam" && gender !== "Nữ") return NextResponse.json({ error: "Giới tính không hợp lệ" }, { status: 400 });
    if (!age || age < 1 || age > 120) return NextResponse.json({ error: "Tuổi phải từ 1 đến 120" }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ error: "Số điện thoại là bắt buộc" }, { status: 400 });

    const dbStatus = status ? (STATUS_FROM_VI[status] ?? "MONITORING") : "MONITORING";

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        name: name.trim(),
        gender,
        age,
        phone: phone.trim(),
        status: dbStatus,
      },
    });

    const result = {
      id: patient.id,
      code: patient.code,
      name: patient.name,
      gender: patient.gender as "Nam" | "Nữ",
      age: patient.age,
      phone: patient.phone,
      avatarUrl: patient.avatarUrl,
      status: STATUS_TO_VI[patient.status] ?? "Theo dõi",
      lastVisit: formatRelativeDate(patient.lastVisit),
    };

    console.log(`[API] /admin/patients/${id} PUT — updated`);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[API] /admin/patients PUT error:`, error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

// ── DELETE /api/admin/patients/[id] ──────────────────────────────────────────

export async function DELETE(_req: NextRequest, ctx: RouteContext) {
  try {
    const { id } = await ctx.params;

    // Remove related appointments first to avoid FK violation
    await prisma.appointment.deleteMany({ where: { patientId: id } });
    await prisma.patient.delete({ where: { id } });

    console.log(`[API] /admin/patients/${id} DELETE — removed`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] /admin/patients DELETE error:`, error);
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
