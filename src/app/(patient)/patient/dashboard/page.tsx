import { PatientHeroBanner } from "@/components/patient/dashboard/hero-banner";
import { HealthMetrics } from "@/components/patient/dashboard/health-metrics";
import { UpcomingAppointments } from "@/components/patient/dashboard/upcoming-appointments";
import { RecentPrescriptions } from "@/components/patient/dashboard/recent-prescriptions";

export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      <PatientHeroBanner />
      <HealthMetrics />
      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingAppointments />
        <RecentPrescriptions />
      </div>
    </div>
  );
}
