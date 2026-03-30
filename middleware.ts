import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/doctor")) {
    const doctorCookie = req.cookies.get("doctor")?.value;
    if (!doctorCookie) {
      return NextResponse.redirect(new URL("/auth/doctor-login", req.url));
    }
  }

  if (pathname.startsWith("/patient")) {
    const patientCookie = req.cookies.get("patient")?.value;
    if (!patientCookie) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/doctor/:path*", "/patient/:path*"],
};
