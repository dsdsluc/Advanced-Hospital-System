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

function formatDoctor(d: {
  id: string; name: string; specialization: string;
  avatarUrl: string; availability: string; rating: number;
  userId?: string | null;
  user?: { email: string } | null;
}) {
  return {
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    avatarUrl: d.avatarUrl,
    availability: AVAIL_TO_VI[d.availability] ?? "Sẵn sàng",
    rating: d.rating,
    email: d.user?.email ?? "",
    hasLogin: !!d.userId,
  };
}

// ── GET /api/admin/doctors ─────────────────────────────────────────────────────

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: "asc" },
      include: { user: { select: { email: true } } },
    });
    const data = doctors.map(formatDoctor);
    console.log(`[API] /admin/doctors GET — fetched ${data.length} doctors`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] /admin/doctors GET error:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

// ── POST /api/admin/doctors ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, specialization, availability, rating, avatarUrl, email, password } = body as {
      name?: string; specialization?: string; availability?: string;
      rating?: number; avatarUrl?: string; email?: string; password?: string;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Tên bác sĩ là bắt buộc" }, { status: 400 });
    if (!specialization?.trim()) return NextResponse.json({ error: "Chuyên khoa là bắt buộc" }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: "Email đăng nhập là bắt buộc" }, { status: 400 });
    if (!password?.trim() || password.length < 6) return NextResponse.json({ error: "Mật khẩu phải ít nhất 6 ký tự" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) return NextResponse.json({ error: "Email này đã được sử dụng" }, { status: 409 });

    const dbAvail = availability ? (AVAIL_FROM_VI[availability] ?? "AVAILABLE") : "AVAILABLE";
    const dbRating = rating != null ? Math.min(5, Math.max(1, Number(rating))) : 5.0;

    const doctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.trim().toLowerCase(),
          password: password.trim(),
          name: name.trim(),
          role: "DOCTOR",
        },
      });
      return tx.doctor.create({
        data: {
          name: name.trim(),
          specialization: specialization.trim(),
          availability: dbAvail,
          rating: dbRating,
          avatarUrl: avatarUrl?.trim() ?? "",
          userId: user.id,
        },
      });
    });

    console.log(`[API] /admin/doctors POST — created doctor ${doctor.id} with login account`);
    return NextResponse.json(formatDoctor(doctor), { status: 201 });
  } catch (error) {
    console.error("[API] /admin/doctors POST error:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
