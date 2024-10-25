import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
} from "react-bootstrap";
import { SavedTask } from "../utils/interfaces";
import { Entry, Priority } from "../utils/constatnts";
import { useContext, useState } from "react";
import { AuthContext } from "../utils/context";
import { deleteTask, saveNewTask, updateTask } from "../utils/helpers";

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

  const priorityFontSize =
    data.priority === Priority.low
      ? "fs-5"
      : data.priority === Priority.high
      ? "fs-2"
      : "fs-4";

  const typeColor =
    data.type === Entry.task
      ? "bg-light"
      : data.type === Entry.heap
      ? "bg-success"
      : "bg-info";

  const handleUpdateTask = () => {
    setError(null);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setError(null);
    setIsEditing(false);

    try {
      const response = await updateTask({
        uid: user?.uid || "",
        updatedData: editedData,
      });
      if (response) {
        onUpdate(editedData);
      } else {
        setError("Failed to save changes. Please try again.");
      }
    } catch {
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleUndoChanges = () => {
    setEditedData(data);
    setIsEditing(false);
  };

  const handleDeleteTask = async () => {
    if (user) {
      const response = await deleteTask(user?.uid, data.id);
      if (response) {
        onDelete(data.id, data.type);
      } else {
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleCompleteTask = async () => {
    const doneTask = { ...data, completedDate: new Date() };
    const response = await saveNewTask({
      uid: user?.uid || "",
      data: doneTask,
    });
    if (response) {
      handleDeleteTask();
    } else {
      setError("Failed to complete task. Please try again.");
    }
  };

  return (
    <Card className={`${typeColor} mb-2`}>
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
          data.task
        )}
      </CardTitle>

      <CardBody className="py-0">
        {data.frequency && (
          <>
            Frequency:{" "}
            {isEditing ? (
              <input
                type="text"
                name="frequency"
                value={editedData.frequency}
                onChange={handleChange}
                className="form-control d-inline w-25"
              />
            ) : (
              data.frequency
            )}
          </>
        )}

        {data.repetition && (
          <>
            Repetition:{" "}
            {isEditing ? (
              <input
                type="text"
                name="repetition"
                value={editedData.repetition}
                onChange={handleChange}
                className="form-control d-inline w-25"
              />
            ) : (
              data.repetition
            )}
          </>
        )}
      </CardBody>

      <CardFooter className="d-flex justify-content-between align-items-center">
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
              className="form-control d-inline w-25"
            />
          ) : (
            data.date
          )}
        </div>

        <ButtonGroup aria-label="Task actions">
          {isEditing ? (
            <>
              <Button variant="primary" size="sm" onClick={handleSaveChanges}>
                Save
              </Button>
              <Button variant="primary" size="sm" onClick={handleUndoChanges}>
                Return
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="w-33"
                onClick={handleCompleteTask}
              >
                &#10003;
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="w-33"
                onClick={handleUpdateTask}
              >
                &#9998;
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="w-33"
                onClick={handleDeleteTask}
              >
                &#128465;
              </Button>
            </>
          )}
        </ButtonGroup>
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
