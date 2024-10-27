import { Entry, Priority } from "./constatnts";

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
