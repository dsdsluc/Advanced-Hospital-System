import { EmergencyBar } from "@/components/public/emergency-bar";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <EmergencyBar />
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
