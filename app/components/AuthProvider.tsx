"use client";
import { ReactNode } from "react";
import { AuthContext } from "../utils/context";
import { useAuth } from "../utils/hooks";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  console.log("auth", user);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
