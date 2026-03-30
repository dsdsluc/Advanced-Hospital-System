import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_SHIFTS = ["MORNING", "AFTERNOON"];

function toDateUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// GET /api/doctor/schedule?doctorId=&year=&month=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const doctorId = searchParams.get("doctorId");
    const year  = parseInt(searchParams.get("year")  ?? "");
    const month = parseInt(searchParams.get("month") ?? "");

    if (!doctorId?.trim() || isNaN(year) || isNaN(month)) {
      return NextResponse.json({ error: "doctorId, year, month required" }, { status: 400 });
    }

    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd   = new Date(Date.UTC(year, month,     1));

    const [schedules, appointments] = await Promise.all([
      prisma.doctorSchedule.findMany({
        where: { doctorId, date: { gte: monthStart, lt: monthEnd } },
      }),
      prisma.appointment.findMany({
        where: { doctorId, appointmentDate: { gte: monthStart, lt: monthEnd }, status: { notIn: ["CANCELLED"] } },
        select: { appointmentDate: true },
      }),
    ]);

    const apptCounts: Record<number, number> = {};
    for (const a of appointments) {
      const day = new Date(a.appointmentDate).getUTCDate();
      apptCounts[day] = (apptCounts[day] ?? 0) + 1;
    }

    const scheduleMap: Record<number, { id: string; shifts: string[]; room: string; note: string }> = {};
    for (const s of schedules) {
      scheduleMap[new Date(s.date).getUTCDate()] = {
        id: s.id,
        shifts: s.shifts,
        room: s.room,
        note: s.note,
      };
    }

    return NextResponse.json({ scheduleMap, apptCounts, defaultShifts: DEFAULT_SHIFTS });
  } catch (error) {
    console.error("[API] /doctor/schedule GET error:", error);
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
  }
}

// PUT /api/doctor/schedule — upsert a day
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, date, shifts, room, note } = body as {
      doctorId: string; date: string; shifts: string[]; room?: string; note?: string;
    };

    if (!doctorId || !date || !Array.isArray(shifts) || shifts.length === 0) {
      return NextResponse.json({ error: "doctorId, date, shifts required" }, { status: 400 });
    }

    const dateUTC = toDateUTC(date);

    const record = await prisma.doctorSchedule.upsert({
      where:  { doctorId_date: { doctorId, date: dateUTC } },
      create: { doctorId, date: dateUTC, shifts, room: room ?? "", note: note ?? "" },
      update: { shifts, room: room ?? "", note: note ?? "" },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("[API] /doctor/schedule PUT error:", error);
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}

// DELETE /api/doctor/schedule?doctorId=&date= — reset day to default
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const doctorId = searchParams.get("doctorId");
    const date     = searchParams.get("date");

    if (!doctorId || !date) {
      return NextResponse.json({ error: "doctorId and date required" }, { status: 400 });
    }

    await prisma.doctorSchedule.deleteMany({
      where: { doctorId, date: toDateUTC(date) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] /doctor/schedule DELETE error:", error);
    return NextResponse.json({ error: "Failed to reset schedule" }, { status: 500 });
  }
}
