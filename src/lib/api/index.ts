import {
  appointments,
  dashboardStats,
  departments,
  doctors,
  patients,
  revenueSeries,
} from "@/lib/api/mock-data";
import type {
  Appointment,
  DashboardStats,
  Department,
  Doctor,
  Patient,
  RevenuePoint,
} from "@/lib/api/types";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDashboard(): Promise<{
  stats: DashboardStats;
  revenue: RevenuePoint[];
  recentPatients: Patient[];
  upcomingAppointments: Appointment[];
}> {
  await sleep(450);
  return {
    stats: dashboardStats,
    revenue: revenueSeries,
    recentPatients: patients.slice(0, 5),
    upcomingAppointments: appointments.slice(0, 6),
  };
}

export async function listPatients(): Promise<Patient[]> {
  await sleep(500);
  return patients;
}

export async function listDoctors(): Promise<Doctor[]> {
  await sleep(450);
  return doctors;
}

export async function listAppointments(): Promise<Appointment[]> {
  await sleep(520);
  return appointments;
}

export async function listDepartments(): Promise<Department[]> {
  await sleep(380);
  return departments;
}

