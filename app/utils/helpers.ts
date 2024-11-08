import { daysOfWeek, Entry, Frequency, Priority } from "./constatnts";

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

export const decodeFrequency = (value: string): Frequency => {
  if (!value || value === "daily") return "daily";
  if (value.startsWith("interval")) return "interval";
  return value.startsWith("daysPerWeek") ? "counter" : "weekly";
};

export const decodeFrequencyToText = (value: string) => {
  if (value === "daily") return "daily";
  if (value.startsWith("daysPerWeek"))
    return `${value.split("-")[1]} days per week`;
  return value.startsWith("interval")
    ? `every ${value.split("-")[1]} days`
    : value
        .split(",")
        .map((day) => daysOfWeek[+day])
        .join(", ");
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
