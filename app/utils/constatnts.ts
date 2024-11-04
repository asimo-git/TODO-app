export enum Entry {
  task = "task",
  heap = "heap",
  habit = "habit",
}

export enum Priority {
  low = "Low",
  medium = "Medium",
  high = "High",
}

export enum DaysOfWeek {
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
}

export type TaskType = "todo" | "done";

export type FirestoreSection = "tasks" | "completed";
