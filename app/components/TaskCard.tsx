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
import { deleteTask } from "../utils/helpers";

export default function TaskCard({
  data,
  onDelete,
}: {
  data: SavedTask;
  onDelete: (id: string, type: Entry) => void;
}) {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

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

  const handleDeleteTask = async () => {
    setError(null);
    if (user) {
      const response = await deleteTask(user?.uid, data.id);
      if (response) {
        onDelete(data.id, data.type);
      } else {
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  return (
    <Card className={`${typeColor} mb-2`}>
      <CardTitle className={`${priorityFontSize} m-3`}>{data.task}</CardTitle>
      {data.frequency && <CardBody>Frequency: {data.frequency}</CardBody>}
      {data.repetition && <CardBody>Repetition: {data.repetition}</CardBody>}
      <CardFooter className="d-flex justify-content-between align-items-center">
        <span>
          {data.type === Entry.task
            ? "Data"
            : data.type === Entry.heap
            ? "Deadline"
            : "Start"}{" "}
          - {data.date}
        </span>
        <ButtonGroup aria-label="Task actions">
          <Button variant="secondary" size="sm" className="w-33">
            &#10003;
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="w-33"
            // onClick={handleUpdateTask}
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
