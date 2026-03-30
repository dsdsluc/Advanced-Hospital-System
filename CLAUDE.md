@AGENTS.md

# Project: HMS Dashboard (Hospital Management System)

## Overview
A full-stack hospital management system with three portals: **Admin**, **Doctor**, and **Patient**, plus a public landing page. Built with Next.js 14 App Router, PostgreSQL (Neon), and Prisma ORM. UI uses Tailwind CSS + Shadcn/Radix UI. Vietnamese localization throughout.

## Tech Stack
- **Framework:** Next.js 14.2.33 (App Router)
- **Database:** PostgreSQL via Prisma ORM 7.6 (`prisma/schema.prisma`)
- **ORM:** Prisma with `@prisma/adapter-pg`
- **Styling:** Tailwind CSS 3.4 + Shadcn UI (Radix UI)
- **Charts:** Recharts 3.8
- **Animations:** Framer Motion
- **Auth:** Cookie-based for doctors, context stored in localStorage
- **Image Upload:** Cloudinary (`src/lib/cloudinary.ts`)

## Route Structure
```
/                        → Public landing page
/auth/login              → Admin/patient login
/auth/doctor-login       → Doctor login
/admin/...               → Admin portal (dashboard, patients, doctors, appointments, departments, billing, medical-records, settings)
/doctor/...              → Doctor portal (dashboard, appointments, patients, medical-records, prescriptions, profile, schedule)
/patient/...             → Patient portal (dashboard, appointments, prescriptions, health-records, billing, test-results, profile)
/api/admin/...           → Admin REST APIs
/api/doctor/...          → Doctor REST APIs
/api/auth/doctor-login   → Doctor auth endpoint
```

## Database Models
- **User** — id, email, password, name, role (ADMIN/DOCTOR/PATIENT)
- **Doctor** — id, userId, name, specialization, avatarUrl, availability (AVAILABLE/BUSY/OFF), rating, departmentId
- **Patient** — id, code, name, gender, age, phone, avatarUrl, status (TREATING/MONITORING/DISCHARGED), lastVisit
- **Department** — id, name, capacity, occupied
- **Appointment** — id, appointmentDate, appointmentTime, patientId, doctorId, departmentId, status (CONFIRMED/PENDING/COMPLETED/CANCELLED), notes, diagnosis

## Key Files
- `src/lib/prisma.ts` — Prisma client singleton
- `src/lib/api/index.ts` — Server-side API fetcher functions
- `src/lib/api/types.ts` — TypeScript interfaces (Vietnamese status strings)
- `src/lib/api/mock-data.ts` — Mock data for development
- `src/lib/doctor-context.tsx` — Doctor session React Context + `useDoctor()` hook
- `src/lib/cloudinary.ts` — Image upload
- `middleware.ts` — Protects `/doctor` routes, redirects to `/auth/doctor-login` if no cookie

## Authentication
- **Doctor auth:** Cookie-based. Login via `/api/auth/doctor-login`, session stored in `localStorage` as JSON `{ id, userId, name, email, specialization, department }`. `DoctorProvider` wraps doctor routes.
- **Middleware:** `middleware.ts` checks for `doctor` cookie on all `/doctor/*` routes.
- **Note:** bcrypt is installed but passwords are currently plain text — needs fixing before production.

## DB Scripts
```bash
npm run db:generate    # prisma generate
npm run db:migrate     # prisma migrate dev
npm run db:seed        # seed database
npm run db:setup       # migrate + seed
npm run db:studio      # open Prisma Studio
npm run db:reset       # reset database
```

## Current State (as of 2026-03-30)
- Admin portal: fully built — dashboard stats, revenue chart, patients/doctors/appointments/departments CRUD with dialogs
- Doctor portal: fully built — dashboard, schedule, patients, appointments, medical records, prescriptions, profile
- Patient portal: structure exists, components scaffolded
- Public landing page: complete with hero, doctors, services, testimonials, stats, CTAs
- All admin & doctor API routes implemented with Prisma
- Mock data available in `src/lib/api/mock-data.ts` for dev/testing
- Vietnamese language used for status labels and UI text

## Doctor Portal — Detail (as of 2026-03-30)

### Appointments (`/doctor/appointments`)
- Full-featured view with status filter tabs: Tất cả / Chờ xác nhận / Đã xác nhận / Hoàn tất / Hủy
- Stats cards: total, pending, completed
- Search by patient name or code
- Detail modal with patient info grid, read-only existing diagnosis/notes, editable status dropdown, diagnosis textarea, notes textarea
- Saves to DB via PUT `/api/doctor/appointments/[id]` — updates status, notes, diagnosis
- API (`/api/doctor/appointments`) returns: notes, diagnosis, appointmentDate (ISO) in addition to base fields

### Patients (`/doctor/patients`)
- Summary cards: treating / monitoring / discharged counts
- Searchable patient list with avatar, code, gender/age, last visit, total appointments, status badge
- Profile detail modal (`max-w-5xl`, two-column):
  - Left 1/3: full patient info card
  - Right 2/3: medical records timeline — diagnosis in blue highlighted box, notes truncated, color-coded status badges

### Profile (`/doctor/profile`)
- Loads real data from GET `/api/doctor/profile?doctorId=`
- Display mode: avatar, name, specialization, auto-generated license number, rating, availability badge
- Edit mode (click "Chỉnh sửa hồ sơ"): name, specialization, availability fields + avatar upload via Cloudinary (`hms/doctors` folder)
- Saves via PUT `/api/doctor/profile?doctorId=`; contact card uses `doctor.email` from DoctorContext

### UI Components Added
- `src/components/ui/textarea.tsx` — Shadcn-style Textarea component (was missing from project)

---

## Patient Portal — Detail (as of 2026-03-30)

### Auth & Session
- Login page: `POST /api/auth/login` — plain-text password, role=PATIENT only
- Session stored in `localStorage` as JSON key `"patient"` with fields: `{ id, userId, name, email, code, gender, age, phone, avatarUrl, status }`
- `PatientProvider` (`src/lib/patient-context.tsx`) wraps all patient routes via layout
- `usePatient()` hook gives `{ patientId, patient, logout }`
- Logout clears localStorage + redirects to `/auth/login`

### Database — Patient model updated
- Added `userId String? @unique` + `user User?` relation to `Patient` model (mirrors Doctor pattern)
- Run `prisma db push` to sync (migration history has drift — use db push for dev)
- Seed creates 6 PATIENT user accounts linked to patient records

### Patient Seed Credentials
- `tran.thi.ngoc.anh@hospital.com` / `patient001`
- `nguyen.van.hung@hospital.com` / `patient002`
- `le.minh.khanh@hospital.com` / `patient003`
- `pham.thu.ha@hospital.com` / `patient004`
- `do.quoc.bao@hospital.com` / `patient005`
- `vu.thao.my@hospital.com` / `patient006`

### Route Protection (Middleware)
- `middleware.ts` guards both `/doctor/*` and `/patient/*` routes
- Login API (`POST /api/auth/login`) sets `patient=1` httpOnly cookie on success
- PatientContext logout clears both localStorage and cookie, redirects to `/auth/login`

### Patient API Routes
- `GET /api/patient/appointments?patientId=` — all appointments, includes doctorName/Specialization/AvatarUrl, department, status (VI), notes, diagnosis, rawDate (ISO)
- `POST /api/patient/appointments` — book new appointment (patientId, doctorId, departmentId, appointmentDate, appointmentTime) → creates PENDING
- `GET /api/patient/health-records?patientId=` — completed appointments or those with diagnosis; returns formatted date (dd/MM/yyyy)
- `GET /api/patient/profile?patientId=` — patient profile with VI status
- `PUT /api/patient/profile?patientId=` — update name, phone, avatarUrl
- `GET /api/patient/doctors` — all non-OFF doctors with department info (for booking)

### Dashboard (`/patient/dashboard`)
- `hero-banner.tsx` — "use client", reads patient name/code from PatientContext, fetches appointments to show next upcoming in right card
- `upcoming-appointments.tsx` — "use client", fetches real appointments filtered to upcoming statuses (Chờ xác nhận / Đã xác nhận), max 3, skeleton loading

### Appointments (`/patient/appointments`)
- Status filter tabs: Tất cả / Chờ xác nhận / Đã xác nhận / Hoàn tất / Hủy
- Stats cards: total, upcoming, completed
- Search by doctor name or department
- Read-only detail modal: doctor info, date/time/department/status grid, diagnosis (blue box), notes (slate box)
- "Đặt lịch mới" button opens `BookDialog`

### Book Appointment Dialog (`book-dialog.tsx`)
- Doctor picker: scrollable list with avatar, name, specialization, department
- Date input with min=today
- 10 time slot buttons (07:00–16:30 every hour)
- Error/success states; auto-closes after 1.5s on success
- POSTs to `/api/patient/appointments`; calls `onBooked()` callback to refresh list

### Health Records (`/patient/health-records`)
- Two-panel layout (lg:grid-cols-3): list left, detail right
- Search by doctor name or diagnosis
- Selected record highlighted; detail shows doctor card, diagnosis (blue box), notes (slate box)

### Prescriptions (`/patient/prescriptions`)
- Static mock data (no Prescription model in DB yet)
- Stats: active / needs refill / completed
- Progress bar for active and refill prescriptions; refill warning banner

### Profile (`/patient/profile`)
- Loads from GET `/api/patient/profile`
- Edit mode: name + phone inputs + avatar upload via Cloudinary (`hms/patients`)
- Error handling with inline banner; only changed fields sent to PUT
