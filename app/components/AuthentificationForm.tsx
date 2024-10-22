"use client";
import { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

export default function AuthentificationForm({
  type,
}: {
  type: "login" | "register";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (type === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        // TODO - add error messages
        setError(error.code);
      } else {
        setError("unknown error, please try again later");
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>{type === "login" ? "Log in" : "Register"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group
          controlId="formBasicPassword"
          className="mb-3 position-relative"
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            variant="link"
            style={{ marginTop: "2rem" }}
            className="position-absolute top-0 end-0 me-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </Button>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
