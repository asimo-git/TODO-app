import { Card, CardBody, CardFooter } from "react-bootstrap";
import { SavedTask } from "../utils/interfaces";
import { Entry, Priority } from "../utils/constatnts";

export default function TaskCard({ data }: { data: SavedTask }) {
  const priorityFontSize =
    data.priority === Priority[0]
      ? "fs-5"
      : data.priority === Priority[2]
      ? "fs-2"
      : "fs-4";

  const typeColor =
    data.type === Entry[0]
      ? "bg-light"
      : data.type === Entry[1]
      ? "bg-success"
      : "bg-info";

  return (
    <Card className={`${typeColor} mb-2`}>
      <CardBody className={priorityFontSize}>{data.task}</CardBody>
      <CardFooter>{data.date}</CardFooter>
    </Card>
  );
}
