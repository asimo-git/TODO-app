"use client";
import TodayPanel from "./components/TodayPanel";
import { useAuth } from "./utils/hooks";

export default function Home() {
  const { user, loading } = useAuth();

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
