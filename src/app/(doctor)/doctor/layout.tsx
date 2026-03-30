"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorProvider, useDoctor } from "@/lib/doctor-context";
import { DoctorShell } from "@/components/doctor/shell";

function DoctorLayoutContent({ children }: { children: React.ReactNode }) {
  const { doctor } = useDoctor();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is logged in, redirect if not
  useEffect(() => {
    if (mounted && !doctor) {
      router.push("/auth/doctor-login");
    }
  }, [doctor, mounted, router]);

  if (!mounted || !doctor) {
    return null;
  }

  return <DoctorShell>{children}</DoctorShell>;
}

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DoctorProvider>
      <DoctorLayoutContent>{children}</DoctorLayoutContent>
    </DoctorProvider>
  );
}
