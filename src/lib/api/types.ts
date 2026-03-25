export type PatientStatus = "Đang điều trị" | "Theo dõi" | "Xuất viện";

export type Patient = {
  id: string;
  code: string;
  name: string;
  gender: "Nam" | "Nữ";
  age: number;
  phone: string;
  avatarUrl: string;
  status: PatientStatus;
  lastVisit: string;
};

export type DoctorAvailability = "Sẵn sàng" | "Bận" | "Nghỉ";

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  avatarUrl: string;
  availability: DoctorAvailability;
  rating: number;
};

export type AppointmentStatus = "Đã xác nhận" | "Chờ xác nhận" | "Hoàn tất" | "Hủy";

export type Appointment = {
  id: string;
  date: string;
  time: string;
  patientName: string;
  doctorName: string;
  department: string;
  status: AppointmentStatus;
};

export type Department = {
  id: string;
  name: string;
  head: string;
  capacity: number;
  occupied: number;
};

export type DashboardStats = {
  patients: number;
  doctors: number;
  appointments: number;
  revenue: number;
  revenueChangePct: number;
};

export type RevenuePoint = {
  label: string;
  value: number;
};

