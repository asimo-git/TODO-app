import { Task } from "./interfaces";

export function saveNewTask({ type, data }: { type: string; data: Task }) {
  const existingTasks = localStorage.getItem(type);
  const tasks = existingTasks ? JSON.parse(existingTasks) : [];

  tasks.push({ ...data, id: new Date().toISOString(), type });

  localStorage.setItem(type, JSON.stringify(tasks));
}
