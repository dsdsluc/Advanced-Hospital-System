import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  Pill,
  User,
} from "lucide-react";
import type React from "react";

export type PatientNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const PATIENT_NAV_ITEMS: PatientNavItem[] = [
  { title: "Tổng quan", href: "/patient/dashboard", icon: Home },
  { title: "Lịch hẹn", href: "/patient/appointments", icon: CalendarDays },
  { title: "Hồ sơ sức khỏe", href: "/patient/health-records", icon: ClipboardList },
  { title: "Kết quả xét nghiệm", href: "/patient/test-results", icon: FileText },
  { title: "Đơn thuốc", href: "/patient/prescriptions", icon: Pill },
  { title: "Thanh toán", href: "/patient/billing", icon: CreditCard },
  { title: "Hồ sơ cá nhân", href: "/patient/profile", icon: User },
];

export const PATIENT_BRAND = {
  name: "QuanCare",
  tagline: "Cổng thông tin bệnh nhân",
};

export const PATIENT_USER = {
  name: "Nguyễn Văn An",
  initials: "NA",
  dob: "15/03/1990",
  patientId: "BN-2024-0158",
  bloodType: "O+",
  phone: "0912 345 678",
  lastVisit: "22/03/2026",
};
