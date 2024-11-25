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
  console.log("pool - ", user);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tasksData, setTasksData] = useState<SavedTask[]>([]);

  useEffect(() => {
    if (user) {
      const section = pageType === "todo" ? "tasks" : "completed";
      const loadTasks = async () => {
        const loadedTasks = await getTasksFromFireStore(user.uid, section);
        if (loadedTasks && loadedTasks.length > 0) {
          setTasksData(loadedTasks);
        } else {
          setIsEmpty(true);
        }
      };
      loadTasks();
    }
  }, [user, pageType]);

  const removeTask = (taskId: string) => {
    setTasksData((prevTasksData) =>
      prevTasksData.filter((task) => task.id !== taskId)
    );
  };

  const updateTask = (updatedTask: SavedTask) => {
    setTasksData((prevTasksData) =>
      prevTasksData.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
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
      {renderTaskSection(
        "Tasks",
        tasksData.filter((task) => task.type === Entry.task)
      )}
      {renderTaskSection(
        "Heaps",
        tasksData.filter((task) => task.type === Entry.heap)
      )}
      {renderTaskSection(
        "Habits",
        tasksData.filter((task) => task.type === Entry.habit)
      )}
    </ProtectedRoute>
  );
}
