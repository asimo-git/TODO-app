import React, { useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import { decodeFrequency } from "../utils/helpers";
import { DaysOfWeek } from "../utils/constatnts";

export default function TaskFrequencySelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const [frequency, setFrequency] = useState<string | undefined>(undefined);
  const [intervalDays, setIntervalDays] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  useEffect(() => {
    const FrequencyValue = decodeFrequency(value);
    setFrequency(FrequencyValue);
    if (FrequencyValue === "interval") {
      setIntervalDays(value || "");
    } else if (FrequencyValue === "weekly" && value) {
      const daysOfWeeks = value.split(",").map((day) => +day);
      setSelectedDays(daysOfWeeks);
    }
  }, []);

  useEffect(() => {
    if (frequency === "daily") {
      onChange(frequency);
    } else if (frequency === "interval" && intervalDays) {
      onChange(intervalDays);
    } else if (frequency === "weekly" && selectedDays.length > 0) {
      onChange(selectedDays.join(","));
    }
  }, [frequency, intervalDays, selectedDays]);

  const handleCheckboxChange = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const daysOfWeekOptions = useMemo(
    () =>
      Object.keys(DaysOfWeek)
        .filter((key) => isNaN(Number(key)))
        .map((day, index) => (
          <Form.Check
            key={day}
            type="checkbox"
            label={day}
            checked={selectedDays.includes(index)}
            onChange={() => handleCheckboxChange(index)}
            className="ms-3"
          />
        )),
    [selectedDays]
  );

  return (
    <Form.Group controlId="taskFrequency" className="mb-3">
      <Form.Label>Repetition Frequency</Form.Label>
      <Form.Select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="d-inline w-25 mx-2"
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="interval">Interval in days ➡</option>
        <option value="weekly">By days of the week ➡</option>
      </Form.Select>

      {frequency === "interval" && (
        <Form.Group controlId="intervalDays" className="mt-3">
          <Form.Label>Enter interval in days:</Form.Label>
          <Form.Control
            type="text"
            inputMode="numeric"
            min="2"
            value={intervalDays}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              setIntervalDays(onlyDigits);
            }}
            style={{ maxWidth: "100px" }}
          />
        </Form.Group>
      )}

      {frequency === "weekly" && (
        <Form.Group controlId="daysOfWeek" className="mt-3">
          <Form.Label>Select days of the week:</Form.Label>
          <div className="d-flex flex-wrap">{daysOfWeekOptions}</div>
        </Form.Group>
      )}
    </Form.Group>
  );
}
