"use client";

import { useContext, useEffect, useState } from "react";
import { Card, CardBody, Form, FormCheck } from "react-bootstrap";
import { AuthContext } from "../utils/context";
import {
  completeTask,
  getTodayTasks,
  handleCheckChange,
  undoTask,
} from "../services/firebase";
import { Entry } from "../utils/constatnts";
import { SavedTask } from "../utils/interfaces";
import ProtectedRoute from "./ProtectedRoute";
import { getPriorityFontSize } from "../utils/helpers";

export default function TodayPanel() {
  const { user } = useContext(AuthContext);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tasksData, setTasksData] = useState<{
    [key in Entry]: SavedTask[];
  }>({
    [Entry.task]: [],
    [Entry.heap]: [],
    [Entry.habit]: [],
  });
  const [checkboxStates, setCheckboxStates] = useState<{
    [id: string]: boolean;
  }>({});

  useEffect(() => {
    if (user) {
      const loadTasks = async () => {
        const loadedTasks = await getTodayTasks(user.uid);

        if (loadedTasks) {
          setTasksData(loadedTasks);
          const currentStrDate = new Date().toISOString().split("T")[0];

          const initialCheckboxStates = {
            ...loadedTasks[Entry.task].reduce(
              (acc, task) => ({
                ...acc,
                [task.id]: Boolean(task.completedDate),
              }),
              {}
            ),
            ...loadedTasks[Entry.heap].reduce(
              (acc, task) => ({
                ...acc,
                [task.id]: Boolean(
                  task.completedCounter &&
                    task.completedCounter[task.completedCounter?.length - 1] ===
                      currentStrDate
                ),
              }),
              {}
            ),
            ...loadedTasks[Entry.habit].reduce(
              (acc, task) => ({
                ...acc,
                [task.id]: Boolean(
                  task.completedCounter &&
                    task.completedCounter[task.completedCounter?.length - 1] ===
                      currentStrDate
                ),
              }),
              {}
            ),
          };

          setCheckboxStates(initialCheckboxStates);
        } else {
          setIsEmpty(true);
        }
      };
      loadTasks();
    }
  }, [user]);

  const handleCheckboxChange = async (task: SavedTask, checked: boolean) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [task.id]: checked,
    }));

    try {
      if (task.type === Entry.task) {
        if (checked) {
          await completeTask({ uid: user!.uid, data: task });
        } else {
          await undoTask({ uid: user!.uid, data: task });
        }
      } else if (task.type === Entry.heap || task.type === Entry.habit) {
        await handleCheckChange({ uid: user!.uid, task, checked });
      }
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  const renderTaskSection = (title: string, tasks: SavedTask[]) => {
    if (tasks.length === 0) return null;
    return (
      <>
        <h3 className="text-center">{title}</h3>
        <Form className="mb-2">
          {tasks.map((task) => (
            <FormCheck
              key={task.id}
              type="checkbox"
              label={task.task}
              checked={checkboxStates[task.id]}
              onChange={(e) => handleCheckboxChange(task, e.target.checked)}
              className={getPriorityFontSize(task.priority)}
            />
          ))}
        </Form>
      </>
    );
  };

  return (
    <ProtectedRoute>
      <Card
        style={{ width: "fit-content" }}
        className="my-0 mx-auto d-flex flex-column align-items-center px-5 shadow"
      >
        <CardBody>
          <h2 className="display-2 mb-5">Today:</h2>

          {isEmpty && <div>There are no tasks for today</div>}

          {renderTaskSection("Tasks:", tasksData.task)}
          {renderTaskSection("Habits:", tasksData.habit)}
          {renderTaskSection("Heaps:", tasksData.heap)}
        </CardBody>
      </Card>
    </ProtectedRoute>
  );
}
