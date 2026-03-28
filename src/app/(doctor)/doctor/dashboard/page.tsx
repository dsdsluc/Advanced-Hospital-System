import { DoctorHeroBanner } from "@/components/doctor/dashboard/hero-banner";
import { DoctorStatCards } from "@/components/doctor/dashboard/stat-cards";
import { TodaySchedule } from "@/components/doctor/dashboard/today-schedule";
import { MyPatients } from "@/components/doctor/dashboard/my-patients";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <DoctorHeroBanner />
      <DoctorStatCards />
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>
        <div className="lg:col-span-3">
          <MyPatients />
        </div>
      </div>
    </div>
  );
}
