import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { availability: { not: "OFF" } },
      orderBy: { name: "asc" },
      include: { department: { select: { id: true, name: true } } },
    });

    return NextResponse.json(
      doctors.map((d) => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        avatarUrl: d.avatarUrl,
        departmentId: d.department?.id ?? "",
        department: d.department?.name ?? "---",
      })),
    );
  } catch (error) {
    console.error("[API] /patient/doctors error:", error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
