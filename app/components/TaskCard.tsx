import { Alert, Card, CardBody, CardFooter, CardTitle } from "react-bootstrap";
import { SavedTask } from "../utils/interfaces";
import { Entry } from "../utils/constatnts";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../utils/context";
import { deleteTask, saveNewTask, updateTask } from "../services/firebase";
import ActionButtonGroup from "./ActionButtonGroup";
import { getPriorityFontSize, getTypeColor } from "../utils/helpers";

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
        await deleteTask(user?.uid, data.id);
        onDelete(data.id, data.type);
      } catch (error) {
        console.error("Error deleting task:", error);
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleCompleteTask = async () => {
    const doneTask = { ...data, completedDate: new Date() };
    try {
      await saveNewTask({
        uid: user?.uid || "",
        data: doneTask,
      });
      handleDeleteTask();
    } catch (error) {
      console.error("Error while saving task:", error);
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

        <ActionButtonGroup
          isEditing={isEditing}
          onCompleteTask={handleCompleteTask}
          onSaveChanges={handleSaveChanges}
          onUndoChanges={handleUndoChanges}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
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
