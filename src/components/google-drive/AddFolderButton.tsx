import React, { FormEventHandler, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { database, Document, DocumentId } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

type AddFolderButtonProps = {
  currentFolder: Document | null;
};
export const AddFolderButton = ({ currentFolder }: AddFolderButtonProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { currentUser } = useAuth();

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!currentFolder) {
      return;
    }

    const path: DocumentId[] = currentFolder.path.slice();
    if (currentFolder.id) {
      path.push(currentFolder.id);
    }

    database.folders.add({
      name,
      parentId: currentFolder.id,
      userId: currentUser.uid,
      path,
      createdAt: database.getCurrentTimestamp(),
    });
    setName("");
    closeModal();
  };

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
