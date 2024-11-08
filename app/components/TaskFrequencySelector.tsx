import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { decodeFrequency } from "../utils/helpers";
import { daysOfWeek, Frequency } from "../utils/constatnts";

export default function TaskFrequencySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [intervalDays, setIntervalDays] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysPerWeek, setDaysPerWeek] = useState("");

  useEffect(() => {
    const FrequencyValue = decodeFrequency(value);
    setFrequency(FrequencyValue);
    if (FrequencyValue === "interval") {
      setIntervalDays(value.split("-")[1] || "");
    } else if (FrequencyValue === "weekly" && value) {
      const daysOfWeeks = value.split(",");
      setSelectedDays(daysOfWeeks);
    } else if (FrequencyValue === "counter" && value) {
      const counter = value.split("-")[1] || "";
      setDaysPerWeek(counter);
    }
  }, [value]);

  useEffect(() => {
    if (frequency === "daily") {
      onChange(frequency);
    } else if (frequency === "interval" && intervalDays) {
      onChange(`interval-${intervalDays}`);
    } else if (frequency === "weekly" && selectedDays.length > 0) {
      onChange(selectedDays.join(","));
    } else if (frequency === "counter" && daysPerWeek) {
      onChange(`daysPerWeek-${daysPerWeek}`);
    }
  }, [frequency, intervalDays, selectedDays]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(selectedValue)) {
        return prevSelectedDays.filter((day) => day !== selectedValue);
      } else {
        return [...prevSelectedDays, selectedValue];
      }
    });
  };

  return (
    <Form.Group controlId="taskFrequency" className="mb-3">
      <Form.Label>Repetition Frequency</Form.Label>
      <Form.Select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as Frequency)}
        className="d-inline w-25 mx-2"
      >
        <option value="daily">Daily</option>
        <option value="interval">Interval in days ➡</option>
        <option value="weekly">By days of the week ➡</option>
        <option value="counter">Days per week ➡</option>
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
            required
          />
        </Form.Group>
      )}

      {frequency === "weekly" && (
        <Form.Group controlId="daysOfWeek" className="mt-3">
          <Form.Label>Select days of the week:</Form.Label>
          <select
            multiple
            value={selectedDays}
            onChange={handleSelectChange}
            required
            size={daysOfWeek.length}
            className="form-select"
            style={{ overflowY: "auto" }}
          >
            {daysOfWeek.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
        </Form.Group>
      )}

      {frequency === "counter" && (
        <Form.Group controlId="counterDays" className="mt-3">
          <Form.Label>Enter the number of days per week:</Form.Label>
          <Form.Control
            type="text"
            inputMode="numeric"
            min="1"
            value={daysPerWeek}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "");
              setDaysPerWeek(onlyDigits);
            }}
            style={{ maxWidth: "100px" }}
            required
          />
        </Form.Group>
      )}
    </Form.Group>
  );
}
