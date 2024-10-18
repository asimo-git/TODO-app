import { Card, CardBody, Form, FormCheck } from "react-bootstrap";

export default function TodayPanel() {
  return (
    <Card
      style={{ width: "fit-content" }}
      className="m-2 d-flex flex-column align-items-center p-3"
    >
      <CardBody>
        <h2>Today:</h2>
        <Form>
          <FormCheck type="checkbox" label={`default task`} />
          <FormCheck type="checkbox" label={`default task`} />
          <FormCheck type="checkbox" label={`default task`} />
        </Form>
      </CardBody>
    </Card>
  );
}
