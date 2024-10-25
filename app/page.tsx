"use client";
import { useContext } from "react";
import TodayPanel from "./components/TodayPanel";
import { AuthContext } from "./utils/context";

export default function Home() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user ? (
        <TodayPanel />
      ) : (
        <>
          <h2>First of all...</h2>
          <a href="/login">Log in</a>
          <div>or</div>
          <a href="/register">Register</a>
        </>
      )}
    </>
  );
}
