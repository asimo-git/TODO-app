"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { Entry, Priority } from "@/app/utils/constatnts";
import { saveNewTask } from "@/app/utils/helpers";

export default function NewEntryForm() {
  // TODO make a custom hook
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const entryType =
    lastSegment === Entry[1] || lastSegment === Entry[2]
      ? lastSegment
      : Entry[0];
  /////////////////////

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(Priority[1]);
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState("none");
  const [repetition, setRepetition] = useState("1");
  const [isSuccessSaveStatus, setIsSuccessSaveStatus] = useState<
    boolean | null
  >(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const isSuccess = await saveNewTask({
      type: entryType,
      data: { task, priority, date, frequency, repetition },
    });
    setIsSuccessSaveStatus(isSuccess);
  }

  return (
    <>
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
                onChange={(e) => setPriority(e.target.value)}
                required
              >
                <option value={Priority[0]}>{Priority[0]}</option>
                <option value={Priority[1]}>{Priority[1]}</option>
                <option value={Priority[2]}>{Priority[2]}</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="taskDate" className="mb-3">
              <Form.Label>
                {entryType === Entry[2]
                  ? "Start"
                  : entryType === Entry[1]
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
          <Form.Group controlId="taskFrequency" className="mb-3">
            <Form.Label>Repetition Frequency</Form.Label>
            <Form.Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Form.Select>
          </Form.Group>
        )}

        {lastSegment === "heap" && (
          <Form.Group controlId="repetitionCount" className="mb-3">
            <Form.Label>Repetition count</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number"
              value={repetition}
              onChange={(e) => setRepetition(e.target.value)}
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
    </>
  );
}
