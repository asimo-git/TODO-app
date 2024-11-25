"use client";
import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ProtectedRoute from "../components/ProtectedRoute";
import { getTasksFromFireStore } from "../services/firebase";
import { AuthContext } from "../utils/context";
import { SavedTask } from "../utils/interfaces";

export default function Statistics() {
  const { user } = useContext(AuthContext);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tasks, setTasks] = useState<SavedTask[] | null | undefined>(null);
  const [doneTasks, setDoneTasks] = useState<SavedTask[] | null | undefined>(
    null
  );

  useEffect(() => {
    if (!user) return;
    const loadTasks = async () => {
      const [tasks, doneTasks] = await Promise.all([
        getTasksFromFireStore(user?.uid, "tasks"),
        getTasksFromFireStore(user?.uid, "completed"),
      ]);

      setTasks(tasks);
      setDoneTasks(doneTasks);
      console.log(user);

      if (
        (!tasks || tasks.length === 0) &&
        (!doneTasks || doneTasks.length === 0)
      ) {
        setIsEmpty(true);
      }
    };

    loadTasks();
  }, [user]);

  const handleSelectChange = () => {
    console.log();
  };

  return (
    <>
      <ProtectedRoute>
        {isEmpty ? (
          <Container className="flex-grow-1 mb-4">
            <h2 className="mb-3">
              The task list is empty for now, create a new task
            </h2>
          </Container>
        ) : (
          <>
            <select
              value={"select task"}
              onChange={handleSelectChange}
              required
              className="form-select"
              style={{ maxWidth: "800px" }}
            >
              {tasks?.map((task) => (
                <option key={task.id} value={task.task}>
                  {task.task}
                </option>
              ))}
              {doneTasks?.map((task) => (
                <option key={task.id} value={task.task}>
                  {`\u2713 ${task.task}`}
                </option>
              ))}
            </select>

            <Calendar
            // tileClassName={({ date }) => (isDateCompleted(date) ? "completed" : "")}
            />
          </>
        )}
      </ProtectedRoute>
    </>
  );
}
