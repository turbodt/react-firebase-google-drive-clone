import React, { ReactNode } from "react";
import { Container } from "react-bootstrap";

type ICenteredContainer = any & {
  children: ReactNode;
};
export const CenteredContainer = ({ children }: ICenteredContainer) => (
  <Container className="d-flex align-items-center justify-content-center h-100">
    <div className="w-100" style={{ maxWidth: "400px" }}>
      {children}
    </div>
  </Container>
);
