import { Button, ButtonGroup } from "react-bootstrap";

interface ActionButtonGroupProps {
  isEditing: boolean;
  onSaveChanges: () => void;
  onUndoChanges: () => void;
  onCompleteTask: () => void;
  onUpdateTask: () => void;
  onDeleteTask: () => void;
}

export default function ActionButtonGroup({
  isEditing,
  onUndoChanges,
  onSaveChanges,
  onCompleteTask,
  onUpdateTask,
  onDeleteTask,
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
            onClick={onCompleteTask}
          >
            &#10003;
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
