import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email with role DOCTOR
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), role: "DOCTOR" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Plain text password comparison (no hashing)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Find associated doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { userId: user.id },
      include: { department: true },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 },
      );
    }

    console.log(`[API] /auth/doctor-login — login successful for ${email}`);

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor.id,
        userId: doctor.userId,
        name: doctor.name,
        email: user.email,
        specialization: doctor.specialization,
        availability: doctor.availability,
        rating: doctor.rating,
        avatarUrl: doctor.avatarUrl,
        department: doctor.department
          ? {
              id: doctor.department.id,
              name: doctor.department.name,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[API] /auth/doctor-login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
