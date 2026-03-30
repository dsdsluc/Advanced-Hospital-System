"use client";
import { PatientProvider } from "@/lib/patient-context";
import { PatientShell } from "@/components/patient/shell";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <PatientProvider>
      <PatientShell>{children}</PatientShell>
    </PatientProvider>
  );
}
