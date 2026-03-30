// Doctor dashboard API - shows appointments today, patients, stats
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json(
        { error: "doctorId is required" },
        { status: 400 },
      );
    }

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor)
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    // Today's appointments count
    const todayAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: { gte: todayStart, lte: todayEnd },
      },
    });

    // Total patients
    const totalPatients = await prisma.appointment.groupBy({
      by: ["patientId"],
      where: { doctorId },
    });

    // Upcoming appointments (today + next 7 days)
    const upcomingStart = new Date(todayStart);
    const upcomingEnd = new Date(upcomingStart);
    upcomingEnd.setDate(upcomingEnd.getDate() + 7);

    const upcomingAppointments = await prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: { gte: upcomingStart, lte: upcomingEnd },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
    });

    // Completed appointments this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const completedThisMonth = await prisma.appointment.count({
      where: {
        doctorId,
        status: "COMPLETED",
        appointmentDate: { gte: monthStart, lte: monthEnd },
      },
    });

    return NextResponse.json({
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        rating: doctor.rating,
        availability: doctor.availability,
      },
      stats: {
        todayAppointments,
        totalPatients: totalPatients.length,
        upcomingAppointments,
        completedThisMonth,
      },
    });
  } catch (error) {
    console.error("[API] /doctor/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 },
    );
  }
}
