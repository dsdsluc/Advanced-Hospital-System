import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email và mật khẩu không được để trống" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        role: { in: ["PATIENT", "ADMIN"] },
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 },
      );
    }

    // ── Admin login ──────────────────────────────────────────────────────────
    if (user.role === "ADMIN") {
      const res = NextResponse.json({
        success: true,
        role: "ADMIN",
        admin: { id: user.id, name: user.name, email: user.email },
      });
      res.cookies.set("admin", "1", { path: "/", httpOnly: true, sameSite: "lax" });
      console.log(`[API] /auth/login — admin login: ${email}`);
      return res;
    }

    // ── Patient login ────────────────────────────────────────────────────────
    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ bệnh nhân" },
        { status: 404 },
      );
    }

    const res = NextResponse.json({
      success: true,
      role: "PATIENT",
      patient: {
        id: patient.id,
        userId: user.id,
        name: patient.name,
        email: user.email,
        code: patient.code,
        gender: patient.gender,
        age: patient.age,
        phone: patient.phone,
        avatarUrl: patient.avatarUrl,
        status: patient.status,
      },
    });

    res.cookies.set("patient", "1", { path: "/", httpOnly: true, sameSite: "lax" });
    console.log(`[API] /auth/login — patient login: ${email}`);
    return res;
  } catch (error) {
    console.error("[API] /auth/login error:", error);
    return NextResponse.json({ error: "Đăng nhập thất bại" }, { status: 500 });
  }
}
