"use client";

import { Container, Spinner } from "react-bootstrap";
import { Entry } from "../utils/constatnts";
import { SavedTask } from "../utils/interfaces";
import TaskCard from "../components/TaskCard";
import { useContext, useEffect, useState } from "react";
import { getTasksFromFireStore } from "../utils/helpers";
import { AuthContext } from "../utils/context";

export default function TasksPool() {
  const { user, loading } = useContext(AuthContext);

  const [tasksData, setTasksData] = useState<{
    [key in Entry]: SavedTask[];
  }>({
    [Entry.task]: [],
    [Entry.heap]: [],
    [Entry.habit]: [],
  });

  useEffect(() => {
    if (user) {
      const loadTasks = async () => {
        const loadedTasks = await getTasksFromFireStore(user.uid);
        if (loadedTasks) {
          setTasksData({
            [Entry.task]: loadedTasks[Entry.task],
            [Entry.heap]: loadedTasks[Entry.heap],
            [Entry.habit]: loadedTasks[Entry.habit],
          });
        }
      };
      loadTasks();
    }
  }, [user]);

  const removeTask = (taskId: string, type: Entry) => {
    setTasksData((prevTasksData) => ({
      ...prevTasksData,
      [type]: prevTasksData[type].filter((task) => task.id !== taskId),
    }));
  };

  const renderTaskSection = (title: string, tasks: SavedTask[]) => {
    if (tasks.length === 0) return null;
    return (
      <Container>
        <h3>{title}</h3>
        {tasks.map((task) => (
          <TaskCard key={task.id} data={task} onDelete={removeTask} />
        ))}
      </Container>
    );
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      {renderTaskSection("Tasks", tasksData[Entry.task])}
      {renderTaskSection("Heaps", tasksData[Entry.heap])}
      {renderTaskSection("Habits", tasksData[Entry.habit])}
    </>
  );
}
