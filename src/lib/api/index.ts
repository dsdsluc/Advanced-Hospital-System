import { headers } from "next/headers";
import type {
  Appointment,
  DashboardStats,
  Department,
  Doctor,
  Patient,
  RevenuePoint,
} from "@/lib/api/types";

// Base URL for internal API routes.
// Server Components: construct absolute URL from request headers.
// Works on localhost:3000, Vercel, and any self-hosted deployment.
function apiUrl(path: string): string {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}/api${path}`;
}

export async function getDashboard(): Promise<{
  stats: DashboardStats;
  revenue: RevenuePoint[];
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
}> {
  const res = await fetch(apiUrl("/admin/dashboard"), {
    cache: "no-store", // always fresh data on dashboard
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export async function listPatients(): Promise<Patient[]> {
  const res = await fetch(apiUrl("/admin/patients"), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export async function listDoctors(): Promise<Doctor[]> {
  const res = await fetch(apiUrl("/admin/doctors"), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function listAppointments(): Promise<Appointment[]> {
  const res = await fetch(apiUrl("/admin/appointments"), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function listDepartments(): Promise<Department[]> {
  const res = await fetch(apiUrl("/admin/departments"), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch departments");
  return res.json();
}
