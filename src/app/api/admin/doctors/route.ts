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
}) {
  return {
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    avatarUrl: d.avatarUrl,
    availability: AVAIL_TO_VI[d.availability] ?? "Sẵn sàng",
    rating: d.rating,
  };
}

// ── GET /api/admin/doctors ─────────────────────────────────────────────────────

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({ orderBy: { createdAt: "asc" } });
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
    const { name, specialization, availability, rating, avatarUrl } = body as {
      name?: string; specialization?: string; availability?: string;
      rating?: number; avatarUrl?: string;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Tên bác sĩ là bắt buộc" }, { status: 400 });
    if (!specialization?.trim()) return NextResponse.json({ error: "Chuyên khoa là bắt buộc" }, { status: 400 });

    const dbAvail = availability ? (AVAIL_FROM_VI[availability] ?? "AVAILABLE") : "AVAILABLE";
    const dbRating = rating != null ? Math.min(5, Math.max(1, Number(rating))) : 5.0;

    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        specialization: specialization.trim(),
        availability: dbAvail,
        rating: dbRating,
        avatarUrl: avatarUrl?.trim() ?? "",
      },
    });

    console.log(`[API] /admin/doctors POST — created doctor ${doctor.id}`);
    return NextResponse.json(formatDoctor(doctor), { status: 201 });
  } catch (error) {
    console.error("[API] /admin/doctors POST error:", error);
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
