import React from "react";
import { Navbar as NavbarBase, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Navbar = () => (
  <NavbarBase bg="light" expand="sm">
    <NavbarBase.Brand as={Link} to="/">
      WDS Drive
    </NavbarBase.Brand>
    <Nav>
      <Nav.Link as={Link} to="/user">
        Profile
      </Nav.Link>
    </Nav>
  </NavbarBase>
);
