import { Button, ButtonGroup } from "react-bootstrap";
import { TaskType } from "../utils/constatnts";

interface ActionButtonGroupProps {
  isEditing: boolean;
  onSaveChanges: () => void;
  onUndoChanges: () => void;
  onChangeStatus: () => void;
  onUpdateTask: () => void;
  onDeleteTask: () => void;
  typeTask: TaskType;
}

export default function ActionButtonGroup({
  isEditing,
  onUndoChanges,
  onSaveChanges,
  onChangeStatus,
  onUpdateTask,
  onDeleteTask,
  typeTask,
}: ActionButtonGroupProps) {
  return (
    <ButtonGroup aria-label="Task actions">
      {isEditing ? (
        <>
          <Button variant="primary" size="sm" onClick={onSaveChanges}>
            Save
          </Button>
          <Button variant="primary" size="sm" onClick={onUndoChanges}>
            Return
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="secondary"
            size="sm"
            className="w-33"
            onClick={onChangeStatus}
          >
            {typeTask === "todo" ? "\u2713" : "\u21A9"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="w-33"
            onClick={onUpdateTask}
          >
            &#9998;
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="w-33"
            onClick={onDeleteTask}
          >
            &#128465;
          </Button>
        </>
      )}
    </ButtonGroup>
  );
}
