import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Shared helpers ────────────────────────────────────────────────────────────

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

function mapStatus(status: string) {
  return STATUS_TO_VI[status] ?? "Theo dõi";
}

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
  if (diffDays === 2) return "2 ngày trước";
  if (diffDays === 3) return "3 ngày trước";
  if (diffDays < 14) return `${diffDays} ngày trước`;
  return `${Math.round(diffDays / 7)} tuần trước`;
}

function formatPatient(p: {
  id: string; code: string; name: string; gender: string;
  age: number; phone: string; avatarUrl: string;
  status: string; lastVisit: Date | null;
}) {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    gender: p.gender as "Nam" | "Nữ",
    age: p.age,
    phone: p.phone,
    avatarUrl: p.avatarUrl,
    status: mapStatus(p.status),
    lastVisit: formatRelativeDate(p.lastVisit),
  };
}

// ── GET /api/admin/patients ────────────────────────────────────────────────────

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
    const data = patients.map(formatPatient);
    console.log(`[API] /admin/patients GET — fetched ${data.length} patients`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /admin/patients GET error:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

// ── POST /api/admin/patients ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gender, age, phone, status } = body as {
      name?: string; gender?: string; age?: number;
      phone?: string; status?: string;
    };

    // Basic validation
    if (!name?.trim()) return NextResponse.json({ error: "Tên bệnh nhân là bắt buộc" }, { status: 400 });
    if (gender !== "Nam" && gender !== "Nữ") return NextResponse.json({ error: "Giới tính không hợp lệ" }, { status: 400 });
    if (!age || age < 1 || age > 120) return NextResponse.json({ error: "Tuổi phải từ 1 đến 120" }, { status: 400 });
    if (!phone?.trim()) return NextResponse.json({ error: "Số điện thoại là bắt buộc" }, { status: 400 });

    const dbStatus = status ? (STATUS_FROM_VI[status] ?? "MONITORING") : "MONITORING";

    // Auto-generate patient code
    const count = await prisma.patient.count();
    const code = `BN-${String(count + 1).padStart(5, "0")}`;

    const patient = await prisma.patient.create({
      data: {
        code,
        name: name.trim(),
        gender,
        age,
        phone: phone.trim(),
        status: dbStatus,
        lastVisit: new Date(),
        avatarUrl: "",
      },
    });

    console.log(`[API] /admin/patients POST — created patient ${patient.id}`);
    return NextResponse.json(formatPatient(patient), { status: 201 });
  } catch (error) {
    console.error("[API] /admin/patients POST error:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
