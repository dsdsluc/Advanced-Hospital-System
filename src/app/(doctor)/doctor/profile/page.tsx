import { ProfileView } from "@/components/doctor/profile/profile-view";

export default function HoSoCaNhanPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground">
          Thông tin cá nhân, học vấn và công tác của bác sĩ
        </p>
      </div>
      <ProfileView />
    </div>
  );
}
