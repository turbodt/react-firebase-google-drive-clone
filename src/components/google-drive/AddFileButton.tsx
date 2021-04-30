import React, { ChangeEventHandler } from "react";
import ReactDOM from "react-dom";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStorage } from "../../hooks/useStorage";
import { Document } from "../../firebase";
import { ProgressBar, Toast } from "react-bootstrap";

interface AddFileButtonProps {
  currentFolder: Document;
}
export const AddFileButton = ({ currentFolder }: AddFileButtonProps) => {
  const [{ uploadingFiles }, uploadFile] = useStorage(currentFolder);

  const handleUpload: ChangeEventHandler = (e) => {
    if (!currentFolder) return;
    const files = (e.target as HTMLInputElement).files as FileList;
    Array.from(files).forEach(uploadFile);
  };

  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <FontAwesomeIcon icon={faFileUpload} />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
          multiple
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map((file) => (
              <Toast key={file.id} onClose={() => {}}>
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};
