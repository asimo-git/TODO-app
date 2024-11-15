"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { saveNewTask } from "@/app/services/firebase";
import { Entry, Priority } from "@/app/utils/constatnts";
import { AuthContext } from "@/app/utils/context";
import { useContext, useState } from "react";
import { Button, Col, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import TaskFrequencySelector from "../components/TaskPool/TaskFrequencySelector";
import { Task } from "../utils/interfaces";

export default function NewEntryForm() {
  const { user } = useContext(AuthContext);

  const [type, setType] = useState(Entry.task);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState(Priority.medium);
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [repetition, setRepetition] = useState("");

  const [isSuccessSaveStatus, setIsSuccessSaveStatus] = useState<
    boolean | null
  >(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      const data: Task = {
        task,
        priority,
        date,
        // frequency,
        // repetition,
        type,
      };
      if (data.type === Entry.habit) data.frequency = frequency;
      if (repetition) data.repetition = repetition;

      // const filteredData = JSON.parse(JSON.stringify(data));
      try {
        await saveNewTask({
          uid: user?.uid,
          data,
        });
        setIsSuccessSaveStatus(true);
        setTask("");
        setDate("");
        setFrequency("daily");
        setRepetition("");
        console.log(data);
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
          <Form.Label className="fs-4">Add new: </Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => setType(e.target.value as Entry)}
            className="d-inline w-25 mx-2 mb-4 fs-4"
          >
            <option value={Entry.task}>{Entry.task}</option>
            <option value={Entry.habit}>{Entry.habit}</option>
            <option value={Entry.heap}>{Entry.heap}</option>
          </Form.Select>

          <Form.Control
            type="text"
            placeholder={`Enter ${type}`}
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
                {type === Entry.habit
                  ? "Start"
                  : type === Entry.heap
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

        {type === "habit" && (
          <TaskFrequencySelector value={frequency} onChange={setFrequency} />
        )}

        {type === "heap" && (
          <Form.Group controlId="repetitionCount" className="mb-3">
            <Form.Label>Repetition count</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              placeholder="Enter number"
              value={repetition}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setRepetition(onlyDigits);
              }}
              required
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit">
          {`Add ${type}`}
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
