import { Alert, Card, CardBody, CardFooter, CardTitle } from "react-bootstrap";
import { SavedTask } from "../utils/interfaces";
import { Entry, TaskType } from "../utils/constatnts";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../utils/context";
import {
  completeTask,
  deleteTask,
  undoTask,
  updateTask,
} from "../services/firebase";
import ActionButtonGroup from "./ActionButtonGroup";
import {
  decodeFrequencyToText,
  getPriorityFontSize,
  getTypeColor,
} from "../utils/helpers";
import Image from "next/image";
import TaskFrequencySelector from "./TaskFrequencySelector";

export default function TaskCard({
  data,
  onDelete,
  onUpdate,
}: {
  data: SavedTask;
  onDelete: (id: string, type: Entry) => void;
  onUpdate: (updatedTask: SavedTask) => void;
}) {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);
  const typeTask: TaskType = data.completedDate ? "done" : "todo";

  const priorityFontSize = useMemo(
    () => getPriorityFontSize(data.priority),
    [data.priority]
  );
  const typeColor = useMemo(() => getTypeColor(data.type), [data.type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTask = () => {
    setError(null);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    setError(null);
    setIsEditing(false);

    try {
      await updateTask({
        uid: user?.uid || "",
        updatedData: editedData,
        typeTask,
      });
      onUpdate(editedData);
    } catch (error) {
      console.error("Error saving task:", error);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleUndoChanges = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const handleDeleteTask = async () => {
    if (user) {
      try {
        await deleteTask({ uid: user?.uid, taskId: data.id, typeTask });
        onDelete(data.id, data.type);
      } catch (error) {
        console.error("Error deleting task:", error);
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleCompleteTask = async () => {
    try {
      await completeTask({ uid: user?.uid || "", data });
      onDelete(data.id, data.type);
    } catch (error) {
      console.error("Error while completing task:", error);
      setError("Failed to complete task. Please try again.");
    }
  };

  const handleUndoTask = async () => {
    try {
      await undoTask({ uid: user?.uid || "", data });
      onDelete(data.id, data.type);
    } catch (error) {
      console.error("Error while undo task:", error);
      setError("Failed to undo task. Please try again.");
    }
  };

  return (
    <Card
      className={`${typeColor} mb-2 shadow flex-grow-1`}
      style={{ flexBasis: "200px", maxWidth: "600px" }}
    >
      <CardTitle className={`${priorityFontSize} m-3`}>
        {isEditing ? (
          <input
            type="text"
            name="task"
            value={editedData.task}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          <>
            <span>{data.task}</span>
            {data.completedDate && (
              <Image
                src="/check.svg"
                alt="check icon"
                width={30}
                height={30}
                className="m-1"
              />
            )}
          </>
        )}
      </CardTitle>

      <CardBody className="py-0">
        {data.frequency &&
          (isEditing ? (
            <TaskFrequencySelector
              value={editedData.frequency}
              onChange={(value) =>
                setEditedData((prev) => ({
                  ...prev,
                  frequency: value,
                }))
              }
            />
          ) : (
            <>Repetition Frequency: {decodeFrequencyToText(data.frequency)}</>
          ))}

        {data.repetition && (
          <>
            Repetition:{" "}
            {isEditing ? (
              <input
                type="text"
                inputMode="numeric"
                name="repetition"
                value={editedData.repetition}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setEditedData((prev) => ({
                    ...prev,
                    repetition: onlyDigits,
                  }));
                }}
                className="form-control d-inline w-25"
              />
            ) : (
              data.repetition
            )}
          </>
        )}
      </CardBody>

      <CardFooter className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div className="flex-grow-1">
          {data.type === Entry.task
            ? "Data -"
            : data.type === Entry.heap
            ? "Deadline -"
            : "Start -"}{" "}
          {isEditing ? (
            <input
              type="date"
              name="date"
              value={editedData.date}
              onChange={handleChange}
              className="form-control d-inline"
              style={{ maxWidth: "200px" }}
            />
          ) : (
            data.date
          )}
        </div>
        <div className="flex-grow-1">
          {data.completedDate && (
            <>
              Completed Date -{" "}
              {isEditing ? (
                <input
                  type="date"
                  name="completedDate"
                  value={editedData.completedDate}
                  onChange={handleChange}
                  className="form-control d-inline"
                  style={{ maxWidth: "200px" }}
                />
              ) : (
                data.completedDate
              )}
            </>
          )}
        </div>

        <ActionButtonGroup
          isEditing={isEditing}
          onChangeStatus={
            data.completedDate ? handleUndoTask : handleCompleteTask
          }
          onSaveChanges={handleSaveChanges}
          onUndoChanges={handleUndoChanges}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          typeTask={typeTask}
        ></ActionButtonGroup>
      </CardFooter>

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          dismissible
          className="mt-2"
        >
          {error}
        </Alert>
      )}
    </Card>
  );
}
