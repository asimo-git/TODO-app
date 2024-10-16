import { Button, Container } from "react-bootstrap";

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "var(--foreground)",
        color: "var(--background)",
      }}
    >
      <Container className="d-flex justify-content-between align-items-center">
        <a href="/" className="m-2">
          <img src="/eye-svgrepo-com.svg" alt="Logo" width="40" height="40" />
        </a>

        <div>
          <Button>Log out</Button>
        </div>
      </Container>
    </header>
  );
}
