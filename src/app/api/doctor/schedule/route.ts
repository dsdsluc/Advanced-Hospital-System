import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Normalise to midnight UTC for a given YYYY-MM-DD string
function toDateUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// GET /api/doctor/schedule?doctorId=&year=&month=
// Returns schedule entries + appointment counts for every day of the month
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const doctorId = searchParams.get("doctorId");
    const year = parseInt(searchParams.get("year") ?? "");
    const month = parseInt(searchParams.get("month") ?? ""); // 1-based

    if (!doctorId?.trim() || isNaN(year) || isNaN(month)) {
      return NextResponse.json({ error: "doctorId, year, month required" }, { status: 400 });
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 1)); // exclusive

    const [schedules, appointments] = await Promise.all([
      prisma.doctorSchedule.findMany({
        where: { doctorId, date: { gte: monthStart, lt: monthEnd } },
      }),
      prisma.appointment.findMany({
        where: {
          doctorId,
          appointmentDate: { gte: monthStart, lt: monthEnd },
          status: { notIn: ["CANCELLED"] },
        },
        select: { appointmentDate: true },
      }),
    ]);

    // Count appointments per day-of-month
    const apptCounts: Record<number, number> = {};
    for (const a of appointments) {
      const day = new Date(a.appointmentDate).getUTCDate();
      apptCounts[day] = (apptCounts[day] ?? 0) + 1;
    }

    const scheduleMap: Record<number, (typeof schedules)[0]> = {};
    for (const s of schedules) {
      scheduleMap[new Date(s.date).getUTCDate()] = s;
    }

    return NextResponse.json({ scheduleMap, apptCounts });
  } catch (error) {
    console.error("[API] /doctor/schedule GET error:", error);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}

// PUT /api/doctor/schedule — upsert a day's schedule
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, date, shift, room, timeFrom, timeTo, note } = body;

    if (!doctorId || !date || !shift) {
      return NextResponse.json({ error: "doctorId, date, shift required" }, { status: 400 });
    }

    const dateUTC = toDateUTC(date);

    const record = await prisma.doctorSchedule.upsert({
      where: { doctorId_date: { doctorId, date: dateUTC } },
      create: { doctorId, date: dateUTC, shift, room: room ?? "", timeFrom: timeFrom ?? "", timeTo: timeTo ?? "", note: note ?? "" },
      update: { shift, room: room ?? "", timeFrom: timeFrom ?? "", timeTo: timeTo ?? "", note: note ?? "" },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("[API] /doctor/schedule PUT error:", error);
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}

// DELETE /api/doctor/schedule?doctorId=&date=
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    if (!doctorId || !date) {
      return NextResponse.json({ error: "doctorId and date required" }, { status: 400 });
    }

    await prisma.doctorSchedule.deleteMany({
      where: { doctorId, date: toDateUTC(date) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] /doctor/schedule DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
  }
}
