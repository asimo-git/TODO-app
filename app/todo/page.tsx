"use client";

import { Container, Spinner } from "react-bootstrap";
import { Entry } from "../utils/constatnts";
import { SavedTask } from "../utils/interfaces";
import TaskCard from "../components/TaskCard";
import { useContext, useEffect, useState } from "react";
import { getTasksFromFireStore } from "../services/firebase";
import { AuthContext } from "../utils/context";

export default function TasksPool() {
  const { user, loading } = useContext(AuthContext);
  const [isEmpty, setIsEmpty] = useState(false);

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
        } else {
          setIsEmpty(true);
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

  const updateTask = (updatedTask: SavedTask) => {
    setTasksData((prevTasksData) => ({
      ...prevTasksData,
      [updatedTask.type]: prevTasksData[updatedTask.type].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  const renderTaskSection = (title: string, tasks: SavedTask[]) => {
    if (tasks.length === 0) return null;
    return (
      <Container>
        <h3>{title}</h3>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            data={task}
            onDelete={removeTask}
            onUpdate={updateTask}
          />
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

  if (isEmpty) {
    return <Container>Tasks not created yet</Container>;
  }

  return (
    <>
      {renderTaskSection("Tasks", tasksData[Entry.task])}
      {renderTaskSection("Heaps", tasksData[Entry.heap])}
      {renderTaskSection("Habits", tasksData[Entry.habit])}
    </>
  );
}
