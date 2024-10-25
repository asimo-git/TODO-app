"use client";
import { ReactNode } from "react";
import { useAuth } from "../utils/hooks";
import { AuthContext } from "../utils/context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
