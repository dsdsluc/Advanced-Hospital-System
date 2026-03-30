"use client";

import * as React from "react";

export interface DoctorSession {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  department: { id: string; name: string } | null;
}

type DoctorContextType = {
  doctorId: string | null;
  doctor: DoctorSession | null;
  logout: () => void;
};

const DoctorContext = React.createContext<DoctorContextType>({
  doctorId: null,
  doctor: null,
  logout: () => {},
});

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = React.useState<DoctorSession | null>(null);

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("doctor");
      if (stored) {
        const parsed = JSON.parse(stored) as DoctorSession;
        setDoctor(parsed);
      }
    } catch (error) {
      console.error("Failed to parse doctor from localStorage:", error);
      localStorage.removeItem("doctor");
    }
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem("doctor");
    setDoctor(null);
    window.location.href = "/auth/doctor-login";
  }, []);

  return (
    <DoctorContext.Provider value={{ doctorId: doctor?.id || null, doctor, logout }}>
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = React.useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor must be used inside DoctorProvider");
  }
  return context;
}
