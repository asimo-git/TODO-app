"use client";

import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getTasksFromFireStore } from "../../services/firebase";
import { Entry, TaskType } from "../../utils/constatnts";
import { AuthContext } from "../../utils/context";
import { SavedTask } from "../../utils/interfaces";
import ProtectedRoute from "../ProtectedRoute";
import TaskCard from "./TaskCard";

export default function TasksPool({ pageType }: { pageType: TaskType }) {
  const { user } = useContext(AuthContext);
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
      const section = pageType === "todo" ? "tasks" : "completed";
      const loadTasks = async () => {
        const loadedTasks = await getTasksFromFireStore(user.uid, section);
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
  }, [user, pageType]);

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
      <>
        <h3>{title}</h3>
        <div className="d-flex mb-4 flex-wrap gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              data={task}
              onDelete={removeTask}
              onUpdate={updateTask}
            />
          ))}
        </div>
      </>
    );
  };

  if (isEmpty) {
    return (
      <ProtectedRoute>
        <Container>
          {pageType === "todo"
            ? "Tasks not created yet"
            : "There are no completed tasks yet"}
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {renderTaskSection("Tasks", tasksData[Entry.task])}
      {renderTaskSection("Heaps", tasksData[Entry.heap])}
      {renderTaskSection("Habits", tasksData[Entry.habit])}
    </ProtectedRoute>
  );
}
