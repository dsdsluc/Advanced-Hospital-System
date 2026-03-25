import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cài đặt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tùy chỉnh trải nghiệm và cấu hình thông báo theo nhu cầu vận hành.
        </p>
      </div>
      <SettingsPanel />
    </div>
  );
}

