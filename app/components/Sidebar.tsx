"use client";
import { useState } from "react";
import { Collapse, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Entry } from "../utils/constatnts";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Navbar expand="sm" className="position-static align-items-start ">
        <Container>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            className="position-absolute bg-primary d-sm-none"
            style={{ top: "0.5rem", right: "0.5rem" }}
          />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            className="pe-5"
          >
            <Offcanvas.Body>
              <Nav className="flex-column">
                <Nav.Item>
                  <Nav.Link onClick={() => setOpen((prev) => !prev)}>
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
                <Nav.Link href="/todo">ToDo</Nav.Link>
                <Nav.Link href="/done">Done</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}
