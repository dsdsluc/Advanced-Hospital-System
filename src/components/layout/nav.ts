import {
  Activity,
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
  Building2,
} from "lucide-react";
import type React from "react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Bệnh nhân", href: "/admin/patients", icon: Users },
  { title: "Bác sĩ", href: "/admin/doctors", icon: Stethoscope },
  { title: "Lịch hẹn", href: "/admin/appointments", icon: CalendarDays },
  { title: "Khoa phòng", href: "/admin/departments", icon: Building2 },
  { title: "Hồ sơ bệnh án", href: "/admin/medical-records", icon: ClipboardList },
  { title: "Thanh toán", href: "/admin/billing", icon: CreditCard },
  { title: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export const BRAND = {
  name: "QuanCare",
  tagline: "Quản lý bệnh viện hiện đại",
};

export const QUICK_STATUS = [
  { label: "Hệ thống", value: "Ổn định", icon: Activity },
];
