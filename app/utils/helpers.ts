import { DaysOfWeek, Entry, Priority } from "./constatnts";

export const getPriorityFontSize = (priority: Priority) => {
  switch (priority) {
    case Priority.low:
      return "fs-5";
    case Priority.high:
      return "fs-2";
    default:
      return "fs-4";
  }
};

export const getTypeColor = (type: Entry) => {
  switch (type) {
    case Entry.task:
      return "bg-light";
    case Entry.heap:
      return "bg-success";
    default:
      return "bg-info";
  }
};

export const decodeFrequency = (value: string | undefined) => {
  if (!value) return undefined;
  if (value === "daily") return "daily";
  return isNaN(Number(value)) ? "weekly" : "interval";
};

export const decodeFrequencyToText = (value: string) => {
  if (value === "daily") return "daily";
  return isNaN(Number(value))
    ? value
        .split(",")
        .map((day) => DaysOfWeek[+day])
        .join(", ")
    : `every ${+value} days`;
};
