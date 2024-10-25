import { Entry } from "./constatnts";

export interface Task {
  task: string;
  priority: string;
  date: string;
  frequency?: string;
  repetition?: string;
  type: Entry;
}

export interface SavedTask extends Task {
  id: string;
  completedDate?: Date;
}
