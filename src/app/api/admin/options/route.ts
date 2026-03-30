// Returns minimal lists of patients and doctors for use in select dropdowns
// (e.g. appointment form)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [patients, doctors] = await Promise.all([
      prisma.patient.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: "asc" },
      }),
      prisma.doctor.findMany({
        select: { id: true, name: true, specialization: true, departmentId: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ patients, doctors });
  } catch (error) {
    console.error("[API] /admin/options error:", error);
    return NextResponse.json({ error: "Failed to fetch options" }, { status: 500 });
  }
}
