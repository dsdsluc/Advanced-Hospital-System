"use client";
import * as React from "react";

export interface PatientSession {
  id: string;
  userId: string;
  name: string;
  email: string;
  code: string;
  gender: string;
  age: number;
  phone: string;
  avatarUrl: string;
  status: string;
}

type PatientContextType = {
  patientId: string | null;
  patient: PatientSession | null;
  logout: () => void;
};

const PatientContext = React.createContext<PatientContextType>({
  patientId: null,
  patient: null,
  logout: () => {},
});

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [patient, setPatient] = React.useState<PatientSession | null>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("patient");
      if (stored) {
        const parsed = JSON.parse(stored) as PatientSession;
        setPatient(parsed);
      }
    } catch {
      localStorage.removeItem("patient");
    }
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem("patient");
    document.cookie = "patient=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setPatient(null);
    window.location.href = "/auth/login";
  }, []);

  return (
    <PatientContext.Provider value={{ patientId: patient?.id || null, patient, logout }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = React.useContext(PatientContext);
  if (!context) throw new Error("usePatient must be used inside PatientProvider");
  return context;
}
