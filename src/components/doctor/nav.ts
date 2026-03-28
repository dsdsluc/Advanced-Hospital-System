import {
  CalendarDays,
  ClipboardList,
  Clock,
  LayoutDashboard,
  Pill,
  User,
  Users,
} from "lucide-react";
import type React from "react";

export type DoctorNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const DOCTOR_NAV_ITEMS: DoctorNavItem[] = [
  { title: "Tổng quan", href: "/doctor/dashboard", icon: LayoutDashboard },
  { title: "Lịch khám", href: "/doctor/appointments", icon: CalendarDays },
  { title: "Bệnh nhân của tôi", href: "/doctor/patients", icon: Users },
  { title: "Hồ sơ bệnh án", href: "/doctor/medical-records", icon: ClipboardList },
  { title: "Kê đơn thuốc", href: "/doctor/prescriptions", icon: Pill },
  { title: "Lịch làm việc", href: "/doctor/schedule", icon: Clock },
  { title: "Hồ sơ cá nhân", href: "/doctor/profile", icon: User },
];

export const DOCTOR_BRAND = {
  name: "QuanCare",
  tagline: "Cổng thông tin bác sĩ",
};

export const DOCTOR_USER = {
  name: "Trần Thị Lan",
  role: "Bác sĩ Nội khoa",
  department: "Khoa Nội",
  avatar:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
  code: "BS-0042",
};
