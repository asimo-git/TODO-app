"use client";
import { useContext } from "react";
import TodayPanel from "./components/TodayPanel";
import { AuthContext } from "./utils/context";
import { Container, Spinner } from "react-bootstrap";

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
    <div className="d-flex flex-wrap">
      {user ? (
        <TodayPanel />
      ) : (
        <Container className="flex-grow-1 mb-4">
          <h2 className="mb-3">First of all...</h2>
          <a href="/login">Log in</a>
          <div>or</div>
          <a href="/register">Register</a>
        </Container>
      )}
      <Container>
        This habit and task tracker is based on a method that divides all tasks
        into three categories:
        <ul>
          <li>
            <b>Tasks</b> - one-time actions scheduled for a specific date
          </li>
          <li>
            <b>Habits</b> - recurring actions with a set frequency
          </li>
          <li>
            <b>Heaps</b> - actions that need to be completed a specific number
            of times without being tied to a specific date or interval
          </li>
        </ul>
        The priority of tasks in the list is determined by font size.<br></br>
        May discipline be with you!
      </Container>
    </div>
  );
}
