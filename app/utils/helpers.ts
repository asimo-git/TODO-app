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

export function isTodayMatchingInterval(
  startDate: string,
  interval: number
): boolean {
  const start = new Date(startDate);
  const today = new Date();

  // start.setHours(0, 0, 0, 0);
  // today.setHours(0, 0, 0, 0);

  const differenceInDays = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return differenceInDays >= 0 && differenceInDays % interval === 0;
}

export function isTodayMatchingWeekDays(daysArray: string[]): boolean {
  const today = new Date().getDay();
  return daysArray.includes(String(today));
}
