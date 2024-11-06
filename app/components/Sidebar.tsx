"use client";
import { useContext, useState } from "react";
import { Collapse, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Entry } from "../utils/constatnts";
import { AuthContext } from "../utils/context";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const pathname = usePathname();

  return (
    <Navbar expand="sm" className="position-static align-items-start">
      <Navbar.Toggle
        aria-controls="offcanvasNavbar"
        className="position-absolute bg-primary d-sm-none"
        style={{ top: "0.5rem", right: "0.5rem" }}
      />
      <Navbar.Offcanvas
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel"></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column ps-2">
            <Nav.Link href="/" active={pathname === "/"}>
              Today
            </Nav.Link>
            <Nav.Item>
              <Nav.Link
                onClick={() => setOpen((prev) => !prev)}
                className="text-nowrap pe-5"
                active={pathname.includes("/create")}
              >
                Add new
              </Nav.Link>
              <Collapse in={open}>
                <Nav className="flex-column ms-3">
                  <Nav.Link href={`/create/${Entry.task}`}>
                    {Entry.task}
                  </Nav.Link>
                  <Nav.Link href={`/create/${Entry.heap}`}>
                    {Entry.heap}
                  </Nav.Link>
                  <Nav.Link href={`/create/${Entry.habit}`}>
                    {Entry.habit}
                  </Nav.Link>
                </Nav>
              </Collapse>
            </Nav.Item>
            <Nav.Link href="/todo" active={pathname === "/todo"}>
              ToDo
            </Nav.Link>
            <Nav.Link href="/done" active={pathname === "/done"}>
              Done
            </Nav.Link>
            {user && <Nav.Link onClick={() => signOut(auth)}>Log out</Nav.Link>}
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  );
}
