"use client";

import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { Entry, Priority } from "@/app/utils/constatnts";
import { AuthContext } from "@/app/utils/context";
import { saveNewTask } from "@/app/services/firebase";
import TaskFrequencySelector from "@/app/components/TaskFrequencySelector";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function NewEntryForm() {
  // TODO make a custom hook
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const entryType =
    lastSegment === Entry.heap || lastSegment === Entry.habit
      ? lastSegment
      : Entry.task;
  /////////////////////

  const { user } = useContext(AuthContext);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(Priority.medium);
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState<string | undefined>(undefined);
  const [repetition, setRepetition] = useState<string | undefined>(undefined);
  const [isSuccessSaveStatus, setIsSuccessSaveStatus] = useState<
    boolean | null
  >(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      const data = {
        task,
        priority,
        date,
        frequency,
        repetition,
        type: entryType,
      };
      const filteredData = JSON.parse(JSON.stringify(data));
      try {
        await saveNewTask({
          uid: user?.uid,
          data: filteredData,
        });
        setIsSuccessSaveStatus(true);
      } catch {
        setIsSuccessSaveStatus(false);
      }
    }
  }

  return (
    <ProtectedRoute>
      <Form
        onSubmit={handleSubmit}
        style={{ maxWidth: "800px" }}
        className="position-relative"
      >
        <Form.Group controlId="taskText" className="mb-3">
          <Form.Label>
            {entryType.charAt(0).toUpperCase() + entryType.slice(1)}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder={`Enter ${entryType}`}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group controlId="taskPriority" className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                required
              >
                <option value={Priority.low}>{Priority.low}</option>
                <option value={Priority.medium}>{Priority.medium}</option>
                <option value={Priority.high}>{Priority.high}</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="taskDate" className="mb-3">
              <Form.Label>
                {entryType === Entry.habit
                  ? "Start"
                  : entryType === Entry.heap
                  ? "Deadline"
                  : "Date"}
              </Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {lastSegment === "habit" && (
          <TaskFrequencySelector value={frequency} onChange={setFrequency} />
        )}

        {lastSegment === "heap" && (
          <Form.Group controlId="repetitionCount" className="mb-3">
            <Form.Label>Repetition count</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              placeholder="Enter number"
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setRepetition(onlyDigits);
              }}
              required
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          {`Add ${entryType}`}
        </Button>
      </Form>

      <div className="position-relative">
        <ToastContainer position="top-start" className="p-3">
          <Toast
            onClose={() => setIsSuccessSaveStatus(null)}
            show={isSuccessSaveStatus !== null}
            delay={3000}
            autohide
          >
            <Toast.Body
              className={
                isSuccessSaveStatus === false ? "text-danger" : "text-success"
              }
            >
              {isSuccessSaveStatus === false
                ? "save error"
                : "saved successfully"}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </ProtectedRoute>
  );
}
