"use client";
import { SavedTask } from "@/app/utils/interfaces";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarField({
  selectedTask,
}: {
  selectedTask: SavedTask | null;
}) {
  const addClassToDate = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (
      selectedTask &&
      selectedTask.completedCounter &&
      selectedTask?.completedCounter.includes(formattedDate)
    ) {
      return "bg-primary rounded-5";
    }
    return null;
  };

  return <Calendar className={"mt-2"} tileClassName={addClassToDate} />;
}
