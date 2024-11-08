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

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export type TaskType = "todo" | "done";

export type Frequency = "daily" | "weekly" | "interval" | "counter";

export type FirestoreSection = "tasks" | "completed";

export enum FirebaseErrors {
  "auth/invalid-credential" = "Invalid credentials",
  "auth/weak-password" = "The password is too weak",
  "auth/user-not-found" = "User not found",
  "auth/wrong-password" = "Wrong password",
  "auth/invalid-email" = "Incorrect email format",
  "auth/email-already-in-use" = "Email is already in use",
}
