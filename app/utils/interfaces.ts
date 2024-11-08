import { Entry, Priority } from "./constatnts";

export interface Task {
  task: string;
  priority: Priority;
  date: string;
  frequency?: string;
  repetition?: string;
  type: Entry;
}

export interface SavedTask extends Task {
  id: string;
  completedDate?: string;
  completedCounter?: string[];
  counterPerWeek?: string;
}
