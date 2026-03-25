import { getDashboard } from "@/lib/api";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { StatCards } from "@/components/dashboard/stat-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentPatients } from "@/components/dashboard/recent-patients";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";

export default async function DashboardPage() {
  const data = await getDashboard();

  return (
    <div className="space-y-6">
      <HeroBanner />
      <StatCards stats={data.stats} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={data.revenue} />
        </div>
        <UpcomingAppointments appointments={data.upcomingAppointments} />
      </div>
      <div className="grid gap-4">
        <RecentPatients patients={data.recentPatients} />
      </div>
    </div>
  );
}

