import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AVAIL_TO_VI: Record<string, "Sẵn sàng" | "Bận" | "Nghỉ"> = {
  AVAILABLE: "Sẵn sàng",
  BUSY: "Bận",
  OFF: "Nghỉ",
};

const AVAIL_FROM_VI: Record<string, "AVAILABLE" | "BUSY" | "OFF"> = {
  "Sẵn sàng": "AVAILABLE",
  Bận: "BUSY",
  Nghỉ: "OFF",
};

// GET /api/doctor/profile?doctorId=
export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json({ error: "doctorId is required" }, { status: 400 });
    }

    const [doctor, totalAppointments, completedAppointments, uniquePatients] = await Promise.all([
      prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          department: { select: { id: true, name: true } },
          user: { select: { email: true } },
        },
      }),
      prisma.appointment.count({ where: { doctorId } }),
      prisma.appointment.count({ where: { doctorId, status: "COMPLETED" } }),
      prisma.appointment.findMany({
        where: { doctorId },
        select: { patientId: true },
        distinct: ["patientId"],
      }),
    ]);

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      avatarUrl: doctor.avatarUrl,
      availability: AVAIL_TO_VI[doctor.availability] ?? "Sẵn sàng",
      rating: doctor.rating,
      department: doctor.department ?? null,
      email: doctor.user?.email ?? "",
      phone: doctor.phone,
      bio: doctor.bio,
      room: doctor.room,
      joinedYear: doctor.joinedYear ?? null,
      education: doctor.education as { degree: string; school: string; year: string }[],
      certifications: doctor.certifications,
      stats: {
        totalAppointments,
        completedAppointments,
        totalPatients: uniquePatients.length,
      },
    });
  } catch (error) {
    console.error("[API] /doctor/profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PUT /api/doctor/profile?doctorId=
export async function PUT(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId");
    if (!doctorId?.trim()) {
      return NextResponse.json({ error: "doctorId is required" }, { status: 400 });
    }

    const body = await req.json();
    const { name, specialization, availability, avatarUrl, phone, bio, room, joinedYear, education, certifications } = body as {
      name?: string;
      specialization?: string;
      availability?: string;
      avatarUrl?: string;
      phone?: string;
      bio?: string;
      room?: string;
      joinedYear?: number | null;
      education?: { degree: string; school: string; year: string }[];
      certifications?: string[];
    };

    if (name !== undefined && !name?.trim()) {
      return NextResponse.json({ error: "Tên bác sĩ không thể trống" }, { status: 400 });
    }
    if (specialization !== undefined && !specialization?.trim()) {
      return NextResponse.json({ error: "Chuyên khoa không thể trống" }, { status: 400 });
    }

    const dbAvail = availability ? (AVAIL_FROM_VI[availability] ?? "AVAILABLE") : undefined;

    const doctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(name          && { name: name.trim() }),
        ...(specialization && { specialization: specialization.trim() }),
        ...(dbAvail        && { availability: dbAvail }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl ?? "" }),
        ...(phone     !== undefined && { phone: phone.trim() }),
        ...(bio       !== undefined && { bio: bio.trim() }),
        ...(room      !== undefined && { room: room.trim() }),
        ...(joinedYear !== undefined && { joinedYear }),
        ...(education  !== undefined && { education }),
        ...(certifications !== undefined && { certifications }),
      },
      include: {
        department: { select: { id: true, name: true } },
        user: { select: { email: true } },
      },
    });

    const [totalAppointments, completedAppointments, uniquePatients] = await Promise.all([
      prisma.appointment.count({ where: { doctorId } }),
      prisma.appointment.count({ where: { doctorId, status: "COMPLETED" } }),
      prisma.appointment.findMany({ where: { doctorId }, select: { patientId: true }, distinct: ["patientId"] }),
    ]);

    return NextResponse.json({
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      avatarUrl: doctor.avatarUrl,
      availability: AVAIL_TO_VI[doctor.availability] ?? "Sẵn sàng",
      rating: doctor.rating,
      department: doctor.department ?? null,
      email: doctor.user?.email ?? "",
      phone: doctor.phone,
      bio: doctor.bio,
      room: doctor.room,
      joinedYear: doctor.joinedYear ?? null,
      education: doctor.education,
      certifications: doctor.certifications,
      stats: { totalAppointments, completedAppointments, totalPatients: uniquePatients.length },
    });
  } catch (error) {
    console.error("[API] /doctor/profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
