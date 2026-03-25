import type {
  Appointment,
  DashboardStats,
  Department,
  Doctor,
  Patient,
  RevenuePoint,
} from "@/lib/api/types";

export const dashboardStats: DashboardStats = {
  patients: 1248,
  doctors: 86,
  appointments: 214,
  revenue: 482_500_000,
  revenueChangePct: 8.4,
};

export const revenueSeries: RevenuePoint[] = [
  { label: "T2", value: 52 },
  { label: "T3", value: 61 },
  { label: "T4", value: 58 },
  { label: "T5", value: 72 },
  { label: "T6", value: 80 },
  { label: "T7", value: 77 },
  { label: "CN", value: 69 },
];

export const patients: Patient[] = [
  {
    id: "p_001",
    code: "BN-24031",
    name: "Trần Thị Ngọc Anh",
    gender: "Nữ",
    age: 28,
    phone: "0901 234 567",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    status: "Theo dõi",
    lastVisit: "Hôm nay",
  },
  {
    id: "p_002",
    code: "BN-24032",
    name: "Nguyễn Văn Hùng",
    gender: "Nam",
    age: 41,
    phone: "0912 980 112",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
    status: "Đang điều trị",
    lastVisit: "Hôm qua",
  },
  {
    id: "p_003",
    code: "BN-24033",
    name: "Lê Minh Khánh",
    gender: "Nam",
    age: 35,
    phone: "0988 321 654",
    avatarUrl:
      "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=256&q=80",
    status: "Theo dõi",
    lastVisit: "2 ngày trước",
  },
  {
    id: "p_004",
    code: "BN-24034",
    name: "Phạm Thu Hà",
    gender: "Nữ",
    age: 52,
    phone: "0977 120 909",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
    status: "Đang điều trị",
    lastVisit: "3 ngày trước",
  },
  {
    id: "p_005",
    code: "BN-24035",
    name: "Đỗ Quốc Bảo",
    gender: "Nam",
    age: 26,
    phone: "0908 234 111",
    avatarUrl:
      "https://images.unsplash.com/photo-1520975922284-7b79d2d0b6e4?auto=format&fit=crop&w=256&q=80",
    status: "Xuất viện",
    lastVisit: "1 tuần trước",
  },
  {
    id: "p_006",
    code: "BN-24036",
    name: "Vũ Thảo My",
    gender: "Nữ",
    age: 31,
    phone: "0933 330 440",
    avatarUrl:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=256&q=80",
    status: "Theo dõi",
    lastVisit: "1 tuần trước",
  },
];

export const doctors: Doctor[] = [
  {
    id: "d_001",
    name: "BS. Nguyễn Hoàng Nam",
    specialization: "Tim mạch",
    avatarUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
    availability: "Sẵn sàng",
    rating: 4.9,
  },
  {
    id: "d_002",
    name: "BS. Lê Thu Trang",
    specialization: "Nhi khoa",
    avatarUrl:
      "https://images.unsplash.com/photo-1580281658628-4b5d96f64f0f?auto=format&fit=crop&w=256&q=80",
    availability: "Bận",
    rating: 4.8,
  },
  {
    id: "d_003",
    name: "BS. Trần Đức Minh",
    specialization: "Chẩn đoán hình ảnh",
    avatarUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80",
    availability: "Sẵn sàng",
    rating: 4.7,
  },
  {
    id: "d_004",
    name: "BS. Phạm Quỳnh Anh",
    specialization: "Da liễu",
    avatarUrl:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=256&q=80",
    availability: "Nghỉ",
    rating: 4.6,
  },
  {
    id: "d_005",
    name: "BS. Võ Thành Đạt",
    specialization: "Ngoại tổng quát",
    avatarUrl:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80",
    availability: "Bận",
    rating: 4.8,
  },
  {
    id: "d_006",
    name: "BS. Đặng Mỹ Linh",
    specialization: "Sản - Phụ khoa",
    avatarUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=256&q=80",
    availability: "Sẵn sàng",
    rating: 4.9,
  },
];

export const appointments: Appointment[] = [
  {
    id: "a_001",
    date: "Hôm nay",
    time: "08:30",
    patientName: "Nguyễn Văn Hùng",
    doctorName: "BS. Nguyễn Hoàng Nam",
    department: "Tim mạch",
    status: "Đã xác nhận",
  },
  {
    id: "a_002",
    date: "Hôm nay",
    time: "09:15",
    patientName: "Trần Thị Ngọc Anh",
    doctorName: "BS. Lê Thu Trang",
    department: "Nhi khoa",
    status: "Chờ xác nhận",
  },
  {
    id: "a_003",
    date: "Hôm nay",
    time: "10:00",
    patientName: "Phạm Thu Hà",
    doctorName: "BS. Võ Thành Đạt",
    department: "Ngoại tổng quát",
    status: "Đã xác nhận",
  },
  {
    id: "a_004",
    date: "Ngày mai",
    time: "13:45",
    patientName: "Vũ Thảo My",
    doctorName: "BS. Đặng Mỹ Linh",
    department: "Sản - Phụ khoa",
    status: "Đã xác nhận",
  },
  {
    id: "a_005",
    date: "Ngày mai",
    time: "15:10",
    patientName: "Đỗ Quốc Bảo",
    doctorName: "BS. Trần Đức Minh",
    department: "Chẩn đoán hình ảnh",
    status: "Chờ xác nhận",
  },
];

export const departments: Department[] = [
  {
    id: "dep_001",
    name: "Tim mạch",
    head: "BS. Nguyễn Hoàng Nam",
    capacity: 120,
    occupied: 84,
  },
  {
    id: "dep_002",
    name: "Nhi khoa",
    head: "BS. Lê Thu Trang",
    capacity: 90,
    occupied: 71,
  },
  {
    id: "dep_003",
    name: "Ngoại tổng quát",
    head: "BS. Võ Thành Đạt",
    capacity: 110,
    occupied: 96,
  },
  {
    id: "dep_004",
    name: "Chẩn đoán hình ảnh",
    head: "BS. Trần Đức Minh",
    capacity: 60,
    occupied: 43,
  },
];

