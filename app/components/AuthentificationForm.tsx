"use client";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { auth } from "../services/firebase";
import { FirebaseErrors } from "../utils/constatnts";
import { AuthContext } from "../utils/context";

export default function AuthentificationForm({
  type,
}: {
  type: "login" | "register";
}) {
  const { user } = useContext(AuthContext);
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
      if (error instanceof FirebaseError && error.code in FirebaseErrors) {
        setError(FirebaseErrors[error.code as keyof typeof FirebaseErrors]);
      } else {
        setError("unknown error, please try again later");
      }
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <Container style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">{type === "login" ? "Log in" : "Register"}</h2>
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
            style={{ marginTop: "2.3rem" }}
            className="position-absolute top-0 end-0 me-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Image
              src={showPassword ? "/eye-off.svg" : "/eye-show.svg"}
              alt={showPassword ? "hide password" : "show password"}
              width={30}
              height={30}
            />
          </Button>
          {type === "register" && (
            <div className="fs-6">
              *The password should be at least six characters long. The rest is
              up to you.
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <a href={type === "login" ? "/register" : "/login"} className="ms-3">
          {type === "login" ? "Register" : "Log in"}
        </a>
      </Form>
    </Container>
  );
}
