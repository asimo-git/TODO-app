"use client";

import { Container } from "react-bootstrap";
import { Entry } from "../utils/constatnts";
import { SavedTask } from "../utils/interfaces";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";

export default function TasksPool() {
  const [tasks, setTasks] = useState<SavedTask[]>([]);
  const [heaps, setHeaps] = useState<SavedTask[]>([]);
  const [habits, setHabits] = useState<SavedTask[]>([]);

  useEffect(() => {
    const loadedTasks: SavedTask[] = JSON.parse(
      localStorage.getItem(Entry[0]) || "[]"
    );
    const loadedHeaps: SavedTask[] = JSON.parse(
      localStorage.getItem(Entry[1]) || "[]"
    );
    const loadedHabits: SavedTask[] = JSON.parse(
      localStorage.getItem(Entry[2]) || "[]"
    );

    setTasks(loadedTasks);
    setHeaps(loadedHeaps);
    setHabits(loadedHabits);
  }, []);

  return (
    <>
      {tasks.length > 0 && (
        <Container>
          <h3>Tasks</h3>
          {tasks.map((task) => (
            <TaskCard key={task.id} data={task}></TaskCard>
          ))}
        </Container>
      )}
      {heaps.length > 0 && (
        <Container>
          <h3>Heaps</h3>
          {heaps.map((task) => (
            <TaskCard key={task.id} data={task}></TaskCard>
          ))}
        </Container>
      )}
      {habits.length > 0 && (
        <Container>
          <h3>Habits</h3>
          {habits.map((task) => (
            <TaskCard key={task.id} data={task}></TaskCard>
          ))}
        </Container>
      )}
    </>
  );
}
