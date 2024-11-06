import { Container } from "react-bootstrap";

export default function Header() {
  return (
    <header>
      <Container className="d-flex justify-content-between align-items-center">
        <a href="/" className="m-2">
          <img src="/book-opened.svg" alt="Logo" width="40" height="40" />
        </a>
      </Container>
    </header>
  );
}
