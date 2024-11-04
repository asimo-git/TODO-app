"use client";
import { useContext } from "react";
import TodayPanel from "./components/TodayPanel";
import { AuthContext } from "./utils/context";
import { Spinner } from "react-bootstrap";

export default function Home() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
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
