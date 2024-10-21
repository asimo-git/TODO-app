export interface Task {
  task: string;
  priority: string;
  date: string;
  frequency?: string;
  repetition?: string;
}

export interface SavedTask extends Task {
  id: string;
  type: string;
}
