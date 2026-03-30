/**
 * Prisma seed script — HMS Database
 * Run: npx prisma db seed
 *
 * Seeds:
 *  - 1 ADMIN user (admin@hospital.com / 123456)
 *  - 6 DOCTOR users (nguyen.hoang.nam@hospital.com / doctor001, etc.)
 *  - 6 Departments
 *  - 6 Doctors (linked to departments)
 *  - 6 Patients
 *  - 7 Appointments (5 future + 2 completed)
 */

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
// Load .env for DATABASE_URL (ts-node in CommonJS mode has __dirname)
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...");

  // Clear in FK-safe order
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // ── Admin user ──────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@hospital.com",
      password: "123456", // plain text per spec (no hashing yet)
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // ── Departments ─────────────────────────────────────────────────────────
  const [depCardiology, depPediatrics, depSurgery, depRadiology, depObgyn, depDerm] =
    await Promise.all([
      prisma.department.create({ data: { name: "Tim mạch", capacity: 120, occupied: 84 } }),
      prisma.department.create({ data: { name: "Nhi khoa", capacity: 90, occupied: 71 } }),
      prisma.department.create({ data: { name: "Ngoại tổng quát", capacity: 110, occupied: 96 } }),
      prisma.department.create({ data: { name: "Chẩn đoán hình ảnh", capacity: 60, occupied: 43 } }),
      prisma.department.create({ data: { name: "Sản - Phụ khoa", capacity: 80, occupied: 55 } }),
      prisma.department.create({ data: { name: "Da liễu", capacity: 50, occupied: 30 } }),
    ]);
  console.log("✅ Departments created");

  // ── Doctors ─────────────────────────────────────────────────────────────
  const [doc1, doc2, doc3, doc4, doc5, doc6] = await Promise.all([
    prisma.doctor.create({
      data: {
        name: "BS. Nguyễn Hoàng Nam",
        specialization: "Tim mạch",
        avatarUrl:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
        availability: "AVAILABLE",
        rating: 4.9,
        departmentId: depCardiology.id,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "BS. Lê Thu Trang",
        specialization: "Nhi khoa",
        avatarUrl:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=256&q=80",
        availability: "BUSY",
        rating: 4.8,
        departmentId: depPediatrics.id,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "BS. Trần Đức Minh",
        specialization: "Chẩn đoán hình ảnh",
        avatarUrl:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80",
        availability: "AVAILABLE",
        rating: 4.7,
        departmentId: depRadiology.id,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "BS. Phạm Quỳnh Anh",
        specialization: "Da liễu",
        avatarUrl:
          "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=256&q=80",
        availability: "OFF",
        rating: 4.6,
        departmentId: depDerm.id,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "BS. Võ Thành Đạt",
        specialization: "Ngoại tổng quát",
        avatarUrl:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80",
        availability: "BUSY",
        rating: 4.8,
        departmentId: depSurgery.id,
      },
    }),
    prisma.doctor.create({
      data: {
        name: "BS. Đặng Mỹ Linh",
        specialization: "Sản - Phụ khoa",
        avatarUrl:
          "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=256&q=80",
        availability: "AVAILABLE",
        rating: 4.9,
        departmentId: depObgyn.id,
      },
    }),
  ]);
  console.log("✅ Doctors created");

  // ── Doctor user accounts ─────────────────────────────────────────────────────
  const doctorEmails = [
    { name: "BS. Nguyễn Hoàng Nam", email: "nguyen.hoang.nam@hospital.com" },
    { name: "BS. Lê Thu Trang", email: "le.thu.trang@hospital.com" },
    { name: "BS. Trần Đức Minh", email: "tran.duc.minh@hospital.com" },
    { name: "BS. Phạm Quỳnh Anh", email: "pham.quynh.anh@hospital.com" },
    { name: "BS. Võ Thành Đạt", email: "vo.thanh.dat@hospital.com" },
    { name: "BS. Đặng Mỹ Linh", email: "dang.my.linh@hospital.com" },
  ];

  const doctorUsers = await Promise.all(
    doctorEmails.map((d, i) =>
      prisma.user.create({
        data: {
          email: d.email,
          password: `doctor${String(i + 1).padStart(3, "0")}`, // doctor001, doctor002, ...
          name: d.name,
          role: "DOCTOR",
        },
      })
    )
  );
  console.log("✅ Doctor user accounts created (6 accounts)");

  // Link doctor users to doctor records
  await Promise.all([
    prisma.doctor.update({ where: { id: doc1.id }, data: { userId: doctorUsers[0].id } }),
    prisma.doctor.update({ where: { id: doc2.id }, data: { userId: doctorUsers[1].id } }),
    prisma.doctor.update({ where: { id: doc3.id }, data: { userId: doctorUsers[2].id } }),
    prisma.doctor.update({ where: { id: doc4.id }, data: { userId: doctorUsers[3].id } }),
    prisma.doctor.update({ where: { id: doc5.id }, data: { userId: doctorUsers[4].id } }),
    prisma.doctor.update({ where: { id: doc6.id }, data: { userId: doctorUsers[5].id } }),
  ]);
  console.log("✅ Linked doctor users to doctor records");

  const [pat1, pat2, pat3, pat4, pat5, pat6] = await Promise.all([
    prisma.patient.create({
      data: {
        code: "BN-24031",
        name: "Trần Thị Ngọc Anh",
        gender: "Nữ",
        age: 28,
        phone: "0901 234 567",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
        status: "MONITORING",
        lastVisit: new Date(),
      },
    }),
    prisma.patient.create({
      data: {
        code: "BN-24032",
        name: "Nguyễn Văn Hùng",
        gender: "Nam",
        age: 41,
        phone: "0912 980 112",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
        status: "TREATING",
        lastVisit: daysAgo(1),
      },
    }),
    prisma.patient.create({
      data: {
        code: "BN-24033",
        name: "Lê Minh Khánh",
        gender: "Nam",
        age: 35,
        phone: "0988 321 654",
        avatarUrl:
          "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=256&q=80",
        status: "MONITORING",
        lastVisit: daysAgo(2),
      },
    }),
    prisma.patient.create({
      data: {
        code: "BN-24034",
        name: "Phạm Thu Hà",
        gender: "Nữ",
        age: 52,
        phone: "0977 120 909",
        avatarUrl:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80",
        status: "TREATING",
        lastVisit: daysAgo(3),
      },
    }),
    prisma.patient.create({
      data: {
        code: "BN-24035",
        name: "Đỗ Quốc Bảo",
        gender: "Nam",
        age: 26,
        phone: "0908 234 111",
        avatarUrl:
          "https://images.unsplash.com/photo-1520975922284-7b79d2d0b6e4?auto=format&fit=crop&w=256&q=80",
        status: "DISCHARGED",
        lastVisit: daysAgo(7),
      },
    }),
    prisma.patient.create({
      data: {
        code: "BN-24036",
        name: "Vũ Thảo My",
        gender: "Nữ",
        age: 31,
        phone: "0933 330 440",
        avatarUrl:
          "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=256&q=80",
        status: "MONITORING",
        lastVisit: daysAgo(7),
      },
    }),
  ]);
  console.log("✅ Patients created");

  // ── Patient user accounts ────────────────────────────────────────────────
  const patientUserData = [
    { patient: pat1, email: "tran.thi.ngoc.anh@hospital.com", password: "patient001" },
    { patient: pat2, email: "nguyen.van.hung@hospital.com",   password: "patient002" },
    { patient: pat3, email: "le.minh.khanh@hospital.com",     password: "patient003" },
    { patient: pat4, email: "pham.thu.ha@hospital.com",       password: "patient004" },
    { patient: pat5, email: "do.quoc.bao@hospital.com",       password: "patient005" },
    { patient: pat6, email: "vu.thao.my@hospital.com",        password: "patient006" },
  ];

  for (const { patient, email, password } of patientUserData) {
    const patientUser = await prisma.user.create({
      data: { email, password, name: patient.name, role: "PATIENT" },
    });
    await prisma.patient.update({
      where: { id: patient.id },
      data: { userId: patientUser.id },
    });
  }
  console.log("✅ Patient user accounts created (6 accounts)");

  // ── Appointments ────────────────────────────────────────────────────────
  await Promise.all([
    prisma.appointment.create({
      data: {
        appointmentDate: new Date(),
        appointmentTime: "08:30",
        patientId: pat2.id,
        doctorId: doc1.id,
        departmentId: depCardiology.id,
        status: "CONFIRMED",
      },
    }),
    prisma.appointment.create({
      data: {
        appointmentDate: new Date(),
        appointmentTime: "09:15",
        patientId: pat1.id,
        doctorId: doc2.id,
        departmentId: depPediatrics.id,
        status: "PENDING",
      },
    }),
    prisma.appointment.create({
      data: {
        appointmentDate: new Date(),
        appointmentTime: "10:00",
        patientId: pat4.id,
        doctorId: doc5.id,
        departmentId: depSurgery.id,
        status: "CONFIRMED",
      },
    }),
    prisma.appointment.create({
      data: {
        appointmentDate: daysFromNow(1),
        appointmentTime: "13:45",
        patientId: pat6.id,
        doctorId: doc6.id,
        departmentId: depObgyn.id,
        status: "CONFIRMED",
      },
    }),
    prisma.appointment.create({
      data: {
        appointmentDate: daysFromNow(1),
        appointmentTime: "15:10",
        patientId: pat5.id,
        doctorId: doc3.id,
        departmentId: depRadiology.id,
        status: "PENDING",
      },
    }),
    // A few completed appointments to have non-zero revenue
    prisma.appointment.create({
      data: {
        appointmentDate: daysAgo(3),
        appointmentTime: "08:00",
        patientId: pat3.id,
        doctorId: doc1.id,
        departmentId: depCardiology.id,
        status: "COMPLETED",
      },
    }),
    prisma.appointment.create({
      data: {
        appointmentDate: daysAgo(5),
        appointmentTime: "14:00",
        patientId: pat5.id,
        doctorId: doc4.id,
        departmentId: depDerm.id,
        status: "COMPLETED",
      },
    }),
  ]);
  console.log("✅ Appointments created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
