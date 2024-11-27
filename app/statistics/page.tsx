"use client";
import { useContext, useEffect, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import ProtectedRoute from "../components/ProtectedRoute";
import CalendarField from "../components/Statistic/CalendarField";
import { getTasksFromFireStore } from "../services/firebase";
import { AuthContext } from "../utils/context";
import { getTypeColor } from "../utils/helpers";
import { SavedTask } from "../utils/interfaces";

export default function Statistics() {
  const { user } = useContext(AuthContext);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tasks, setTasks] = useState<SavedTask[] | null | undefined>(null);
  const [doneTasks, setDoneTasks] = useState<SavedTask[] | null | undefined>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<SavedTask | null>(null);

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

  const handleSelect = (task: SavedTask) => {
    setSelectedTask(task);
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
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="task-dropdown">
                {selectedTask ? selectedTask.task : "Select task"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {tasks?.map((task) => (
                  <Dropdown.Item
                    key={task.id}
                    onClick={() => handleSelect(task)}
                    className={`${getTypeColor(task.type)}`}
                  >
                    {task.task}
                  </Dropdown.Item>
                ))}
                {doneTasks?.map((task) => (
                  <Dropdown.Item
                    key={task.id}
                    onClick={() => handleSelect(task)}
                    className={`${getTypeColor(task.type)}`}
                  >
                    {`\u2713 ${task.task}`}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <CalendarField selectedTask={selectedTask} />
          </>
        )}
      </ProtectedRoute>
    </>
  );
}
