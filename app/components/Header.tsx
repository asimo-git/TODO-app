"use client";
import { Button, Container } from "react-bootstrap";
import { useAuth } from "../utils/hooks";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header>
      <Container className="d-flex justify-content-between align-items-center">
        <a href="/" className="m-2">
          <img src="/eye-svgrepo-com.svg" alt="Logo" width="40" height="40" />
        </a>
        {user && <Button onClick={() => signOut(auth)}>Log out</Button>}
      </Container>
    </header>
  );
}
