"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

enum Entry {
  task,
  heap,
  habit,
}

export default function NewEntryForm() {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const entryType =
    lastSegment === Entry[1] || lastSegment === Entry[2]
      ? lastSegment
      : Entry[0];

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState("");
  const [frequency, setFrequency] = useState("none");
  const [repetition, setRepetition] = useState("1");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ task, priority, date, frequency, repetition });
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
  );
}
