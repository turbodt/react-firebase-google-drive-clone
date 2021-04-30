import React, { FormEventHandler, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { CenteredContainer } from "./CenteredContainer";

export const UpdateProfile = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    const operations: Promise<any>[] = [];

    if (!email) {
      return setError("Invalid email");
    }

    if (password !== passwordConfirm) {
      return setError("Password do not match");
    }

    if (email !== currentUser.email) {
      operations.push(updateEmail(email));
    }

    if (password) {
      operations.push(updatePassword(password));
    }

    setError("");
    setLoading(true);
    await Promise.all(operations)
      .then((_) => history.push("/"))
      .catch((_) => setError("Failed to create account"));
    setLoading(false);
  };

  return (
    <CenteredContainer>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                ref={emailRef}
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
                defaultValue=""
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                type="password"
                required
                ref={passwordConfirmRef}
                placeholder="Leave blank to keep the same"
                defaultValue=""
              />
            </Form.Group>
            <Button className="w-100" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </CenteredContainer>
  );
};
