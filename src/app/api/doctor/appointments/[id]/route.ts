import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STATUS_TO_DB: Record<string, "CONFIRMED" | "PENDING" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"> = {
  "Chờ xác nhận": "PENDING",
  "Đã xác nhận": "CONFIRMED",
  "Đã check-in": "CHECKED_IN",
  "Đang khám": "IN_PROGRESS",
  "Hoàn tất": "COMPLETED",
  "Hủy": "CANCELLED",
};

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, notes, diagnosis } = body;

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // Validate status if provided
    const dbStatus = status ? STATUS_TO_DB[status] : undefined;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(dbStatus && { status: dbStatus }),
        ...(notes !== undefined && { notes }),
        ...(diagnosis !== undefined && { diagnosis }),
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
    });

    console.log(`[API] /doctor/appointments/${id} — updated appointment`);

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(`[API] /doctor/appointments/[id] error:`, error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 },
    );
  }
}
